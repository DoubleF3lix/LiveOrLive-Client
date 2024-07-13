import Item from "./Item";
import { Player, ChatMessage } from "./GameData";


// Server packets
export type ClientReconnectAttemptResponsePacket = {
    packetType: "clientReconnectAttemptResponse";
    validReconnect: boolean;
}

export type UpdatePlayerDataPacket = {
	packetType: "updatePlayerData", 
    player: Player, 
    items: Item[], 
    lives: number
};

export type ShowAlertPacket = {
	packetType: "showAlert", 
    content: string
};

export type NewChatMessageSentPacket = {
	packetType: "newChatMessageSent", 
    message: ChatMessage
};

export type PlayerJoinRejectedPacket = {
    packetType: "playerJoinRejected",
    reason: string
}

export type PlayerJoinedPacket = {
	packetType: "playerJoined", 
    player: Player
};

export type SetHostPacket = {
    packetType: "setHost",
    host: Player
};

export type GetGameInfoResponsePacket = {
	packetType: "getGameInfoResponse", 
    currentHost: Player, 
    players: Player[], 
    chatMessages: ChatMessage[],
    turnCount: number
};

export type GunFiredPacket = {
	packetType: "gunFired", 
    target: Player
};

export type ItemUsedPacket = {
	packetType: "itemUsed", 
    itemID: Item, 
    target?: Player
};

export type GameStartedPacket = {
    packetType: "gameStarted"
};


// Client packets
export type ClientReconnectAttemptPacket = {
    packetType: "clientReconnectAttempt";
    username: string;
    gameID: string;
}

export type SendNewChatMessagePacket = {
	packetType: "sendNewChatMessage", 
    content: string
};

export type JoinGamePacket = {
    packetType: "joinGame", 
    username: string
};

export type GetGameInfoPacket = {
    packetType: "getGameInfo"
};

export type FireGunPacket = {
    packetType: "fireGun", 
    target: Player 
};

export type UseItemPacket = {
    packetType: "useItem", 
    item: Item, 
    target?: Player
};

export type StartGamePacket = {
    packetType: "startGame"
};

export type ServerPacket = (
    | ClientReconnectAttemptResponsePacket
    | UpdatePlayerDataPacket 
    | ShowAlertPacket 
    | NewChatMessageSentPacket 
    | PlayerJoinRejectedPacket
    | PlayerJoinedPacket 
    | SetHostPacket 
    | GetGameInfoResponsePacket
    | GunFiredPacket
    | ItemUsedPacket
    | GameStartedPacket
);

export type ClientPacket = (
    | ClientReconnectAttemptPacket
    | SendNewChatMessagePacket
    | JoinGamePacket
    | GetGameInfoPacket
    | FireGunPacket
    | UseItemPacket
    | StartGamePacket
);

export type Packet = ServerPacket | ClientPacket;
