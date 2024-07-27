import { PlayerType } from "./PlayerType";


export type ChatMessageType = {
    author: PlayerType,
    message: string,
    timestamp: number
};