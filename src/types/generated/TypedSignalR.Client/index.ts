/* THIS (.ts) FILE IS GENERATED BY TypedSignalR.Client.TypeScript */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import type { HubConnection, IStreamResult, Subject } from '@microsoft/signalr';
import type { IChatRequest, IGameLogRequest, IConnectionRequest, IBaseGameRequest, IGenericRequest, IItemRequest, IHubServerResponse, IChatResponse, IGameLogResponse, IConnectionResponse, IBaseGameResponse, IGenericResponse, IItemResponse } from './liveorlive_server.HubPartials';
import type { Item, BulletType } from '../liveorlive_server.Enums';
import type { ChatMessage, GameLogMessage, Player, GameData } from '../liveorlive_server';


// components

export type Disposable = {
    dispose(): void;
}

export type HubProxyFactory<T> = {
    createHubProxy(connection: HubConnection): T;
}

export type ReceiverRegister<T> = {
    register(connection: HubConnection, receiver: T): Disposable;
}

type ReceiverMethod = {
    methodName: string,
    method: (...args: any[]) => void
}

class ReceiverMethodSubscription implements Disposable {

    public constructor(
        private connection: HubConnection,
        private receiverMethod: ReceiverMethod[]) {
    }

    public readonly dispose = () => {
        for (const it of this.receiverMethod) {
            this.connection.off(it.methodName, it.method);
        }
    }
}

// API

export type HubProxyFactoryProvider = {
    (hubType: "IChatRequest"): HubProxyFactory<IChatRequest>;
    (hubType: "IGameLogRequest"): HubProxyFactory<IGameLogRequest>;
    (hubType: "IConnectionRequest"): HubProxyFactory<IConnectionRequest>;
    (hubType: "IBaseGameRequest"): HubProxyFactory<IBaseGameRequest>;
    (hubType: "IGenericRequest"): HubProxyFactory<IGenericRequest>;
    (hubType: "IItemRequest"): HubProxyFactory<IItemRequest>;
}

export const getHubProxyFactory = ((hubType: string) => {
    if(hubType === "IChatRequest") {
        return IChatRequest_HubProxyFactory.Instance;
    }
    if(hubType === "IGameLogRequest") {
        return IGameLogRequest_HubProxyFactory.Instance;
    }
    if(hubType === "IConnectionRequest") {
        return IConnectionRequest_HubProxyFactory.Instance;
    }
    if(hubType === "IBaseGameRequest") {
        return IBaseGameRequest_HubProxyFactory.Instance;
    }
    if(hubType === "IGenericRequest") {
        return IGenericRequest_HubProxyFactory.Instance;
    }
    if(hubType === "IItemRequest") {
        return IItemRequest_HubProxyFactory.Instance;
    }
}) as HubProxyFactoryProvider;

export type ReceiverRegisterProvider = {
    (receiverType: "IHubServerResponse"): ReceiverRegister<IHubServerResponse>;
    (receiverType: "IChatResponse"): ReceiverRegister<IChatResponse>;
    (receiverType: "IGameLogResponse"): ReceiverRegister<IGameLogResponse>;
    (receiverType: "IConnectionResponse"): ReceiverRegister<IConnectionResponse>;
    (receiverType: "IBaseGameResponse"): ReceiverRegister<IBaseGameResponse>;
    (receiverType: "IGenericResponse"): ReceiverRegister<IGenericResponse>;
    (receiverType: "IItemResponse"): ReceiverRegister<IItemResponse>;
}

export const getReceiverRegister = ((receiverType: string) => {
    if(receiverType === "IHubServerResponse") {
        return IHubServerResponse_Binder.Instance;
    }
    if(receiverType === "IChatResponse") {
        return IChatResponse_Binder.Instance;
    }
    if(receiverType === "IGameLogResponse") {
        return IGameLogResponse_Binder.Instance;
    }
    if(receiverType === "IConnectionResponse") {
        return IConnectionResponse_Binder.Instance;
    }
    if(receiverType === "IBaseGameResponse") {
        return IBaseGameResponse_Binder.Instance;
    }
    if(receiverType === "IGenericResponse") {
        return IGenericResponse_Binder.Instance;
    }
    if(receiverType === "IItemResponse") {
        return IItemResponse_Binder.Instance;
    }
}) as ReceiverRegisterProvider;

// HubProxy

