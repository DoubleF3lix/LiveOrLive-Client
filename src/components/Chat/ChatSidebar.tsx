import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/sidebar";
import { SendHorizontal } from "lucide-react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { addChatMessage, setChatMessages } from "~/store/ChatSlice";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";
import { ChatMessage } from "~/types/generated/liveorlive_server";
import { Separator } from "@/separator";



export function ChatSidebar() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;

    const chatMessages = useSelector((state: IRootState) => (state.chatReducer.chatMessages));
    const dispatch = useDispatch();

    const [chatMessageInput, setChatMessageInput] = useState<string>("");

    useEffect(() => {
        const sub_getChatMessagesResponse = serverConnection.subscribe("getChatMessagesResponse", async (messages: ChatMessage[]) => {
            dispatch(setChatMessages(messages));
        });

        const sub_chatMessageSent = serverConnection.subscribe("chatMessageSent", async (message: ChatMessage) => {
            dispatch(addChatMessage(message));
        });

        serverConnection.getChatMessagesRequest();

        return () => {
            serverConnection.unsubscribe("getChatMessagesResponse", sub_getChatMessagesResponse);
            serverConnection.unsubscribe("chatMessageSent", sub_chatMessageSent);
        };
    }, []);

    function sendChatMessage(event: FormEvent) {
        event.preventDefault();
        if (chatMessageInput === "") return;
        serverConnection.sendChatMessage(chatMessageInput);
        setChatMessageInput("");
    }

    return (
        <Sidebar variant="floating">
            <SidebarHeader>
                <p className="font-bold text-xl text-center">Chat</p>
                <Separator />
            </SidebarHeader>
            <SidebarContent className="px-4">
                {chatMessages.map(message => <p key={message.id}>{message.author}: {message.content}</p>)}
            </SidebarContent>
            <SidebarFooter>
                <Separator />
                <form className="flex">
                    {/* <textarea value={chatMessageInput} onChange={e => setChatMessageInput(e.currentTarget.value)} rows={1} placeholder="Type a message..." className="grow min-w-0 border-2 border-input rounded-lg p-1 pl-2 resize-none h-auto" /> */}
                    <input value={chatMessageInput} onChange={e => setChatMessageInput(e.currentTarget.value)} placeholder="Type a message..." className="grow min-w-0 border-2 border-input rounded-lg p-1 pl-2" />
                    <button type="submit" onClick={sendChatMessage} className="bg-chat-send hover:bg-chat-send-hover content-center p-1 pl-2 rounded-xl aspect-square ml-2">
                        <SendHorizontal size={20} color="#ffffff" />
                    </button>
                </form>
            </SidebarFooter>
        </Sidebar>
    )
}
