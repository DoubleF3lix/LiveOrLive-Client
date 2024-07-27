import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import WebSocketConnection, { WebSocketServerPacketSubscription } from "~/lib/WebSocketConnection";

import ChatMessage from "~/components/ChatMessage";

import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";
import { addChatMessage } from "~/store/ChatSlice";

import { ChatMessageType } from "~/types/ChatMessageType";
import { NewChatMessageSentPacket, SendNewChatMessagePacket } from "~/types/PacketType";


export default function ChatBox() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const chatMessages = useSelector((state: IRootState) => (state.chatReducer.chatMessages));
    const dispatch = useDispatch();

    const [newChatMessageField, setNewChatMessageField] = useState<string>("");

    let lastMessageAuthor: string = "";
    const endOfMessages = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatMessageSubscription: WebSocketServerPacketSubscription = serverConnection.subscribeToServerPacket("newChatMessageSent", (packet) => {
            packet = packet as NewChatMessageSentPacket;
            dispatch(addChatMessage(packet.message));
        });

        return () => {
            serverConnection.unsubscribeFromServerPacket(chatMessageSubscription);
        };
    }, []);

    // Always move to the bottom
    useEffect(() => {
        endOfMessages.current?.scrollIntoView({behavior: "instant"});
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
        <div className="flex flex-col border-solid border-black border-2 rounded-lg p-3 m-3 h-[25dvh] min-h-[25dvh] w-auto lg:w-[25dvw] lg:h-auto lg:p-4 lg:m-4">
            <p className="font-bold text-base lg:text-lg">Chat:</p>
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
        </div>
    );
}
