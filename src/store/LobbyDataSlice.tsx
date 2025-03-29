import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Lobby } from "~/types/generated/liveorlive_server";


const initialSelfDataSliceState: Lobby = {
    id: "",
    name: "",
    hidden: false,
    creationTime: 0,
    config: {
        private: false,
        maxPlayers: 0,
        defaultLives: 0,
        maxLives: 0,
        randomItemsPerRound: false,
        minItemsPerRound: 0,
        maxItemsPerRound: 0,
        maxItems: 0,
        minBlankRounds: 0,
        minLiveRounds: 0,
        maxBlankRounds: 0,
        maxLiveRounds: 0,
        allowLifeDonation: false,
        allowPlayerRevival: false,
        allowDoubleDamageStacking: false,
        allowDoubleSkips: false,
        allowExtraLifeWhenFull: false,
        allowSelfSkip: false,
        loseSkipAfterRound: false,
        lootItemsOnKill: false,
        copySkipOnKill: false
    },
    players: [],
    host: undefined,
    gameStarted: false
};

export const lobbyDataSlice = createSlice({
    name: "lobbyData",
    initialState: initialSelfDataSliceState,
    reducers: {
        setHost: (state, action: PayloadAction<string | undefined>) => {
            state.host = action.payload;
        }
    }
});

export const { setHost } = lobbyDataSlice.actions;
export default lobbyDataSlice.reducer;