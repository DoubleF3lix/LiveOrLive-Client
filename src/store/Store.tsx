import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux'

import selfDataReducer from "~/store/SelfDataSlice";
import chatReducer from "~/store/ChatSlice";


const store = configureStore({
    reducer: {
        selfDataReducer,
        chatReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export type IRootState = ReturnType<typeof store.getState>;
export default store;