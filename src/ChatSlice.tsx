import { createSlice } from "@reduxjs/toolkit";
import { ChatMessagesSyncPacket } from "./Packet";
import { ChatMessage } from "./GameData";

type ChatSliceType = {
    chatMessages: ChatMessage[];
};

const initialChatSliceeState: ChatSliceType = {
    chatMessages: [{author: {username: "", items: [], lives: 0}, message: "", timestamp: 0}]
};

export const chatSlice = createSlice({
    name: "gameData",
    initialState: initialChatSliceeState,
    reducers: {
        addChatMessage: (state, action: {payload: ChatMessage}) => {
            state.chatMessages.push(action.payload);
        },
        populateChatFromPacket: (state, action: {payload: ChatMessagesSyncPacket}) => {
            state.chatMessages = action.payload.messages;
        }
    }
});

export const {addChatMessage, populateChatFromPacket} = chatSlice.actions;
export default chatSlice.reducer;
