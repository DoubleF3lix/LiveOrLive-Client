import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/sidebar";
import { SendHorizontal } from "lucide-react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { addChatMessage, setChatMessages, setChatIsOpen } from "~/store/ChatSlice";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import { ChatMessage as ChatMessageType } from "~/types/generated/liveorlive_server";
import { Separator } from "@/separator";
import ChatMessage from "./ChatMessage";



export function ChatSidebar() {
    const dispatch = useAppDispatch();

    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;

    const { isMobile, open, openMobile } = useSidebar();

    const chatMessages = useSelector((state: IRootState) => (state.chatReducer.chatMessages));
    const chatIsOpen = useSelector((state: IRootState) => state.chatReducer.isOpen);

    const [chatMessageInput, setChatMessageInput] = useState<string>("");

    function sendChatMessage(event: FormEvent) {
        event.preventDefault();
        if (chatMessageInput === "") return;
        serverConnection.sendChatMessage(chatMessageInput);
        setChatMessageInput("");
    }

    function scrollToPercentage(percentage: number = 1) {
        const sidebarContent = document.querySelector('[data-slot="sidebar-content"]');
        if (sidebarContent) {
            sidebarContent.scrollTo({ top: percentage * (sidebarContent.scrollHeight - sidebarContent.clientHeight), behavior: "instant" });
        }
    }

    useEffect(() => {
        function resizeListener() {
            // ref is always null for some reason, so this will have to do
            const sidebarContent = document.querySelector('[data-slot="sidebar-content"]');
            if (sidebarContent) {
                const oldScrollPercentage = sidebarContent.scrollTop / (sidebarContent.scrollHeight - sidebarContent.clientHeight);
                document.documentElement.style.setProperty("--viewport-height", `${window.visualViewport?.height}px`);
                console.log(oldScrollPercentage);
                scrollToPercentage(oldScrollPercentage);
            }
        }

        // Firefox Mobile doesn't change dvh when the on-screen keyboard goes up, so we have to do this nonsense to hack it
        window.visualViewport?.addEventListener("resize", resizeListener);

        const sub_getChatMessagesResponse = serverConnection.subscribe("getChatMessagesResponse", async (messages: ChatMessageType[]) => {
            dispatch(setChatMessages(messages));
        });

        const sub_chatMessageSent = serverConnection.subscribe("chatMessageSent", async (message: ChatMessageType) => {
            dispatch(addChatMessage(message));
        });

        serverConnection.getChatMessagesRequest();

        return () => {
            window.visualViewport?.removeEventListener("resize", resizeListener);

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
            setTimeout(scrollToPercentage, 1);
        }
    }, [chatMessages, chatIsOpen]);

    return <div>
        <Sidebar variant="floating">
            <SidebarHeader>
                <p className="font-bold text-xl text-center">Chat</p>
                <Separator />
            </SidebarHeader>
            <SidebarContent className="px-4">
                {chatMessages.map(message => <ChatMessage key={message.id} message={message} />)}
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
    </div>;
}