class IChatRequest_HubProxyFactory implements HubProxyFactory<IChatRequest> {
    public static Instance = new IChatRequest_HubProxyFactory();

    private constructor() {
    }

    public readonly createHubProxy = (connection: HubConnection): IChatRequest => {
        return new IChatRequest_HubProxy(connection);
    }
}

class IChatRequest_HubProxy implements IChatRequest {

    public constructor(private connection: HubConnection) {
    }

    public readonly getChatMessagesRequest = async (): Promise<void> => {
        return await this.connection.invoke("GetChatMessagesRequest");
    }

    public readonly sendChatMessage = async (content: string): Promise<void> => {
        return await this.connection.invoke("SendChatMessage", content);
    }

    public readonly deleteChatMessage = async (messageId: string): Promise<void> => {
        return await this.connection.invoke("DeleteChatMessage", messageId);
    }

    public readonly editChatMessage = async (messageId: string, content: string): Promise<void> => {
        return await this.connection.invoke("EditChatMessage", messageId, content);
    }
}

class IGameLogRequest_HubProxyFactory implements HubProxyFactory<IGameLogRequest> {
    public static Instance = new IGameLogRequest_HubProxyFactory();

    private constructor() {
    }

    public readonly createHubProxy = (connection: HubConnection): IGameLogRequest => {
        return new IGameLogRequest_HubProxy(connection);
    }
}

class IGameLogRequest_HubProxy implements IGameLogRequest {

    public constructor(private connection: HubConnection) {
    }

    public readonly getGameLogRequest = async (): Promise<void> => {
        return await this.connection.invoke("GetGameLogRequest");
    }
}

class IConnectionRequest_HubProxyFactory implements HubProxyFactory<IConnectionRequest> {
    public static Instance = new IConnectionRequest_HubProxyFactory();

    private constructor() {
    }

    public readonly createHubProxy = (connection: HubConnection): IConnectionRequest => {
        return new IConnectionRequest_HubProxy(connection);
    }
}

class IConnectionRequest_HubProxy implements IConnectionRequest {

    public constructor(private connection: HubConnection) {
    }

    public readonly setHost = async (username: string): Promise<void> => {
        return await this.connection.invoke("SetHost", username);
    }

    public readonly kickPlayer = async (username: string): Promise<void> => {
        return await this.connection.invoke("KickPlayer", username);
    }
}

class IBaseGameRequest_HubProxyFactory implements HubProxyFactory<IBaseGameRequest> {
    public static Instance = new IBaseGameRequest_HubProxyFactory();

    private constructor() {
    }

    public readonly createHubProxy = (connection: HubConnection): IBaseGameRequest => {
        return new IBaseGameRequest_HubProxy(connection);
    }
}

class IBaseGameRequest_HubProxy implements IBaseGameRequest {

    public constructor(private connection: HubConnection) {
    }

    public readonly gameDataRequest = async (): Promise<void> => {
        return await this.connection.invoke("GameDataRequest");
    }

    public readonly shootPlayer = async (target: string): Promise<void> => {
        return await this.connection.invoke("ShootPlayer", target);
    }
}

class IGenericRequest_HubProxyFactory implements HubProxyFactory<IGenericRequest> {
    public static Instance = new IGenericRequest_HubProxyFactory();

    private constructor() {
    }

    public readonly createHubProxy = (connection: HubConnection): IGenericRequest => {
        return new IGenericRequest_HubProxy(connection);
    }
}

class IGenericRequest_HubProxy implements IGenericRequest {

    public constructor(private connection: HubConnection) {
    }
}

class IItemRequest_HubProxyFactory implements HubProxyFactory<IItemRequest> {
    public static Instance = new IItemRequest_HubProxyFactory();

    private constructor() {
    }

    public readonly createHubProxy = (connection: HubConnection): IItemRequest => {
        return new IItemRequest_HubProxy(connection);
    }
}

class IItemRequest_HubProxy implements IItemRequest {

    public constructor(private connection: HubConnection) {
    }

    public readonly useReverseTurnOrderItem = async (): Promise<void> => {
        return await this.connection.invoke("UseReverseTurnOrderItem");
    }

    public readonly useRackChamberItem = async (): Promise<void> => {
        return await this.connection.invoke("UseRackChamberItem");
    }

    public readonly useExtraLifeItem = async (target: string): Promise<void> => {
        return await this.connection.invoke("UseExtraLifeItem", target);
    }

