import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type RoundDataSliceType = {
    liveRounds: number;
    blankRounds: number;
    roundsFired: number;
};

const initialLobbyDataSliceState: RoundDataSliceType = {
    liveRounds: 0,
    blankRounds: 0,
    roundsFired: 0
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
        }
    }
});

export const { setLiveRoundsCount, setBlankRoundsCount } = lobbyDataSlice.actions;
export default lobbyDataSlice.reducer;