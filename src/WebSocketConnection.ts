import { ClientPacket, ServerPacket } from "./Packet";

type ServerPacketType = ServerPacket["packetType"];
type ServerPacketCallback = (packet: ServerPacket) => void

// IDK what this magic is, but it's very fun to use
const EventTypes = ["onConnect", "onDisconnect", "onError"] as const;
type EventType = typeof EventTypes[number];
type EventCallback = (event: Event) => void;


// Thanks vdv
// Generics needed for... some reason
function tupleToObject<TKeys extends readonly PropertyKey[], TValue>(keys: TKeys, value: () => TValue) {
    return Object.fromEntries(keys.map((key) => [key, value()])) as {[key in TKeys[number]]: TValue}
}


export class WebSocketServerPacketSubscription {
    readonly type: ServerPacketType;
    readonly callback: ServerPacketCallback;
    active: boolean = true;

    constructor(type: ServerPacketType, callback: ServerPacketCallback) {
        this.type = type;
        this.callback = callback;
    }
}

export class WebSocketEventSubscription {
    readonly type: EventType;
    readonly callback: EventCallback;
    active: boolean = true;

    constructor(type: EventType, callback: EventCallback) {
        this.type = type;
        this.callback = callback;
    }
}


export default class WebSocketConnection {
    private connection: WebSocket;
    private readonly eventSubscriptions = tupleToObject(EventTypes, (): WebSocketEventSubscription[] => []);
    private readonly serverPacketSubscriptions: Partial<Record<ServerPacketType, WebSocketServerPacketSubscription[]>> = {};

    constructor(url: string) {
        this.connection = new WebSocket(url);
        this.connection.onopen = this.onConnect.bind(this);
        this.connection.onclose = this.onDisconnect.bind(this);
        this.connection.onerror = this.onError.bind(this);
        this.connection.onmessage = this.onMessage.bind(this);

        // Fallback, ensures the server always knows when we've disconnected
        window.addEventListener("beforeunload", () => {
            this.close();
        });

        // If we're already open and subscriptions weren't set up in time, fire them
        if (this.connection.OPEN) {
            this.onConnect(new Event("open"));
        }
    }
    
    private onConnect(event: Event) {
        for (const subscription of this.eventSubscriptions["onConnect"].filter(item => item.active === true)) {
            subscription.callback(event);
        }
    }

    private onDisconnect(event: CloseEvent) {
        for (const subscription of this.eventSubscriptions["onDisconnect"].filter(item => item.active === true)) {
            subscription.callback(event);
        }
    }

    private onError(event: Event) {
        for (const subscription of this.eventSubscriptions["onError"].filter(item => item.active === true)) {
            subscription.callback(event);
        }
    }

    private onMessage(event: MessageEvent) {
        const packetData = JSON.parse(event.data) as ServerPacket;
        console.log("Got packet: ", packetData);
        // Handle if we haven't initialize an array of subscriptions for this type
        for (const subscription of (this.serverPacketSubscriptions[packetData["packetType"]] ?? []).filter(item => item.active === true)) {
            subscription.callback(packetData);
        }
    }

    send(message: ClientPacket) {
        this.connection.send(JSON.stringify(message));
    }


    close(code?: number, reason?: string) {
        this.connection.close(code, reason);
    }

    get state(): string {
        return {0: "Connecting", 1: "Open", 2: "Closing", 3: "Closed"}[this.connection.readyState]!;
    }

    waitForServerPacket(type: ServerPacketType): Promise<ServerPacket>;
    waitForServerPacket(type: ServerPacketType[]): Promise<ServerPacket>;
    waitForServerPacket(type: ServerPacketType | ServerPacketType[]): Promise<ServerPacket> {
        if (Array.isArray(type)) {
            return new Promise((resolve) => {
                const subscriptions: WebSocketServerPacketSubscription[] = [];
                const endAll = (packet: ServerPacket) => {
                    for (const subscription of subscriptions) {
                        this.unsubscribeFromServerPacket(subscription);
                    }
                    resolve(packet);
                }
                for (const serverPacketType of type) {
                    subscriptions.push(this.subscribeToServerPacket(serverPacketType, endAll));
                }
            });
        } else {
            return new Promise((resolve) => {
                const subscription = this.subscribeToServerPacket(type, (packet: ServerPacket) => {
                    resolve(packet);
                    this.unsubscribeFromServerPacket(subscription);
                });
            });
        }
    }

    subscribeToEvent(type: EventType, callback: EventCallback) {
        const subscription = new WebSocketEventSubscription(type, callback);
        this.eventSubscriptions[type].push(subscription);
        return subscription;
    }

    subscribeToServerPacket(type: ServerPacketType, callback: ServerPacketCallback) {
        const subscription = new WebSocketServerPacketSubscription(type, callback);
        this.serverPacketSubscriptions[type] ??= [];
        // as unknown cast because the generics are actually the same... but different
        this.serverPacketSubscriptions[type]!.push(subscription); // TS, why do you not see that ??= creates it
        return subscription;
    }

    unsubscribeFromEvent(subscription: WebSocketEventSubscription) {
        subscription.active = false;
        this.eventSubscriptions[subscription.type] = this.eventSubscriptions[subscription.type].filter((item) => item !== subscription);
    }

    unsubscribeFromServerPacket(subscription: WebSocketServerPacketSubscription) {
        subscription.active = false;
        this.serverPacketSubscriptions[subscription.type] = this.serverPacketSubscriptions[subscription.type]!.filter((item) => item !== subscription); // It's guaranteed to exist, ! is safe
    }
}