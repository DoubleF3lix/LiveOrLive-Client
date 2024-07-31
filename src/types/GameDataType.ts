import { PlayerType } from "./PlayerType";


export type GameDataType = {
    players: PlayerType[];
    clientUsername: string; 
    currentHost: string;
    gameStarted: boolean;
    currentTurn: string;
    gameID: string;
};