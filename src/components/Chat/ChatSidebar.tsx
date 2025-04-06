import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/sidebar";
import { SendHorizontal } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { addChatMessage, setChatMessages, setChatIsOpen } from "~/store/ChatSlice";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import { ChatMessage as ChatMessageType } from "~/types/generated/liveorlive_server";
import { Separator } from "@/separator";
import ChatMessages from "~/components/Chat/ChatMessages";
import IconButton from "~/components/micro/IconButton";



export function ChatSidebar() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const dispatch = useAppDispatch();

    const { isMobile, open, openMobile } = useSidebar();

    const chatMessages = useSelector((state: IRootState) => (state.chatReducer.chatMessages));
    const chatIsOpen = useSelector((state: IRootState) => state.chatReducer.isOpen);

    const chatMessageInput = useRef<HTMLTextAreaElement>(null);

    function sendChatMessage() {
        if (!chatMessageInput.current || chatMessageInput.current.value === "") return;
        serverConnection.sendChatMessage(chatMessageInput.current.value);
        chatMessageInput.current.value = "";
        chatMessageInput.current.style.height = "auto";
    }

    function scrollToPercentage(percentage: number = 1) {
        const sidebarContent = document.querySelector('[data-slot="sidebar-content"]');
        if (sidebarContent) {
            sidebarContent.scrollTo({ top: percentage * (sidebarContent.scrollHeight - sidebarContent.clientHeight), behavior: "instant" });
        }
    }

    // Firefox Mobile doesn't change dvh when the on-screen keyboard goes up, so we have to do this nonsense to hack it
    function resizeListener() {
        // ref is always null for some reason, so this will have to do
        const sidebarContent = document.querySelector('[data-slot="sidebar-content"]');
        if (sidebarContent) {
            const oldScrollPercentage = sidebarContent.scrollTop / (sidebarContent.scrollHeight - sidebarContent.clientHeight);
            document.documentElement.style.setProperty("--viewport-height", `${window.visualViewport?.height}px`);
            scrollToPercentage(oldScrollPercentage);
        }
    }

    useEffect(() => {
        window.visualViewport?.addEventListener("resize", resizeListener);

        const chatMessageInputCurrent = chatMessageInput.current;
        // Needs to be in input so it shrinks if we hit something like CTRL+A -> Backspace
        function inputListener() {
            if (!chatMessageInputCurrent) return;
            chatMessageInputCurrent.style.height = "auto";
            // About 4 lines of text
            chatMessageInputCurrent.style.height = `${Math.min(chatMessageInputCurrent.scrollHeight + 6, 125)}px`;
        }
        function keydownListener(event: KeyboardEvent) {
            if (event.key === "Enter" && event.shiftKey === false) {
                sendChatMessage();
                event.preventDefault();
            }
        }
        chatMessageInput.current?.addEventListener("input", inputListener);
        chatMessageInput.current?.addEventListener("keydown", keydownListener);

        const sub_getChatMessagesResponse = serverConnection.subscribe("getChatMessagesResponse", async (messages: ChatMessageType[]) => {
            dispatch(setChatMessages(messages));
        });

        const sub_chatMessageSent = serverConnection.subscribe("chatMessageSent", async (message: ChatMessageType) => {
            dispatch(addChatMessage(message));
        });

        serverConnection.getChatMessagesRequest();

        return () => {
            window.visualViewport?.removeEventListener("resize", resizeListener);
            if (chatMessageInputCurrent) {
                chatMessageInputCurrent.removeEventListener("input", inputListener);
                chatMessageInputCurrent.removeEventListener("keypress", keydownListener);
            }

            serverConnection.unsubscribe("getChatMessagesResponse", sub_getChatMessagesResponse);
            serverConnection.unsubscribe("chatMessageSent", sub_chatMessageSent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, serverConnection]);

    // Update open state depending on desktop/mobile
    useEffect(() => {
        dispatch(setChatIsOpen(isMobile ? openMobile : open));
    }, [dispatch, isMobile, open, openMobile]);

    // Scroll down if there's a new message or we open the chat
    useEffect(() => {
        if (chatIsOpen) {
            // For some reason, this doesn't trigger if this timeout isn't there
            setTimeout(() => {
                scrollToPercentage();
                resizeListener();
            }, 1);
        }
    }, [chatMessages, chatIsOpen]);

    return <div>
        <Sidebar variant="floating">
            <SidebarHeader>
                <p className="font-bold text-xl text-center">Chat</p>
                <Separator />
            </SidebarHeader>
            <SidebarContent className="px-2">
                <ChatMessages messages={chatMessages} />
            </SidebarContent>
            <SidebarFooter>
                <Separator />
                <div className="flex">
                    <textarea ref={chatMessageInput} rows={1} placeholder="Type a message..." className="grow min-w-0 border-2 border-input rounded-lg p-1 pl-2 resize-none" />
                    <IconButton onClick={sendChatMessage} className="bg-chat-send hover:bg-chat-send-hover/99 content-center p-1 pl-1.5 rounded-xl w-8 ml-2" overrideSpacing>
                        <SendHorizontal size={20} color="#ffffff" />
                    </IconButton>
                </div>
            </SidebarFooter>
        </Sidebar>
    </div>;
}
