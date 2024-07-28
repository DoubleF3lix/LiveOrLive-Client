import { createSlice } from "@reduxjs/toolkit";

import { GameDataType } from "~/types/GameDataType";
import { GameDataSyncPacket, NewRoundStartedPacket } from "~/types/PacketType";
import { PlayerType } from "~/types/PlayerType";


const initialGameData: GameDataType = {
    players: [],
    clientUsername: "",
    currentHost: "",
    gameStarted: false,
    gameID: ""
};

export const gameDataSlice = createSlice({
    name: "gameData",
    initialState: initialGameData,
    reducers: {
        addPlayer: (state, action: {payload: PlayerType}) => {
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
        gameStarted: (state) => {
            state.gameStarted = true;
        },
        newRoundStarted: (state, action: {payload: NewRoundStartedPacket}) => {
            state.players = action.payload.players;
        },
        populateGameDataFromPacket: (state, action: {payload: GameDataSyncPacket}) => {
            state.players = action.payload.gameData.players;
            state.currentHost = action.payload.gameData.host;
            state.gameStarted = action.payload.gameData.gameStarted;
            state.gameID = action.payload.gameData.gameID;
        }
    }
});

export const {addPlayer, setClientUsername, setCurrentHost, gameStarted, newRoundStarted, populateGameDataFromPacket} = gameDataSlice.actions;
export default gameDataSlice.reducer;