    public readonly usePickpocketItem = async (target: string, item: Item, itemTarget: string): Promise<void> => {
        return await this.connection.invoke("UsePickpocketItem", target, item, itemTarget);
    }

    public readonly useAdrenalineItem = async (): Promise<void> => {
        return await this.connection.invoke("UseAdrenalineItem");
    }

    public readonly useInvertItem = async (): Promise<void> => {
        return await this.connection.invoke("UseInvertItem");
    }

    public readonly useChamberCheckItem = async (): Promise<void> => {
        return await this.connection.invoke("UseChamberCheckItem");
    }

    public readonly useDoubleDamageItem = async (): Promise<void> => {
        return await this.connection.invoke("UseDoubleDamageItem");
    }

    public readonly useSkipItem = async (target: string): Promise<void> => {
        return await this.connection.invoke("UseSkipItem", target);
    }
}


// Receiver

class IHubServerResponse_Binder implements ReceiverRegister<IHubServerResponse> {

    public static Instance = new IHubServerResponse_Binder();

    private constructor() {
    }

    public readonly register = (connection: HubConnection, receiver: IHubServerResponse): Disposable => {

        const __getChatMessagesResponse = (...args: [ChatMessage[]]) => receiver.getChatMessagesResponse(...args);
        const __chatMessageSent = (...args: [ChatMessage]) => receiver.chatMessageSent(...args);
        const __chatMessageDeleted = (...args: [string]) => receiver.chatMessageDeleted(...args);
        const __chatMessageEdited = (...args: [string, string]) => receiver.chatMessageEdited(...args);
        const __getGameLogResponse = (...args: [GameLogMessage[]]) => receiver.getGameLogResponse(...args);
        const __gameLogUpdate = (...args: [GameLogMessage]) => receiver.gameLogUpdate(...args);
        const __connectionSuccess = () => receiver.connectionSuccess();
        const __connectionFailed = (...args: [string]) => receiver.connectionFailed(...args);
        const __playerJoined = (...args: [Player]) => receiver.playerJoined(...args);
        const __playerLeft = (...args: [string]) => receiver.playerLeft(...args);
        const __hostChanged = (...args: [string, string, string]) => receiver.hostChanged(...args);
        const __playerKicked = (...args: [string]) => receiver.playerKicked(...args);
        const __gameStarted = () => receiver.gameStarted();
        const __newRoundStarted = (...args: [number, number]) => receiver.newRoundStarted(...args);
        const __turnStarted = (...args: [string]) => receiver.turnStarted(...args);
        const __turnEnded = (...args: [string]) => receiver.turnEnded(...args);
        const __gameDataResponse = (...args: [GameData]) => receiver.gameDataResponse(...args);
        const __playerShotAt = (...args: [string, BulletType, number]) => receiver.playerShotAt(...args);
        const __showAlert = (...args: [string]) => receiver.showAlert(...args);
        const __achievementUnlocked = (...args: [string, string]) => receiver.achievementUnlocked(...args);
        const __actionFailed = (...args: [string]) => receiver.actionFailed(...args);
        const __reverseTurnOrderItemUsed = () => receiver.reverseTurnOrderItemUsed();
        const __rackChamberItemUsed = () => receiver.rackChamberItemUsed();
        const __extraLifeItemUsed = (...args: [string]) => receiver.extraLifeItemUsed(...args);
        const __pickpocketItemUsed = (...args: [string, Item]) => receiver.pickpocketItemUsed(...args);
        const __adrenalineItemUsed = (...args: [number]) => receiver.adrenalineItemUsed(...args);
        const __invertItemUsed = () => receiver.invertItemUsed();
        const __chamberCheckItemUsed = (...args: [BulletType]) => receiver.chamberCheckItemUsed(...args);
        const __doubleDamageItemUsed = () => receiver.doubleDamageItemUsed();
        const __skipItemUsed = (...args: [string]) => receiver.skipItemUsed(...args);

        connection.on("GetChatMessagesResponse", __getChatMessagesResponse);
        connection.on("ChatMessageSent", __chatMessageSent);
        connection.on("ChatMessageDeleted", __chatMessageDeleted);
        connection.on("ChatMessageEdited", __chatMessageEdited);
        connection.on("GetGameLogResponse", __getGameLogResponse);
        connection.on("GameLogUpdate", __gameLogUpdate);
        connection.on("ConnectionSuccess", __connectionSuccess);
        connection.on("ConnectionFailed", __connectionFailed);
        connection.on("PlayerJoined", __playerJoined);
        connection.on("PlayerLeft", __playerLeft);
        connection.on("HostChanged", __hostChanged);
        connection.on("PlayerKicked", __playerKicked);
        connection.on("GameStarted", __gameStarted);
        connection.on("NewRoundStarted", __newRoundStarted);
        connection.on("TurnStarted", __turnStarted);
        connection.on("TurnEnded", __turnEnded);
        connection.on("GameDataResponse", __gameDataResponse);
        connection.on("PlayerShotAt", __playerShotAt);
        connection.on("ShowAlert", __showAlert);
        connection.on("AchievementUnlocked", __achievementUnlocked);
        connection.on("ActionFailed", __actionFailed);
        connection.on("ReverseTurnOrderItemUsed", __reverseTurnOrderItemUsed);
        connection.on("RackChamberItemUsed", __rackChamberItemUsed);
        connection.on("ExtraLifeItemUsed", __extraLifeItemUsed);
        connection.on("PickpocketItemUsed", __pickpocketItemUsed);
        connection.on("AdrenalineItemUsed", __adrenalineItemUsed);
        connection.on("InvertItemUsed", __invertItemUsed);
        connection.on("ChamberCheckItemUsed", __chamberCheckItemUsed);
        connection.on("DoubleDamageItemUsed", __doubleDamageItemUsed);
        connection.on("SkipItemUsed", __skipItemUsed);

        const methodList: ReceiverMethod[] = [
            { methodName: "GetChatMessagesResponse", method: __getChatMessagesResponse },
            { methodName: "ChatMessageSent", method: __chatMessageSent },
            { methodName: "ChatMessageDeleted", method: __chatMessageDeleted },
            { methodName: "ChatMessageEdited", method: __chatMessageEdited },
            { methodName: "GetGameLogResponse", method: __getGameLogResponse },
            { methodName: "GameLogUpdate", method: __gameLogUpdate },
            { methodName: "ConnectionSuccess", method: __connectionSuccess },
            { methodName: "ConnectionFailed", method: __connectionFailed },
            { methodName: "PlayerJoined", method: __playerJoined },
            { methodName: "PlayerLeft", method: __playerLeft },
            { methodName: "HostChanged", method: __hostChanged },
            { methodName: "PlayerKicked", method: __playerKicked },
            { methodName: "GameStarted", method: __gameStarted },
            { methodName: "NewRoundStarted", method: __newRoundStarted },
            { methodName: "TurnStarted", method: __turnStarted },
            { methodName: "TurnEnded", method: __turnEnded },
            { methodName: "GameDataResponse", method: __gameDataResponse },
            { methodName: "PlayerShotAt", method: __playerShotAt },
            { methodName: "ShowAlert", method: __showAlert },
            { methodName: "AchievementUnlocked", method: __achievementUnlocked },
            { methodName: "ActionFailed", method: __actionFailed },
            { methodName: "ReverseTurnOrderItemUsed", method: __reverseTurnOrderItemUsed },
            { methodName: "RackChamberItemUsed", method: __rackChamberItemUsed },
            { methodName: "ExtraLifeItemUsed", method: __extraLifeItemUsed },
            { methodName: "PickpocketItemUsed", method: __pickpocketItemUsed },
            { methodName: "AdrenalineItemUsed", method: __adrenalineItemUsed },
            { methodName: "InvertItemUsed", method: __invertItemUsed },
            { methodName: "ChamberCheckItemUsed", method: __chamberCheckItemUsed },
            { methodName: "DoubleDamageItemUsed", method: __doubleDamageItemUsed },
            { methodName: "SkipItemUsed", method: __skipItemUsed }
        ]

        return new ReceiverMethodSubscription(connection, methodList);
    }
}

