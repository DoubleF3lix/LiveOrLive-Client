import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import PopupType from "~/types/PopupType";


type PopupSliceType = {
    popupQueue: PopupType[];
};


const initialPopupSliceState: PopupSliceType = {
    popupQueue: [],
};

export const popupSlice = createSlice({
    name: "popup",
    initialState: initialPopupSliceState,
    reducers: {
        queuePopup(state, action: PayloadAction<PopupType>) {
            state.popupQueue.push(action.payload);
        },
        closePopup(state) {
            state.popupQueue.shift();
        }
    }
});

export const { queuePopup, closePopup } = popupSlice.actions;
export default popupSlice.reducer;
