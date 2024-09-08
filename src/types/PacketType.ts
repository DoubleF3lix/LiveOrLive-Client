import { ChatMessageType } from "~/types/ChatMessageType";
import { PlayerType } from "~/types/PlayerType"
import ItemType from "~/types/ItemType"
import AmmoType from "~/types/AmmoType"
import { GameLogMessageType } from "~/types/GameLogMessageType";


// Server packets
export type GameDataSyncPacket = {
    packetType: "gameDataSync",
    // Doesn't use GameDataType because that has clientUsername
    gameData: {
        players: PlayerType[],
        host: string,
        gameStarted: boolean,
        currentTurn: string,
        gameID: string,
        gameLog: GameLogMessageType[]
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

export type PlayerLeftPacket = {
    packetType: "playerLeft",
    username: string
};

export type HostSetPacket = {
    packetType: "hostSet",
    username: string
};

export type GameStartedPacket = {
    packetType: "gameStarted"
};

export type NewRoundStartedPacket = {
    packetType: "newRoundStarted",
    players: PlayerType[],
    liveCount: number,
    blankCount: number
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

export type PlayerShotAtPacket = {
    packetType: "playerShotAt",
    target: string,
    ammoType: AmmoType,
    damage: number
};

export type SkipItemUsedPacket = {
    packetType: "skipItemUsed",
    target: string
};

export type DoubleDamageItemUsedPacket = {
    packetType: "doubleDamageItemUsed"
};

export type CheckBulletItemUsedPacket = {
    packetType: "checkBulletItemUsed"
};

export type CheckBulletItemResultPacket = {
    packetType: "checkBulletItemResult",
    result: AmmoType
};

export type RebalancerItemUsedPacket = {
    packetType: "rebalancerItemUsed",
    ammoType: AmmoType,
    count: number
};

export type AdrenalineItemUsedPacket = {
    packetType: "adrenalineItemUsed",
    result: number
};

export type AddLifeItemUsedPacket = {
    packetType: "addLifeItemUsed"
};

export type QuickshotItemUsedPacket = {
    packetType: "quickshotItemUsed",
};

export type StealItemUsedPacket = {
    packetType: "stealItemUsed",
    target: string,
    item: ItemType
}
export type NewChatMessageSentPacket = {
    packetType: "newChatMessageSent",
    message: ChatMessageType
};

export type ChatMessagesSyncPacket = {
    packetType: "chatMessagesSync",
    messages: ChatMessageType[]
};

export type GameLogMessagesSyncPacket = {
    packetType: "gameLogMessagesSync",
    messages: GameLogMessageType[]
};

export type ShowAlertPacket = {
    packetType: "showAlert",
    content: string
};

export type NewGameLogMessageSentPacket = {
    packetType: "newGameLogMessageSent",
    message: GameLogMessageType
};

export type PlayerKickedPacket = {
    packetType: "playerKicked",
    username: string,
    currentTurn: string
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
    packetType: "startGame"
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
    packetType: "useDoubleDamageItem"
};

export type UseCheckBulletItemPacket = {
    packetType: "useCheckBulletItem"
};

export type UseRebalancerItemPacket = {
    packetType: "useRebalancerItem",
    ammoType: AmmoType
};

export type UseAdrenalineItemPacket = {
    packetType: "useAdrenalineItem"
};

export type UseAddLifeItemPacket = {
    packetType: "useAddLifeItem"
};

export type UseQuickshotItemPacket = {
    packetType: "useQuickshotItem"
};

export type UseStealItemPacket = {
    packetType: "useStealItem",
    target: string
    item: ItemType,
    ammoType: AmmoType | null,
    skipTarget: string | null
};

export type SendNewChatMessagePacket = {
    packetType: "sendNewChatMessage",
    content: string
};

export type ChatMessagesRequestPacket = {
    packetType: "chatMessagesRequest"
};

export type GameLogMessagesRequestPacket = {
    packetType: "gameLogMessagesRequest"
};

export type KickPlayerPacket = {
    packetType: "kickPlayer",
    username: string
};


export type ServerPacket = (
    | GameDataSyncPacket
    | PlayerJoinedPacket
    | PlayerJoinRejectedPacket
    | PlayerLeftPacket
    | HostSetPacket
    | GameStartedPacket
    | NewRoundStartedPacket
    | TurnStartedPacket
    | TurnEndedPacket
    | ActionFailedPacket
    | PlayerShotAtPacket
    | SkipItemUsedPacket
    | DoubleDamageItemUsedPacket
    | CheckBulletItemUsedPacket
    | CheckBulletItemResultPacket
    | RebalancerItemUsedPacket
    | AdrenalineItemUsedPacket
    | AddLifeItemUsedPacket
    | QuickshotItemUsedPacket
    | StealItemUsedPacket
    | NewChatMessageSentPacket
    | ChatMessagesSyncPacket
    | GameLogMessagesSyncPacket
    | ShowAlertPacket
    | NewGameLogMessageSentPacket
    | PlayerKickedPacket
);

export type ClientPacket = (
    | JoinGamePacket
    | SetHostPacket
    | GameDataRequestPacket
    | StartGamePacket
    | ShootPlayerPacket
    | UseSkipItemPacket
    | UseDoubleDamageItemPacket
    | UseCheckBulletItemPacket
    | UseRebalancerItemPacket
    | UseAdrenalineItemPacket
    | UseAddLifeItemPacket
    | UseQuickshotItemPacket
    | UseStealItemPacket
    | SendNewChatMessagePacket
    | ChatMessagesRequestPacket
    | GameLogMessagesRequestPacket
    | KickPlayerPacket
);

export type Packet = ServerPacket | ClientPacket;