class IChatResponse_Binder implements ReceiverRegister<IChatResponse> {

    public static Instance = new IChatResponse_Binder();

    private constructor() {
    }

    public readonly register = (connection: HubConnection, receiver: IChatResponse): Disposable => {

        const __getChatMessagesResponse = (...args: [ChatMessage[]]) => receiver.getChatMessagesResponse(...args);
        const __chatMessageSent = (...args: [ChatMessage]) => receiver.chatMessageSent(...args);
        const __chatMessageDeleted = (...args: [string]) => receiver.chatMessageDeleted(...args);
        const __chatMessageEdited = (...args: [string, string]) => receiver.chatMessageEdited(...args);

        connection.on("GetChatMessagesResponse", __getChatMessagesResponse);
        connection.on("ChatMessageSent", __chatMessageSent);
        connection.on("ChatMessageDeleted", __chatMessageDeleted);
        connection.on("ChatMessageEdited", __chatMessageEdited);

        const methodList: ReceiverMethod[] = [
            { methodName: "GetChatMessagesResponse", method: __getChatMessagesResponse },
            { methodName: "ChatMessageSent", method: __chatMessageSent },
            { methodName: "ChatMessageDeleted", method: __chatMessageDeleted },
            { methodName: "ChatMessageEdited", method: __chatMessageEdited }
        ]

        return new ReceiverMethodSubscription(connection, methodList);
    }
}

