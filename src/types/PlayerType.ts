import ItemType from "./ItemType";


export type PlayerType = {
    username: string,
    inGame: boolean,
    isSpectator: boolean,

    lives: number, 
    items: ItemType[]
    isSkipped: boolean,

    joinTime: number
};