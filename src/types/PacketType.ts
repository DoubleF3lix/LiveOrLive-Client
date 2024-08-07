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
}

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
    ammoType: AmmoType
}

export type SkipItemUsedPacket = {
    packetType: "skipItemUsed",
    target: string
}

export type DoubleDamageItemUsedPacket = {
    packetType: "doubleDamageItemUsed"
}

export type ChamberCheckItemUsedPacket = {
    packetType: "chamberCheckItemUsed",
    result: AmmoType
}

export type RebalancerItemUsedPacket = {
    packetType: "rebalancerItemUsed",
    ammoType: AmmoType,
    count: number
}

export type AdrenalineItemUsedPacket = {
    packetType: "adrenalineItemUsed",
    result: number
}

export type QuickshotItemUsedPacket = {
    packetType: "quickshotItemUsed",
}

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

export type ShowAlertPacket = {
    packetType: "showAlert",
    content: string
};

export type NewGameLogMessageSentPacket = {
    packetType: "newGameLogMessageSent",
    message: GameLogMessageType
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

export type UseAdrenalineItemPacket = {
    packetType: "useAdrenalineItem"
}

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
    | NewRoundStartedPacket
    | TurnStartedPacket
    | TurnEndedPacket
    | ActionFailedPacket
    | PlayerShotAtPacket
    | SkipItemUsedPacket
    | DoubleDamageItemUsedPacket
    | ChamberCheckItemUsedPacket
    | RebalancerItemUsedPacket
    | AdrenalineItemUsedPacket
    | QuickshotItemUsedPacket
    | StealItemUsedPacket
    | NewChatMessageSentPacket
    | ChatMessagesSyncPacket
    | ShowAlertPacket
    | NewGameLogMessageSentPacket
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
    | UseAdrenalineItemPacket
    | UseQuickshotItemPacket
    | UseStealItemPacket
    | SendNewChatMessagePacket
    | ChatMessagesRequest
);

export type Packet = ServerPacket | ClientPacket;
