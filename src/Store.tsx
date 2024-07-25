import { configureStore } from "@reduxjs/toolkit";
import gameDataReducer from "./GameData";
import chatReducer from "./ChatSlice";

const store = configureStore({
    reducer: {
        gameDataReducer,
        chatReducer
    }
});

export type IRootState = ReturnType<typeof store.getState>;
export default store;