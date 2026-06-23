import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type RoundDataSliceType = {
    liveRounds: number;
    blankRounds: number;
    roundsFired: number;
    turnOrderReversed: boolean;
};

// Represents data that the server doesn't track of, but that we do
const initialRoundDataSliceState: RoundDataSliceType = {
    liveRounds: 0,
    blankRounds: 0,
    roundsFired: 0,
    turnOrderReversed: false
}

export const roundDataSlice = createSlice({
    name: "lobbyData",
    initialState: initialRoundDataSliceState,
    reducers: {
        setLiveRoundsCount: (state, action: PayloadAction<number>) => {
            state.liveRounds = action.payload;
        },
        setBlankRoundsCount: (state, action: PayloadAction<number>) => {
            state.blankRounds = action.payload;
        },
        reverseTurnOrder: (state) => {
            state.turnOrderReversed = !state.turnOrderReversed;
        },
        resetRoundDataState: () => initialRoundDataSliceState
    }
});

export const { setLiveRoundsCount, setBlankRoundsCount, reverseTurnOrder, resetRoundDataState } = roundDataSlice.actions;
export default roundDataSlice.reducer;