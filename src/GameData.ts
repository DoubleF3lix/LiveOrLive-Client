import { createSlice } from "@reduxjs/toolkit";
import Item from "./Item";
import { GetGameInfoResponsePacket } from "./Packet";

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
    chatMessages: ChatMessage[];
    turnCount: number;
}

const initialGameData: GameDataType = {
    players: [],
    clientUsername: "",
    currentHost: "",
    chatMessages: [{author: {username: "", items: [], lives: 0}, message: "", timestamp: 0}],
    turnCount: -1
}

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
        addChatMessage: (state, action: {payload: ChatMessage}) => {
            state.chatMessages.push(action.payload);
        },
        incrementTurnCount: (state) => {
            state.turnCount++;
        },
        populateFromPacket: (state, action: {payload: GetGameInfoResponsePacket}) => {
            state.players = action.payload.players;
            state.currentHost = action.payload.currentHost?.username;
            state.chatMessages = action.payload.chatMessages;
            state.turnCount = action.payload.turnCount;
        }
    }
});

export const {addPlayer, setClientUsername, setCurrentHost, addChatMessage, incrementTurnCount, populateFromPacket} = gameDataSlice.actions;
export default gameDataSlice.reducer;
