import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import WebSocketConnection, { WebSocketServerPacketSubscription } from "~/lib/WebSocketConnection";

import ChatMessage from "~/components/ChatMessage";

import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";
import { addChatMessage, populateChatFromPacket } from "~/store/ChatSlice";

import { ChatMessageType } from "~/types/ChatMessageType";
import { ChatMessagesRequestPacket, ChatMessagesSyncPacket, NewChatMessageSentPacket, SendNewChatMessagePacket } from "~/types/PacketType";


type ChatBoxArgs = {
    visible: boolean
};


export default function ChatBox({ visible }: ChatBoxArgs) {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const chatMessages = useSelector((state: IRootState) => (state.chatReducer.chatMessages));
    const dispatch = useDispatch();

    const [newChatMessageField, setNewChatMessageField] = useState<string>("");

    let lastMessageAuthor: string = "";
    const endOfMessages = useRef<HTMLDivElement>(null);

    function scrollToBottom() {
        endOfMessages.current?.scrollIntoView({behavior: "instant"});
    }

    useEffect(() => {
        // This should only be called once per client (on page load) in theory, but technically the server can send this whenever it wants 
        const chatMessagesSyncSubscription = serverConnection.subscribeToServerPacket("chatMessagesSync", (packet) => {
            packet = packet as ChatMessagesSyncPacket;
            dispatch(populateChatFromPacket(packet));
        });

        const chatMessageSubscription: WebSocketServerPacketSubscription = serverConnection.subscribeToServerPacket("newChatMessageSent", (packet) => {
            packet = packet as NewChatMessageSentPacket;
            dispatch(addChatMessage(packet.message));
        });


        const getChatMessagesPacket: ChatMessagesRequestPacket = {packetType: "chatMessagesRequest"};
        serverConnection.send(getChatMessagesPacket);

        scrollToBottom();

        return () => {
            serverConnection.unsubscribeFromServerPacket(chatMessageSubscription);
            serverConnection.unsubscribeFromServerPacket(chatMessagesSyncSubscription);
        };
    }, []);

    // Always move to the bottom
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    function sendChatMessage(event: FormEvent) {
        event.preventDefault();

        // Make sure we're not flooding it with blank messages if we spam enter
        if (newChatMessageField.trim() !== "") {
            // Updating the UI is handled in the subscription since it's server authoritative
            setNewChatMessageField("");
            const sendNewChatMessagePacket: SendNewChatMessagePacket = {packetType: "sendNewChatMessage", content: newChatMessageField};
            serverConnection.send(sendNewChatMessagePacket);
        }
    }

    function getChatMessageComponent(message: ChatMessageType, index: number): JSX.Element {
        const component = <ChatMessage key={index} message={message} isNewAuthor={message.author.username !== lastMessageAuthor} includeLineBefore={index !== 0}/>;
        if (message.author.username !== lastMessageAuthor) {
            lastMessageAuthor = message.author.username;
        }
        return component;
    }

    return (
        visible ? <>
            <br className="mt-1 lg:mt-4"/>
            <div className="-space-y-0 overflow-y-auto break-words text-sm lg:text-base lg:h-screen ">
                {chatMessages.map((message, index) => getChatMessageComponent(message, index))}
                <div ref={endOfMessages} id="EOMMarker"></div>
            </div>  
            <br className="mt-1 lg:mt-4"/>
            <div className="flex-grow"></div>
            <form onSubmit={sendChatMessage} className="flex">
                <input
                    type="text"
                    value={newChatMessageField}
                    onChange={e => setNewChatMessageField(e.currentTarget.value)}
                    className="flex-auto min-w-0 border-solid border-2 border-black rounded text-sm pl-1 pr-1 lg:text-base"
                />
                <button type="submit" className="ml-2 bg-gray-600 px-2 text-white rounded">Send</button>
            </form>
        </> : <></>
    );
}
