import { configureStore } from "@reduxjs/toolkit";
import gameDataReducer from "~/store/GameData";
import chatReducer from "~/store/ChatSlice";


const store = configureStore({
    reducer: {
        gameDataReducer,
        chatReducer
    }
});

export type IRootState = ReturnType<typeof store.getState>;
export default store;