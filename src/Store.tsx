import { configureStore } from "@reduxjs/toolkit";
import gameDataReducer from "./GameData";

const store = configureStore({
    reducer: {
        gameDataReducer,
    }
});

export type IRootState = ReturnType<typeof store.getState>;
export default store;