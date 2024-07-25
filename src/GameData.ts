import { createSlice } from "@reduxjs/toolkit";
import Item from "./Item";
import { GameDataSyncPacket } from "./Packet";

// Only represents players who are in the game, and only used for UI purposes
export type Player = {
    username: string, 
    lives: number, 
    items: Item[]
};

export type ChatMessage = {
    author: Player,
    message: string,
    timestamp: number
};

// Setup for Redux store
type GameDataType = {
    players: Player[];
    clientUsername: string; 
    currentHost: string;
    turnCount: number;
    gameID: string;
};

const initialGameData: GameDataType = {
    players: [],
    clientUsername: "",
    currentHost: "",
    turnCount: -1,
    gameID: ""
};

export const gameDataSlice = createSlice({
    name: "gameData",
    initialState: initialGameData,
    reducers: {
        addPlayer: (state, action: {payload: Player}) => {
            // Check for duplicates, and don't add if they're already in there (just as a failsafe)
            if (!state.players.some(player => player.username === action.payload.username)) {
                state.players.push(action.payload);
            }
        },
        setClientUsername: (state, action: {payload: string}) => {
            state.clientUsername = action.payload;
        },
        setCurrentHost: (state, action: {payload: string}) => {
            state.currentHost = action.payload;
        },
        // incrementTurnCount: (state) => {
        //     state.turnCount++;
        // },
        populateGameDataFromPacket: (state, action: {payload: GameDataSyncPacket}) => {
            state.players = action.payload.gameData.players;
            state.currentHost = action.payload.gameData.host;
            state.turnCount = action.payload.gameData.turnCount;
            state.gameID = action.payload.gameData.gameID;
        }
    }
});

export const {addPlayer, setClientUsername, setCurrentHost, populateGameDataFromPacket} = gameDataSlice.actions;
export default gameDataSlice.reducer;
