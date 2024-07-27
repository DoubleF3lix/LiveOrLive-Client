import { PlayerType } from "./PlayerType";


export type GameDataType = {
    players: PlayerType[];
    clientUsername: string; 
    currentHost: string;
    turnCount: number;
    gameID: string;
};