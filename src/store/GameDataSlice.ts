import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { GameDataType } from "~/types/GameDataType";
import { GameDataSyncPacket, GameLogMessagesSyncPacket, NewGameLogMessageSentPacket, NewRoundStartedPacket, PlayerShotAtPacket, TurnStartedPacket } from "~/types/PacketType";
import { PlayerType } from "~/types/PlayerType";


const initialGameData: GameDataType = {
    players: [],
    clientUsername: "",
    currentHost: "",
    gameStarted: false,
    currentTurn: "",
    gameID: "",
    gameLog: []
};

export const gameDataSlice = createSlice({
    name: "gameData",
    initialState: initialGameData,
    reducers: {
        addPlayer: (state, action: PayloadAction<PlayerType>) => {
            // Check for duplicates, and don't add if they're already in there (just as a failsafe)
            if (!state.players.some(player => player.username === action.payload.username)) {
                state.players.push(action.payload);
            }
        },
        setClientUsername: (state, action: PayloadAction<string>) => {
            state.clientUsername = action.payload;
        },
        setCurrentHost: (state, action: PayloadAction<string>) => {
            state.currentHost = action.payload;
        },
        onGameStarted: (state) => {
            state.gameStarted = true;
        },
        setCurrentTurn: (state, action: PayloadAction<TurnStartedPacket>) => {
            state.currentTurn = action.payload.username;
        },
        populateGameLogFromPacket: (state, action: PayloadAction<GameLogMessagesSyncPacket>) => {
            state.gameLog = action.payload.messages;
        },
        addGameLogMessage: (state, action: PayloadAction<NewGameLogMessageSentPacket>) => {
            state.gameLog.push(action.payload.message);
        },
        newRoundStarted: (state, action: PayloadAction<NewRoundStartedPacket>) => {
            state.players = action.payload.players;
        },
        playerShotAt: (state, action: PayloadAction<PlayerShotAtPacket>) => {
            if (action.payload.ammoType === "Live") {
                const targetIndex = state.players.findIndex(player => player.username === action.payload.target);
                state.players[targetIndex].lives -= action.payload.damage;
                if (state.players[targetIndex].lives == 0) {
                    state.players[targetIndex].isSpectator = true;
                }
            }
        },
        populateGameDataFromPacket: (state, action: PayloadAction<GameDataSyncPacket>) => {
            state.players = action.payload.gameData.players;
            state.currentHost = action.payload.gameData.host;
            state.gameStarted = action.payload.gameData.gameStarted;
            state.currentTurn = action.payload.gameData.currentTurn;
            state.gameID = action.payload.gameData.gameID;
        }
    }
});

export const {addPlayer, setClientUsername, setCurrentHost, onGameStarted, setCurrentTurn, populateGameLogFromPacket, addGameLogMessage, newRoundStarted, playerShotAt, populateGameDataFromPacket} = gameDataSlice.actions;
export default gameDataSlice.reducer;
