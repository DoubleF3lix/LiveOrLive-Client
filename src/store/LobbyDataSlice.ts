import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { removeItemFromArray } from "~/lib/utils";
import { Lobby, Player } from "~/types/generated/liveorlive_server";


const initialLobbyDataSliceState: Lobby = {
    id: "",
    name: "",
    hidden: false,
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
        allowLootItemsExceedMax: false
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
        addPlayer: (state, action: PayloadAction<Player>) => {
            state.players.push(action.payload);
        },
        removePlayer: (state, action: PayloadAction<string>) => {
            const playerToRemove = state.players.find(player => player.username === action.payload);
            if (playerToRemove) {
                state.players = removeItemFromArray(state.players, playerToRemove);
            }
        },
        setHost: (state, action: PayloadAction<string | undefined>) => {
            state.host = action.payload;
        }
    }
});

export const { loadFromPacket, addPlayer, removePlayer, setHost } = lobbyDataSlice.actions;
export default lobbyDataSlice.reducer;