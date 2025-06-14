import { PayloadAction, createSlice } from "@reduxjs/toolkit";


type AlertDialogQueueItem = {
    title: string;
    description: string;
    onClick?: "reloadWindow" | "reloadWindowKicked" | "transferHost" | "kickPlayer" | "gameEnded";
    skippable?: boolean;
    arg?: string;
};

type AlertDialogQueueSliceType = {
    queue: AlertDialogQueueItem[];
};

const alertDialogQueueSliceState: AlertDialogQueueSliceType = {
    queue: []
};

export const alertDialogQueueSlice = createSlice({
    name: "alertDialogQueueData",
    initialState: alertDialogQueueSliceState,
    reducers: {
        showAlertDialog: (state, action: PayloadAction<AlertDialogQueueItem>) => {
            state.queue.push(action.payload);
        },
        dequeueAlertDialog: (state) => {
            state.queue.shift();
        },
        emptyAlertDialogQueue: (state) => {
            state.queue = [];
        }
    }
});

export const { showAlertDialog, dequeueAlertDialog, emptyAlertDialogQueue } = alertDialogQueueSlice.actions;
export default alertDialogQueueSlice.reducer;