class IGameLogResponse_Binder implements ReceiverRegister<IGameLogResponse> {

    public static Instance = new IGameLogResponse_Binder();

    private constructor() {
    }

    public readonly register = (connection: HubConnection, receiver: IGameLogResponse): Disposable => {

        const __getGameLogResponse = (...args: [GameLogMessage[]]) => receiver.getGameLogResponse(...args);
        const __gameLogUpdate = (...args: [GameLogMessage]) => receiver.gameLogUpdate(...args);

        connection.on("GetGameLogResponse", __getGameLogResponse);
        connection.on("GameLogUpdate", __gameLogUpdate);

        const methodList: ReceiverMethod[] = [
            { methodName: "GetGameLogResponse", method: __getGameLogResponse },
            { methodName: "GameLogUpdate", method: __gameLogUpdate }
        ]

        return new ReceiverMethodSubscription(connection, methodList);
    }
}

class IConnectionResponse_Binder implements ReceiverRegister<IConnectionResponse> {

    public static Instance = new IConnectionResponse_Binder();

    private constructor() {
    }

    public readonly register = (connection: HubConnection, receiver: IConnectionResponse): Disposable => {

        const __connectionSuccess = () => receiver.connectionSuccess();
        const __connectionFailed = (...args: [string]) => receiver.connectionFailed(...args);
        const __playerJoined = (...args: [Player]) => receiver.playerJoined(...args);
        const __playerLeft = (...args: [string]) => receiver.playerLeft(...args);
        const __hostChanged = (...args: [string, string, string]) => receiver.hostChanged(...args);
        const __playerKicked = (...args: [string]) => receiver.playerKicked(...args);

        connection.on("ConnectionSuccess", __connectionSuccess);
        connection.on("ConnectionFailed", __connectionFailed);
        connection.on("PlayerJoined", __playerJoined);
        connection.on("PlayerLeft", __playerLeft);
        connection.on("HostChanged", __hostChanged);
        connection.on("PlayerKicked", __playerKicked);

        const methodList: ReceiverMethod[] = [
            { methodName: "ConnectionSuccess", method: __connectionSuccess },
            { methodName: "ConnectionFailed", method: __connectionFailed },
            { methodName: "PlayerJoined", method: __playerJoined },
            { methodName: "PlayerLeft", method: __playerLeft },
            { methodName: "HostChanged", method: __hostChanged },
            { methodName: "PlayerKicked", method: __playerKicked }
        ]

        return new ReceiverMethodSubscription(connection, methodList);
    }
}

class IBaseGameResponse_Binder implements ReceiverRegister<IBaseGameResponse> {

    public static Instance = new IBaseGameResponse_Binder();

    private constructor() {
    }

    public readonly register = (connection: HubConnection, receiver: IBaseGameResponse): Disposable => {

        const __gameStarted = () => receiver.gameStarted();
        const __newRoundStarted = (...args: [number, number]) => receiver.newRoundStarted(...args);
        const __turnStarted = (...args: [string]) => receiver.turnStarted(...args);
        const __turnEnded = (...args: [string]) => receiver.turnEnded(...args);
        const __gameDataResponse = (...args: [GameData]) => receiver.gameDataResponse(...args);
        const __playerShotAt = (...args: [string, BulletType, number]) => receiver.playerShotAt(...args);

        connection.on("GameStarted", __gameStarted);
        connection.on("NewRoundStarted", __newRoundStarted);
        connection.on("TurnStarted", __turnStarted);
        connection.on("TurnEnded", __turnEnded);
        connection.on("GameDataResponse", __gameDataResponse);
        connection.on("PlayerShotAt", __playerShotAt);

        const methodList: ReceiverMethod[] = [
            { methodName: "GameStarted", method: __gameStarted },
            { methodName: "NewRoundStarted", method: __newRoundStarted },
            { methodName: "TurnStarted", method: __turnStarted },
            { methodName: "TurnEnded", method: __turnEnded },
            { methodName: "GameDataResponse", method: __gameDataResponse },
            { methodName: "PlayerShotAt", method: __playerShotAt }
        ]

        return new ReceiverMethodSubscription(connection, methodList);
    }
}

