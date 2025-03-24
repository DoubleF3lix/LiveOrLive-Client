import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getHubProxyFactory, getReceiverRegister } from "~/types/generated/TypedSignalR.Client";
import { IBaseGameRequest, IBaseGameResponse, IChatRequest, IChatResponse, IConnectionRequest, IConnectionResponse, IGameLogRequest, IGameLogResponse, IGenericRequest, IGenericResponse, IHubServerResponse, IItemRequest, IItemResponse } from "~/types/generated/TypedSignalR.Client/liveorlive_server.HubPartials";
import { ChatMessage, GameLogMessage, Player, GameData } from "~/types/generated/liveorlive_server";
import { BulletType, Item } from "~/types/generated/liveorlive_server.Enums";
import { BASE_URL } from "~/lib/const";


type ResponseCallback<K extends keyof IHubServerResponse = keyof IHubServerResponse> = IHubServerResponse[K];
type Subscriptions = { [K in keyof IHubServerResponse]: Set<ResponseCallback<K>> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callFunction<T extends (...args: any) => any>(func: T, ...args: Parameters<T>): ReturnType<T> {
    return func(...args);
}

export class ServerConnection implements IChatRequest, IGameLogRequest, IConnectionRequest, IBaseGameRequest, IGenericRequest, IItemRequest {
    private readonly connection: HubConnection;
    private readonly chatHubProxy: IChatRequest;
    private readonly gameLogHubProxy: IGameLogRequest;
    private readonly connectionHubProxy: IConnectionRequest;
    private readonly baseGameHubProxy: IBaseGameRequest;
    // private readonly genericHubProxy: IGenericRequest;
    private readonly itemHubProxy: IItemRequest;

    private readonly chatReceiver: IChatResponse;
    private readonly gameLogReceiver: IGameLogResponse;
    private readonly connectionReceiver: IConnectionResponse;
    private readonly baseGameReceiver: IBaseGameResponse;
    private readonly genericReceiver: IGenericResponse;
    private readonly itemReceiver: IItemResponse;

    subscriptions: Subscriptions;

    open: boolean = false;

    constructor(lobbyId: string, username: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}?lobbyId=${lobbyId}&username=${username}`)
            .configureLogging(LogLevel.Warning)
            .build();

        this.chatHubProxy = getHubProxyFactory("IChatRequest").createHubProxy(this.connection);
        this.gameLogHubProxy = getHubProxyFactory("IGameLogRequest").createHubProxy(this.connection);
        this.connectionHubProxy = getHubProxyFactory("IConnectionRequest").createHubProxy(this.connection);
        this.baseGameHubProxy = getHubProxyFactory("IBaseGameRequest").createHubProxy(this.connection);
        // this.genericHubProxy = getHubProxyFactory("IGenericRequest").createHubProxy(this.connection); // This has no methods to implement yet
        this.itemHubProxy = getHubProxyFactory("IItemRequest").createHubProxy(this.connection);

        this.chatReceiver = {
            chatMessageSent: async (message: ChatMessage): Promise<void> => this.sendSubscription("chatMessageSent", message),
            getChatMessagesResponse: async (messages: ChatMessage[]): Promise<void> => this.sendSubscription("getChatMessagesResponse", messages),
            chatMessageDeleted: async (messageId: string): Promise<void> => this.sendSubscription("chatMessageDeleted", messageId),
            chatMessageEdited: async (messageId: string, content: string): Promise<void> => this.sendSubscription("chatMessageEdited", messageId, content)
        };

        this.gameLogReceiver = {
            getGameLogResponse: async (messages: GameLogMessage[]): Promise<void> => this.sendSubscription("getGameLogResponse", messages),
            gameLogUpdate: async (message: GameLogMessage): Promise<void> => this.sendSubscription("gameLogUpdate", message),
        };

        this.connectionReceiver = {
            connectionSuccess: async (): Promise<void> => this.sendSubscription("connectionSuccess"),
            connectionFailed: async (reason: string): Promise<void> => this.sendSubscription("connectionFailed", reason),
            joinGameResponse: async (accepted: boolean): Promise<void> => this.sendSubscription("joinGameResponse", accepted),
            playerJoined: async (player: Player): Promise<void> => this.sendSubscription("playerJoined", player),
            playerLeft: async (username: string): Promise<void> => this.sendSubscription("playerLeft", username),
            hostChanged: async (previous: string, current: string, reason: string): Promise<void> => this.sendSubscription("hostChanged", previous, current, reason),
            playerKicked: async (username: string): Promise<void> => this.sendSubscription("playerKicked", username)
        };

        this.baseGameReceiver = {
            gameStarted: async (): Promise<void> => { },
            newRoundStarted: async (blankRoundCount: number, liveRoundCount: number): Promise<void> => this.sendSubscription("newRoundStarted", blankRoundCount, liveRoundCount),
            turnStarted: async (username: string): Promise<void> => this.sendSubscription("turnStarted", username),
            turnEnded: async (username: string): Promise<void> => this.sendSubscription("turnEnded", username),
            gameDataResponse: async (gameData: GameData): Promise<void> => this.sendSubscription("gameDataResponse", gameData),
            playerShotAt: async (target: string, bulletType: BulletType, damage: number): Promise<void> => this.sendSubscription("playerShotAt", target, bulletType, damage)
        };

        this.genericReceiver = {
            showAlert: async (message: string): Promise<void> => this.sendSubscription("showAlert", message),
            achievementUnlocked: async (username: string, achievement: string): Promise<void> => { this.sendSubscription("achievementUnlocked", username, achievement) },
            actionFailed: async (reason: string): Promise<void> => this.sendSubscription("actionFailed", reason)
        };

        this.itemReceiver = {
            reverseTurnOrderItemUsed: async (): Promise<void> => this.sendSubscription("reverseTurnOrderItemUsed"),
            rackChamberItemUsed: async (): Promise<void> => this.sendSubscription("rackChamberItemUsed"),
            extraLifeItemUsed: async (target: string): Promise<void> => this.sendSubscription("extraLifeItemUsed", target),
            pickpocketItemUsed: async (target: string, item: Item): Promise<void> => this.sendSubscription("pickpocketItemUsed", target, item),
            adrenalineItemUsed: async (lifeChange: number): Promise<void> => this.sendSubscription("adrenalineItemUsed", lifeChange),
            invertItemUsed: async (): Promise<void> => this.sendSubscription("invertItemUsed"),
            chamberCheckItemUsed: async (bulletType: BulletType): Promise<void> => this.sendSubscription("chamberCheckItemUsed", bulletType),
            doubleDamageItemUsed: async (): Promise<void> => this.sendSubscription("doubleDamageItemUsed"),
            skipItemUsed: async (target: string): Promise<void> => this.sendSubscription("skipItemUsed", target)
        };

        // Set up the receivers for subscriptions
        getReceiverRegister("IChatResponse").register(this.connection, this.chatReceiver);
        getReceiverRegister("IGameLogResponse").register(this.connection, this.gameLogReceiver);
        getReceiverRegister("IConnectionResponse").register(this.connection, this.connectionReceiver);
        getReceiverRegister("IBaseGameResponse").register(this.connection, this.baseGameReceiver);
        getReceiverRegister("IGenericResponse").register(this.connection, this.genericReceiver);
        getReceiverRegister("IItemResponse").register(this.connection, this.itemReceiver);

        // Pre-populate the subscriptions dictionary with empty sets
        const keys = [
            ...Object.keys(this.chatReceiver),
            ...Object.keys(this.gameLogReceiver),
            ...Object.keys(this.connectionReceiver),
            ...Object.keys(this.baseGameReceiver),
            ...Object.keys(this.genericReceiver),
            ...Object.keys(this.itemReceiver)
        ] as (keyof IHubServerResponse)[];
        this.subscriptions = Object.fromEntries(keys.map(key => [key, new Set<ResponseCallback>()])) as Subscriptions;
    }

    async start() {
        await this.connection.start();
        this.waitFor("connectionSuccess", async () => {
            this.open = true;
        });
    }

    async stop() {
        await this.connection.stop();
        this.open = false;
    }

    sendChatMessage(content: string): Promise<void> {
        return this.chatHubProxy.sendChatMessage(content);
    }
    getChatMessagesRequest(): Promise<void> {
        return this.chatHubProxy.getChatMessagesRequest();
    }
    deleteChatMessage(messageId: string): Promise<void> {
        return this.chatHubProxy.deleteChatMessage(messageId);
    }
    editChatMessage(messageId: string, content: string): Promise<void> {
        return this.chatHubProxy.editChatMessage(messageId, content);
    }
    getGameLogRequest(): Promise<void> {
        return this.gameLogHubProxy.getGameLogRequest();
    }
    joinGameRequest(username: string): Promise<void> {
        return this.connectionHubProxy.joinGameRequest(username);
    }
    setHost(username: string): Promise<void> {
        return this.connectionHubProxy.setHost(username);
    }
    kickPlayer(username: string): Promise<void> {
        return this.connectionHubProxy.kickPlayer(username);
    }
    gameDataRequest(): Promise<void> {
        return this.baseGameHubProxy.gameDataRequest();
    }
    shootPlayer(target: string): Promise<void> {
        return this.baseGameHubProxy.shootPlayer(target);
    }
    useReverseTurnOrderItem(): Promise<void> {
        return this.itemHubProxy.useReverseTurnOrderItem();
    }
    useRackChamberItem(): Promise<void> {
        return this.itemHubProxy.useRackChamberItem();
    }
    useExtraLifeItem(target: string): Promise<void> {
        return this.itemHubProxy.useExtraLifeItem(target);
    }
    usePickpocketItem(target: string, item: Item, itemTarget: string): Promise<void> {
        return this.itemHubProxy.usePickpocketItem(target, item, itemTarget);
    }
    useAdrenalineItem(): Promise<void> {
        return this.itemHubProxy.useAdrenalineItem();
    }
    useInvertItem(): Promise<void> {
        return this.itemHubProxy.useInvertItem();
    }
    useChamberCheckItem(): Promise<void> {
        return this.itemHubProxy.useChamberCheckItem();
    }
    useDoubleDamageItem(): Promise<void> {
        return this.itemHubProxy.useDoubleDamageItem();
    }
    useSkipItem(target: string): Promise<void> {
        return this.itemHubProxy.useSkipItem(target);
    }

    subscribe<K extends keyof IHubServerResponse>(type: K, callback: IHubServerResponse[K]): IHubServerResponse[K] {
        this.subscriptions[type].add(callback);
        return callback;
    }

    unsubscribe<K extends keyof IHubServerResponse>(type: K, callback: IHubServerResponse[K]): IHubServerResponse[K] {
        this.subscriptions[type].delete(callback);
        return callback;
    }

    waitFor<K extends keyof IHubServerResponse>(type: K, callback: IHubServerResponse[K]): void{
        const callbackWrapper = ((...args: Parameters<IHubServerResponse[K]>) => {
            this.unsubscribe(type, callbackWrapper);
            callFunction(callback, ...args);
        }) as IHubServerResponse[K];

        this.subscribe(type, callback);
    }

    waitForAny(types: Partial<IHubServerResponse>): void {
        const callbacks = new Map<keyof IHubServerResponse, ResponseCallback>();
        for (const [type, callback] of Object.entries(types) as [keyof IHubServerResponse, ResponseCallback][]) {
            const callbackWrapper = (...args: Parameters<ResponseCallback>) => {
                for (const stored of callbacks) {
                    this.unsubscribe(...stored);
                }
                return callFunction(callback, ...args);
            }
            callbacks.set(type, callbackWrapper);
            this.subscribe(type, callbackWrapper);
        }
    }

    private sendSubscription<K extends keyof IHubServerResponse>(type: K, ...args: Parameters<IHubServerResponse[K]>): void {
        for (const subscription of this.subscriptions[type]) {
            const typedSubscription = subscription as (...args: Parameters<ResponseCallback<K>>) => ReturnType<ResponseCallback<K>>;
            typedSubscription(...args);
        }
    }
}
