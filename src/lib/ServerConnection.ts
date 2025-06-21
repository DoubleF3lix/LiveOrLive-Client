import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getHubProxyFactory, getReceiverRegister } from "~/types/generated/TypedSignalR.Client";
import { IBaseGameRequest, IBaseGameResponse, IChatRequest, IChatResponse, IConnectionRequest, IConnectionResponse, IGameLogRequest, IGameLogResponse, IGenericRequest, IGenericResponse, IHubServerResponse, IItemRequest, IItemResponse } from "~/types/generated/TypedSignalR.Client/liveorlive_server.HubPartials";
import { Player, Lobby } from "~/types/generated/liveorlive_server";
import { ChatMessage, GameLogMessage } from "~/types/generated/liveorlive_server.Models";
import { BulletType, Item } from "~/types/generated/liveorlive_server.Enums";
import { BASE_URL, SERVER_TIMEOUT } from "~/lib/const";
import { NewRoundResult } from "~/types/generated/liveorlive_server.Models.Results";


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

    private subscriptions: Subscriptions;

    open: boolean = false;

    constructor(lobbyId: string, username: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}?lobbyId=${lobbyId}&username=${username}`)
            .configureLogging(LogLevel.Warning)
            .build();

        this.connection.serverTimeoutInMilliseconds = SERVER_TIMEOUT;

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
            playerJoined: async (player: Player): Promise<void> => this.sendSubscription("playerJoined", player),
            playerLeft: async (username: string): Promise<void> => this.sendSubscription("playerLeft", username),
            hostChanged: async (previous: string, current: string, reason: string): Promise<void> => this.sendSubscription("hostChanged", previous, current, reason),
            playerKicked: async (username: string): Promise<void> => this.sendSubscription("playerKicked", username)
        };

        this.baseGameReceiver = {
            gameStarted: async (turnOrder: string[]): Promise<void> => this.sendSubscription("gameStarted", turnOrder),
            gameEnded: async (winner: string): Promise<void> => this.sendSubscription("gameEnded", winner),
            newRoundStarted: async (result: NewRoundResult): Promise<void> => this.sendSubscription("newRoundStarted", result),
            turnStarted: async (username: string): Promise<void> => this.sendSubscription("turnStarted", username),
            turnEnded: async (username: string): Promise<void> => this.sendSubscription("turnEnded", username),
            getLobbyDataResponse: async (lobbyData: Lobby): Promise<void> => this.sendSubscription("getLobbyDataResponse", lobbyData),
            playerShotAt: async (target: string, bulletType: BulletType, damage: number): Promise<void> => this.sendSubscription("playerShotAt", target, bulletType, damage)
        };

        this.genericReceiver = {
            showAlert: async (message: string): Promise<void> => this.sendSubscription("showAlert", message),
            achievementUnlocked: async (username: string, achievement: string): Promise<void> => { this.sendSubscription("achievementUnlocked", username, achievement) },
            actionFailed: async (reason: string): Promise<void> => this.sendSubscription("actionFailed", reason)
        };

        this.itemReceiver = {
            reverseTurnOrderItemUsed: async (itemSourceUsername: string): Promise<void> => this.sendSubscription("reverseTurnOrderItemUsed", itemSourceUsername),
            rackChamberItemUsed: async (bulletType: BulletType, itemSourceUsername: string): Promise<void> => this.sendSubscription("rackChamberItemUsed", bulletType, itemSourceUsername),
            extraLifeItemUsed: async (target: string, itemSourceUsername: string): Promise<void> => this.sendSubscription("extraLifeItemUsed", target, itemSourceUsername),
            pickpocketItemUsed: async (target: string, item: Item, itemTarget: string, itemSourceUsername: string): Promise<void> => this.sendSubscription("pickpocketItemUsed", target, item, itemTarget, itemSourceUsername),
            lifeGambleItemUsed: async (lifeChange: number, itemSourceUsername: string): Promise<void> => this.sendSubscription("lifeGambleItemUsed", lifeChange, itemSourceUsername),
            invertItemUsed: async (itemSourceUsername: string): Promise<void> => this.sendSubscription("invertItemUsed", itemSourceUsername),
            chamberCheckItemUsed: async (bulletType: BulletType, itemSourceUsername: string): Promise<void> => this.sendSubscription("chamberCheckItemUsed", bulletType, itemSourceUsername),
            doubleDamageItemUsed: async (itemSourceUsername: string): Promise<void> => this.sendSubscription("doubleDamageItemUsed", itemSourceUsername),
            skipItemUsed: async (target: string, itemSourceUsername: string): Promise<void> => this.sendSubscription("skipItemUsed", target, itemSourceUsername),
            ricochetItemUsed: async (target: string, itemSourceUsername: string): Promise<void> => this.sendSubscription("ricochetItemUsed", target, itemSourceUsername)
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

        this.onDisconnect(this.stop);
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

    onDisconnect(callback: (error: Error | undefined) => void) { 
        this.connection.onclose(callback);
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
    setHost(username: string): Promise<void> {
        return this.connectionHubProxy.setHost(username);
    }
    kickPlayer(username: string): Promise<void> {
        return this.connectionHubProxy.kickPlayer(username);
    }
    startGame(): Promise<void> {
        return this.baseGameHubProxy.startGame();
    }
    getLobbyDataRequest(): Promise<void> {
        return this.baseGameHubProxy.getLobbyDataRequest();
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
    useLifeGambleItem(): Promise<void> {
        return this.itemHubProxy.useLifeGambleItem();
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
    useRicochetItem(target: string): Promise<void> {
        return this.itemHubProxy.useRicochetItem(target);
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
