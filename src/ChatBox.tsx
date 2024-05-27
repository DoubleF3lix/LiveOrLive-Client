import { FormEvent, useEffect, useState } from "react";
import WebSocketConnection from "./WebSocketConnection";
import { NewChatMessageSentPacket, SendNewChatMessagePacket } from "./Packet";
import { ChatMessage as ChatMessageObj } from "./GameData";
import ChatMessage from "./ChatMessage";


type ChatBoxArgs = {
    serverConnection: WebSocketConnection | null,
    preexistingChatMessages: ChatMessageObj[]
};


export default function ChatBox({ serverConnection, preexistingChatMessages }: ChatBoxArgs) {
    const [messages, setMessages] = useState<ChatMessageObj[]>(preexistingChatMessages);
    const [newChatMessage, setNewChatMessage] = useState<string>("");

    let lastMessageAuthor: string = "";
    let endOfMessages: HTMLDivElement | null;

    useEffect(() => {
        setMessages(messages);
    
        serverConnection?.subscribeToServerPacket("newChatMessageSent", (packet) => {
            packet = packet as NewChatMessageSentPacket;
            setMessages([...messages, packet.message]);
        });
        endOfMessages?.scrollIntoView({behavior: "instant"})
    }, [messages]); // Don't need serverConnection or endOfMessages because they're constant per render

    function sendChatMessage(event: FormEvent) {
        event.preventDefault();

        // Make sure we're not flooding it with blank messages if we spam enter
        if (newChatMessage !== "") {
            // Don't auto update the list, make sure server got it first and update then
            setNewChatMessage("");
            const sendNewChatMessagePacket: SendNewChatMessagePacket = {packetType: "sendNewChatMessage", content: newChatMessage};
            serverConnection?.send(sendNewChatMessagePacket);
        }
    }

    function getChatMessageComponent(message: ChatMessageObj, index: number): JSX.Element {
        const component = <ChatMessage key={index} message={message} isNewAuthor={message.author.username !== lastMessageAuthor} includeLineBefore={index !== 0}/>;
        if (message.author.username !== lastMessageAuthor) {
            lastMessageAuthor = message.author.username;
        }
        return component;
    }

    return (
        <div className="border-solid border-1 float-right p-4 m-4 w-1/6">
            <p className="font-bold h-[2vh]">Chat:</p>
            <hr/>
            <br/>
            <div className="-space-y-0 overflow-y-auto h-[78vh] break-words">
                {messages.map((message, index) => getChatMessageComponent(message, index))}
                <div ref={(element) => {endOfMessages = element;}}></div>
            </div>
            <hr/>
            <br/>
            <form onSubmit={sendChatMessage} className="h-[3vh]">
                <input
                    type="text"
                    value={newChatMessage}
                    onChange={e => setNewChatMessage(e.currentTarget.value)}
                    className="border-solid border-1 border-black"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
