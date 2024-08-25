import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux'

import gameDataReducer from "~/store/GameDataSlice";
import chatReducer from "~/store/ChatSlice";
import popupReducer from "~/store/PopupSlice";


const store = configureStore({
    reducer: {
        gameDataReducer,
        chatReducer,
        popupReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export type IRootState = ReturnType<typeof store.getState>;
export default store;