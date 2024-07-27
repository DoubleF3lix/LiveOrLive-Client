import { ChatMessageType } from "./ChatMessageType";
import { PlayerType } from "~/types/PlayerType"
import ItemType from "~/types/ItemType"
import AmmoType from "~/types/AmmoType"


// Server packets
export type GameDataSyncPacket = {
    packetType: "gameDataSync",
    gameData: {
        players: PlayerType[],
        host: string,
        turnCount: number,
        gameID: string
    }
};

export type PlayerJoinedPacket = {
    packetType: "playerJoined",
    player: PlayerType
};

export type PlayerJoinRejectedPacket = {
    packetType: "playerJoinRejected",
    reason: string
};

export type HostSetPacket = {
    packetType: "hostSet",
    username: string
};

export type GameStartedPacket = {
    packetType: "gameStarted",
};

export type TurnStartedPacket = {
    packetType: "turnStarted",
    username: string
};

export type TurnEndedPacket = {
    packetType: "turnEnded",
    username: string
};

export type ActionFailedPacket = {
    packetType: "actionFailed",
    reason: string
};

export type UseChamberCheckItemResultPacket = {
    packetType: "useChamberCheckItemResult",
    ammoType: AmmoType
};

export type NewChatMessageSentPacket = {
    packetType: "newChatMessageSent",
    message: ChatMessageType
};

export type ChatMessagesSyncPacket = {
    packetType: "chatMessagesSync",
    messages: ChatMessageType[]
};

export type ShowAlertPacket = {
    packetType: "showAlert",
    content: string
};

// Client packets
export type JoinGamePacket = {
    packetType: "joinGame",
    username: string
};

export type SetHostPacket = {
    packetType: "setHost",
    username: string
};

export type GameDataRequestPacket = {
    packetType: "gameDataRequest",
};

export type StartGamePacket = {
    packetType: "startGame",
};

export type ShootPlayerPacket = {
    packetType: "shootPlayer",
    target: string
};

export type UseSkipItemPacket = {
    packetType: "useSkipItem",
    target: string
};

export type UseDoubleDamageItemPacket = {
    packetType: "useDoubleDamageItem",
};

export type UseChamberCheckItemPacket = {
    packetType: "useChamberCheckItem",
};

export type UseRebalancerItemPacket = {
    packetType: "useRebalancerItem",
    ammoType: AmmoType
};

export type UseQuickshotItemPacket = {
    packetType: "useQuickshotItem",
};

export type UseStealItemPacket = {
    packetType: "useStealItem",
    target: string
    item: ItemType
};

export type SendNewChatMessagePacket = {
    packetType: "sendNewChatMessage",
    content: string
};

export type ChatMessagesRequest = {
    packetType: "chatMessagesRequest"
};

export type ServerPacket = (
    | GameDataSyncPacket
    | PlayerJoinedPacket
    | PlayerJoinRejectedPacket
    | HostSetPacket
    | GameStartedPacket
    | TurnStartedPacket
    | TurnEndedPacket
    | ActionFailedPacket
    | UseChamberCheckItemResultPacket
    | NewChatMessageSentPacket
    | ChatMessagesSyncPacket
    | ShowAlertPacket
);

export type ClientPacket = (
    | JoinGamePacket
    | SetHostPacket
    | GameDataRequestPacket
    | StartGamePacket
    | ShootPlayerPacket
    | UseSkipItemPacket
    | UseDoubleDamageItemPacket
    | UseChamberCheckItemPacket
    | UseRebalancerItemPacket
    | UseQuickshotItemPacket
    | UseStealItemPacket
    | SendNewChatMessagePacket
    | ChatMessagesRequest
);

export type Packet = ServerPacket | ClientPacket;
