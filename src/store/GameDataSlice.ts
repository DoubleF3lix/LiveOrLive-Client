import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { removeItemFromArray } from "~/lib/utils";

import { GameDataType } from "~/types/GameDataType";
import { AdrenalineItemUsedPacket, GameDataSyncPacket, GameLogMessagesSyncPacket, NewGameLogMessageSentPacket, NewRoundStartedPacket, PlayerKickedPacket, PlayerShotAtPacket, SkipItemUsedPacket, StealItemUsedPacket, TurnStartedPacket } from "~/types/PacketType";
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
            } else {
                const targetIndex = state.players.findIndex(player => player.username === action.payload.username);
                // If they're not dead, show they're back in the game
                if (state.players[targetIndex].isSpectator === false) {
                    state.players[targetIndex].inGame = true;
                }
            }
        },
        playerLeft: (state, action: PayloadAction<string>) => {
            if (!state.gameStarted) {
                state.players = state.players.filter(player => player.username !== action.payload);
            } else {
                const targetIndex = state.players.findIndex(player => player.username === action.payload);
                state.players[targetIndex].inGame = false;
            }
        },
        setClientUsername: (state, action: PayloadAction<string>) => {
            state.clientUsername = action.payload;
        },
        setCurrentHost: (state, action: PayloadAction<string>) => {
            state.currentHost = action.payload;
        },
        playerKicked: (state, action: PayloadAction<PlayerKickedPacket>) => {
            // Remove the player who got yeeted
            state.players = state.players.filter(player => player.username !== action.payload.username);
            state.currentTurn = action.payload.currentTurn;
        },
        onGameStarted: (state) => {
            state.gameStarted = true;
        },
        setCurrentTurn: (state, action: PayloadAction<TurnStartedPacket>) => {
            state.currentTurn = action.payload.username;

            // Always overwrite their skipped state when their turn comes up
            const playerForTurnIndex = state.players.findIndex(player => player.username === action.payload.username);
            state.players[playerForTurnIndex].isSkipped = false;
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
        populateGameDataFromPacket: (state, action: PayloadAction<GameDataSyncPacket>) => {
            state.players = action.payload.gameData.players;
            state.currentHost = action.payload.gameData.host;
            state.gameStarted = action.payload.gameData.gameStarted;
            state.currentTurn = action.payload.gameData.currentTurn;
            state.gameID = action.payload.gameData.gameID;
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
        skipItemUsed: (state, action: PayloadAction<SkipItemUsedPacket>) => {
            const senderIndex = state.players.findIndex(player => player.username === state.currentTurn);
            const targetIndex = state.players.findIndex(player => player.username === action.payload.target);

            state.players[senderIndex].items = removeItemFromArray(state.players[senderIndex].items, "SkipPlayerTurn");
            state.players[targetIndex].isSkipped = true;
        },
        doubleDamageItemUsed: (state) => {
            const senderIndex = state.players.findIndex(player => player.username === state.currentTurn);
            state.players[senderIndex].items = removeItemFromArray(state.players[senderIndex].items, "DoubleDamage");
        },
        checkBulletItemUsed: (state) => {
            const senderIndex = state.players.findIndex(player => player.username === state.currentTurn);
            state.players[senderIndex].items = removeItemFromArray(state.players[senderIndex].items, "CheckBullet");
        },
        rebalancerItemUsed: (state) => {
            const senderIndex = state.players.findIndex(player => player.username === state.currentTurn);
            state.players[senderIndex].items = removeItemFromArray(state.players[senderIndex].items, "Rebalancer");
        },
        adrenalineItemUsed: (state, action: PayloadAction<AdrenalineItemUsedPacket>) => {
            const senderIndex = state.players.findIndex(player => player.username === state.currentTurn);

            state.players[senderIndex].items = removeItemFromArray(state.players[senderIndex].items, "Adrenaline");
            state.players[senderIndex].lives += action.payload.result;
        },
        addLifeItemUsed: (state) => {
            const senderIndex = state.players.findIndex(player => player.username === state.currentTurn);

            state.players[senderIndex].items = removeItemFromArray(state.players[senderIndex].items, "AddLife");
            state.players[senderIndex].lives += 1;
        },
        quickshotItemUsed: (state) => {
            const senderIndex = state.players.findIndex(player => player.username === state.currentTurn);
            state.players[senderIndex].items = removeItemFromArray(state.players[senderIndex].items, "Quickshot");
        },
        stealItemUsed: (state, action: PayloadAction<StealItemUsedPacket>) => {
            const senderIndex = state.players.findIndex(player => player.username === state.currentTurn);
            const targetIndex = state.players.findIndex(player => player.username === action.payload.target);

            state.players[senderIndex].items = removeItemFromArray(state.players[senderIndex].items, "StealItem");
            state.players[targetIndex].items = removeItemFromArray(state.players[targetIndex].items, action.payload.item);
        }
    }
});

export const { addPlayer, playerLeft, setClientUsername, setCurrentHost, playerKicked, onGameStarted, setCurrentTurn,
    populateGameLogFromPacket, addGameLogMessage, newRoundStarted, populateGameDataFromPacket, playerShotAt, 
    skipItemUsed, doubleDamageItemUsed, checkBulletItemUsed, rebalancerItemUsed, adrenalineItemUsed, addLifeItemUsed, quickshotItemUsed, stealItemUsed
} = gameDataSlice.actions;
export default gameDataSlice.reducer;
