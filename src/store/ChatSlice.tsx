import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ChatMessageType } from "~/types/ChatMessageType";
import { ChatMessagesSyncPacket } from "~/types/PacketType";


type ChatSliceType = {
    chatMessages: ChatMessageType[];
};


const initialChatSliceState: ChatSliceType = {
    chatMessages: [{ author: { username: "", inGame: false, isSpectator: false, lives: -1, items: [], isSkipped: false, joinTime: 0 }, message: "", timestamp: 0 }]
};

export const chatSlice = createSlice({
    name: "chat",
    initialState: initialChatSliceState,
    reducers: {
        addChatMessage: (state, action: PayloadAction<ChatMessageType>) => {
            state.chatMessages.push(action.payload);
        },
        populateChatFromPacket: (state, action: PayloadAction<ChatMessagesSyncPacket>) => {
            state.chatMessages = action.payload.messages;
        }
    }
});

export const { addChatMessage, populateChatFromPacket } = chatSlice.actions;
export default chatSlice.reducer;
