import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameLogMessage } from "~/types/generated/liveorlive_server";


type GameLogSliceType = {
    gameLogMessages: GameLogMessage[];
};

const initialGameLogSliceState: GameLogSliceType = {
    gameLogMessages: []
};

export const gameLogSlice = createSlice({
    name: "gameLog",
    initialState: initialGameLogSliceState,
    reducers: {
        setGameLogMessages: (state, action: PayloadAction<GameLogMessage[]>) => {
            state.gameLogMessages = action.payload;
        },
        addGameLogMessage: (state, action: PayloadAction<GameLogMessage>) => {
            state.gameLogMessages.push(action.payload);
        }
    }
});

export const { setGameLogMessages, addGameLogMessage } = gameLogSlice.actions;
export default gameLogSlice.reducer;