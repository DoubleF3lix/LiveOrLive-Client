import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatMessage } from "~/types/generated/liveorlive_server";


type ChatSliceType = {
    chatMessages: ChatMessage[];
    hasUnread: boolean;
    isOpen: boolean;
};

const initialChatSliceState: ChatSliceType = {
    chatMessages: [],
    hasUnread: false,
    isOpen: false
};

export const chatSlice = createSlice({
    name: "chat",
    initialState: initialChatSliceState,
    reducers: {
        setChatMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.chatMessages = action.payload;
            if (!state.isOpen && state.chatMessages.length >= 1) {
                state.hasUnread = true;
            }
        },
        addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.chatMessages.push(action.payload);
            if (!state.isOpen) {
                state.hasUnread = true;
            }
        },
        deleteChatMessage: (state, action: PayloadAction<string>) => {
            state.chatMessages = state.chatMessages.filter(message => message.id !== action.payload);
        },
        editChatMessage: (state, action: PayloadAction<{id: string, content: string}>) => {
            const message = state.chatMessages.find(message => message.id === action.payload.id);
            if (message) {
                message.content = action.payload.content;
            }
        },
        setIsOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
            if (action.payload) {
                state.hasUnread = false;
            }
        }
    }
});

export const { setChatMessages, addChatMessage, deleteChatMessage, editChatMessage, setIsOpen } = chatSlice.actions;
export default chatSlice.reducer;