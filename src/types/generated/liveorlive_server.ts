/* THIS (.ts) FILE IS GENERATED BY Tapper */
/* eslint-disable */
/* tslint:disable */
import type { Item } from './liveorlive_server.Enums';

/** Transpiled from liveorlive_server.Chat */
export type Chat = {
    /** Transpiled from System.Collections.Generic.List<liveorlive_server.ChatMessage> */
    messages: ChatMessage[];
}

/** Transpiled from liveorlive_server.ChatMessage */
export type ChatMessage = {
    /** Transpiled from System.Guid */
    id: string;
    /** Transpiled from string */
    author: string;
    /** Transpiled from string */
    content: string;
    /** Transpiled from long */
    timestamp: number;
}

/** Transpiled from liveorlive_server.Config */
export type Config = {
    /** Transpiled from bool */
    private: boolean;
    /** Transpiled from int */
    maxPlayers: number;
    /** Transpiled from int */
    defaultLives: number;
    /** Transpiled from int */
    maxLives: number;
    /** Transpiled from bool */
    randomItemsPerRound: boolean;
    /** Transpiled from int */
    minItemsPerRound: number;
    /** Transpiled from int */
    maxItemsPerRound: number;
    /** Transpiled from int */
    maxItems: number;
    /** Transpiled from int */
    minBlankRounds: number;
    /** Transpiled from int */
    minLiveRounds: number;
    /** Transpiled from int */
    maxBlankRounds: number;
    /** Transpiled from int */
    maxLiveRounds: number;
    /** Transpiled from bool */
    allowLifeDonation: boolean;
    /** Transpiled from bool */
    allowPlayerRevival: boolean;
    /** Transpiled from bool */
    allowDoubleDamageStacking: boolean;
    /** Transpiled from bool */
    allowDoubleSkips: boolean;
    /** Transpiled from bool */
    allowExtraLifeWhenFull: boolean;
    /** Transpiled from bool */
    allowSelfSkip: boolean;
    /** Transpiled from bool */
    loseSkipAfterRound: boolean;
    /** Transpiled from bool */
    lootItemsOnKill: boolean;
    /** Transpiled from bool */
    copySkipOnKill: boolean;
}

/** Transpiled from liveorlive_server.GameData */
export type GameData = {
    /** Transpiled from System.Collections.Generic.List<liveorlive_server.Player> */
    players: Player[];
    /** Transpiled from string? */
    host?: string;
    /** Transpiled from bool */
    gameStarted: boolean;
    /** Transpiled from string */
    gameID: string;
    /** Transpiled from string */
    currentTurn: string;
    /** Transpiled from int */
    damageForShot: number;
    /** Transpiled from bool */
    quickshotEnabled: boolean;
}

/** Transpiled from liveorlive_server.GameLogMessage */
export type GameLogMessage = {
    /** Transpiled from string */
    message: string;
    /** Transpiled from long */
    timestamp: number;
}

/** Transpiled from liveorlive_server.Lobby */
export type Lobby = {
    /** Transpiled from string */
    id: string;
    /** Transpiled from string */
    name: string;
    /** Transpiled from bool */
    hidden: boolean;
    /** Transpiled from long */
    creationTime: number;
    /** Transpiled from liveorlive_server.Config */
    config: Config;
    /** Transpiled from System.Collections.Generic.List<liveorlive_server.Player> */
    players: Player[];
    /** Transpiled from string? */
    host?: string;
    /** Transpiled from bool */
    gameStarted: boolean;
}

/** Transpiled from liveorlive_server.Player */
export type Player = {
    /** Transpiled from string */
    username: string;
    /** Transpiled from bool */
    inGame: boolean;
    /** Transpiled from bool */
    isSpectator: boolean;
    /** Transpiled from int */
    lives: number;
    /** Transpiled from System.Collections.Generic.List<liveorlive_server.Enums.Item> */
    items: Item[];
    /** Transpiled from bool */
    isSkipped: boolean;
    /** Transpiled from long */
    joinTime: number;
}

