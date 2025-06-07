import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux'

import alertDialogQueueReducer from "~/store/AlertDialogQueueSlice";
import chatReducer from "~/store/ChatSlice";
import gameLogReducer from "~/store/GameLogSlice";
import lobbyDataReducer from "~/store/LobbyDataSlice";
import selfDataReducer from "~/store/SelfDataSlice";


const store = configureStore({
    reducer: {
        alertDialogQueueReducer,
        chatReducer,
        gameLogReducer,
        lobbyDataReducer,
        selfDataReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export type IRootState = ReturnType<typeof store.getState>;
export default store;