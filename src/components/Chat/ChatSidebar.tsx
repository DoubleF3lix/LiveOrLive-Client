import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/sidebar";
import { SendHorizontal } from "lucide-react";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { addChatMessage, setChatMessages, setChatIsOpen } from "~/store/ChatSlice";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import { ChatMessage } from "~/types/generated/liveorlive_server";
import { Separator } from "@/separator";



export function ChatSidebar() {
    const dispatch = useAppDispatch();

    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;

    const { isMobile, open, openMobile } = useSidebar();

    const chatMessages = useSelector((state: IRootState) => (state.chatReducer.chatMessages));
    const chatIsOpen = useSelector((state: IRootState) => state.chatReducer.isOpen);

    const [chatMessageInput, setChatMessageInput] = useState<string>("");
    const EOMMarker = useRef<HTMLDivElement>(null);

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
    }, [dispatch, serverConnection]);

    // Update open state depending on desktop/mobile
    useEffect(() => {
        dispatch(setChatIsOpen(isMobile ? openMobile : open)) 
    }, [dispatch, isMobile, open, openMobile]);

    // Scroll down if there's a new message or we open the chat
    useEffect(() => {
        if (chatIsOpen) {
            // For some reason, mobile won't scroll if this timeout isn't there (and why does 0ms time work?)
            setTimeout(scrollToBottom, 1);
        } 
    }, [chatMessages, chatIsOpen]);

    function sendChatMessage(event: FormEvent) {
        event.preventDefault();
        if (chatMessageInput === "") return;
        serverConnection.sendChatMessage(chatMessageInput);
        setChatMessageInput("");
    }

    function scrollToBottom() {
        EOMMarker.current?.scrollIntoView({behavior: "instant"});
    }

    return (
        <Sidebar variant="floating">
            <SidebarHeader>
                <p className="font-bold text-xl text-center">Chat</p>
                <Separator />
            </SidebarHeader>
            <SidebarContent className="px-4">
                {chatMessages.map(message => <p key={message.id}>{message.author}: {message.content}</p>)}
                <div id="EOMMarker" ref={EOMMarker} />
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
