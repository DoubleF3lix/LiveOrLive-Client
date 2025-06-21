import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type RoundDataSliceType = {
    liveRounds: number;
    blankRounds: number;
    roundsFired: number;
    turnOrderReversed: boolean;
};

const initialLobbyDataSliceState: RoundDataSliceType = {
    liveRounds: 0,
    blankRounds: 0,
    roundsFired: 0,
    turnOrderReversed: false
}

export const lobbyDataSlice = createSlice({
    name: "lobbyData",
    initialState: initialLobbyDataSliceState,
    reducers: {
        setLiveRoundsCount: (state, action: PayloadAction<number>) => {
            state.liveRounds = action.payload;
        },
        setBlankRoundsCount: (state, action: PayloadAction<number>) => {
            state.blankRounds = action.payload;
        },
        reverseTurnOrder: (state) => {
            state.turnOrderReversed = !state.turnOrderReversed;
        }
    }
});

export const { setLiveRoundsCount, setBlankRoundsCount, reverseTurnOrder } = lobbyDataSlice.actions;
export default lobbyDataSlice.reducer;