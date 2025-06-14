import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { removeItemFromArray } from "~/lib/utils";
import { Lobby, Player } from "~/types/generated/liveorlive_server";


const initialLobbyDataSliceState: Lobby = {
    id: "",
    name: "",
    private: false,
    creationTime: 0,
    settings: {
        private: false,
        maxPlayers: 0,
        minBlankRounds: 0,
        minLiveRounds: 0,
        maxBlankRounds: 0,
        maxLiveRounds: 0,
        defaultLives: 0,
        maxLives: 0,
        randomItemsPerRound: false,
        minItemsPerRound: 0,
        maxItemsPerRound: 0,
        maxItems: 0,
        enableReverseTurnOrderItem: false,
        enableRackChamberItem: false,
        enableExtraLifeItem: false,
        enablePickpocketItem: false,
        enableLifeGambleItem: false,
        enableInvertItem: false,
        enableChamberCheckItem: false,
        enableDoubleDamageItem: false,
        enableSkipItem: false,
        enableRicochetItem: false,
        allowLifeDonation: false,
        allowPlayerRevival: false,
        allowDoubleDamageStacking: false,
        allowSequentialSkips: false,
        allowExtraLifeWhenFull: false,
        allowLifeGambleExceedMax: false,
        allowSelfSkip: false,
        ricochetIgnoreSkippedPlayers: false,
        loseSkipAfterRound: false,
        copySkipOnKill: false,
        lootItemsOnKill: false,
        maxLootItemsOnKill: 0,
        allowLootItemsExceedMax: false,
        showRicochets: false,
        showRicochetsCounter: false,
        disableDealReverseWhenTwoPlayers: false,
        suddenDeathActivationPoint: 0,
        secondWind: false,
        allowLootingDead: false,
        refreshDeadPlayerItems: false,
        clearDeadPlayerItemsAfterRound: false,
        lifeGambleWeights: {}
    },
    players: [],
    host: undefined,
    gameStarted: false,
    turnOrder: [],
    currentTurn: undefined
};

export const lobbyDataSlice = createSlice({
    name: "lobbyData",
    initialState: initialLobbyDataSliceState,
    reducers: {
        loadFromPacket: (_state, action: PayloadAction<Lobby>) => {
            return action.payload;
        },
        playerJoined: (state, action: PayloadAction<Player>) => {
            state.players.push(action.payload);
        },
        playerLeft: (state, action: PayloadAction<string>) => {
            const playerToRemove = state.players.find(player => player.username === action.payload);
            if (playerToRemove) {
                if (state.gameStarted) {
                    playerToRemove.inGame = false;
                } else {
                    state.players = removeItemFromArray(state.players, playerToRemove);
                }
            }
        },
        setHost: (state, action: PayloadAction<string | undefined>) => {
            state.host = action.payload;
        },
        gameStarted: (state) => {
            state.gameStarted = true;
        },
        gameEnded: (state) => {
            state.gameStarted = false;
        },
        turnStarted: (state, action: PayloadAction<string>) => {
            state.currentTurn = action.payload;
        },
        turnEnded: (state) => {
            state.currentTurn = undefined;
        },
        playerShotAt: (state, action: PayloadAction<{username: string, bulletType: number, damage: number}>) => {
            const targetIndex = state.players.findIndex(player => player.username === action.payload.username);
            if (targetIndex !== -1) {
                state.players[targetIndex].lives = Math.max(0, state.players[targetIndex].lives - action.payload.damage);
            }
        }
    }
});

export const { loadFromPacket, playerJoined, playerLeft, setHost, gameStarted, gameEnded, turnStarted, turnEnded, playerShotAt } = lobbyDataSlice.actions;
export default lobbyDataSlice.reducer;