class IGenericResponse_Binder implements ReceiverRegister<IGenericResponse> {

    public static Instance = new IGenericResponse_Binder();

    private constructor() {
    }

    public readonly register = (connection: HubConnection, receiver: IGenericResponse): Disposable => {

        const __showAlert = (...args: [string]) => receiver.showAlert(...args);
        const __achievementUnlocked = (...args: [string, string]) => receiver.achievementUnlocked(...args);
        const __actionFailed = (...args: [string]) => receiver.actionFailed(...args);

        connection.on("ShowAlert", __showAlert);
        connection.on("AchievementUnlocked", __achievementUnlocked);
        connection.on("ActionFailed", __actionFailed);

        const methodList: ReceiverMethod[] = [
            { methodName: "ShowAlert", method: __showAlert },
            { methodName: "AchievementUnlocked", method: __achievementUnlocked },
            { methodName: "ActionFailed", method: __actionFailed }
        ]

        return new ReceiverMethodSubscription(connection, methodList);
    }
}

class IItemResponse_Binder implements ReceiverRegister<IItemResponse> {

    public static Instance = new IItemResponse_Binder();

    private constructor() {
    }

    public readonly register = (connection: HubConnection, receiver: IItemResponse): Disposable => {

        const __reverseTurnOrderItemUsed = () => receiver.reverseTurnOrderItemUsed();
        const __rackChamberItemUsed = () => receiver.rackChamberItemUsed();
        const __extraLifeItemUsed = (...args: [string]) => receiver.extraLifeItemUsed(...args);
        const __pickpocketItemUsed = (...args: [string, Item]) => receiver.pickpocketItemUsed(...args);
        const __adrenalineItemUsed = (...args: [number]) => receiver.adrenalineItemUsed(...args);
        const __invertItemUsed = () => receiver.invertItemUsed();
        const __chamberCheckItemUsed = (...args: [BulletType]) => receiver.chamberCheckItemUsed(...args);
        const __doubleDamageItemUsed = () => receiver.doubleDamageItemUsed();
        const __skipItemUsed = (...args: [string]) => receiver.skipItemUsed(...args);

        connection.on("ReverseTurnOrderItemUsed", __reverseTurnOrderItemUsed);
        connection.on("RackChamberItemUsed", __rackChamberItemUsed);
        connection.on("ExtraLifeItemUsed", __extraLifeItemUsed);
        connection.on("PickpocketItemUsed", __pickpocketItemUsed);
        connection.on("AdrenalineItemUsed", __adrenalineItemUsed);
        connection.on("InvertItemUsed", __invertItemUsed);
        connection.on("ChamberCheckItemUsed", __chamberCheckItemUsed);
        connection.on("DoubleDamageItemUsed", __doubleDamageItemUsed);
        connection.on("SkipItemUsed", __skipItemUsed);

        const methodList: ReceiverMethod[] = [
            { methodName: "ReverseTurnOrderItemUsed", method: __reverseTurnOrderItemUsed },
            { methodName: "RackChamberItemUsed", method: __rackChamberItemUsed },
            { methodName: "ExtraLifeItemUsed", method: __extraLifeItemUsed },
            { methodName: "PickpocketItemUsed", method: __pickpocketItemUsed },
            { methodName: "AdrenalineItemUsed", method: __adrenalineItemUsed },
            { methodName: "InvertItemUsed", method: __invertItemUsed },
            { methodName: "ChamberCheckItemUsed", method: __chamberCheckItemUsed },
            { methodName: "DoubleDamageItemUsed", method: __doubleDamageItemUsed },
            { methodName: "SkipItemUsed", method: __skipItemUsed }
        ]

        return new ReceiverMethodSubscription(connection, methodList);
    }
}

