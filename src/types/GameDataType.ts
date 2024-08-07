import { GameLogMessageType } from "~/types/GameLogMessageType";
import { PlayerType } from "~/types/PlayerType";


export type GameDataType = {
    players: PlayerType[];
    clientUsername: string; 
    currentHost: string;
    gameStarted: boolean;
    currentTurn: string;
    gameID: string;
    gameLog: GameLogMessageType[];
};