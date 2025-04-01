import { PayloadAction, createSlice } from "@reduxjs/toolkit";


// Stores information about the user (as in the one playing the game in this browser instance)
type SelfDataSliceType = {
    username: string;
};

const initialSelfDataSliceState: SelfDataSliceType = {
    username: ""
};

export const selfDataSlice = createSlice({
    name: "selfData",
    initialState: initialSelfDataSliceState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        }
    }
});

export const { setUsername } = selfDataSlice.actions;
export default selfDataSlice.reducer;