import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import WebSocketConnection from "./WebSocketConnection";
import { GetGameInfoPacket, GetGameInfoResponsePacket } from "./Packet";
import GameData, { ChatMessage } from "./GameData";


type MainGameUIArgs = {
    serverConnection: WebSocketConnection | null,
    gameData: GameData
};

export default function MainGameUI({ serverConnection, gameData }: MainGameUIArgs) {
    const [preexistingChatMessages, setPreexistingChatMessages] = useState<ChatMessage[]>([{author: {username: "", items: [], lives: 0}, message: "", timestamp: 0}]);

    useEffect(() => {
        // Runs on successful connection
        const getGameInfoPacket: GetGameInfoPacket = {packetType: "getGameInfo"};
        serverConnection?.send(getGameInfoPacket);
        serverConnection?.waitForServerPacket("getGameInfoResponse").then((packet => {
            packet = packet as GetGameInfoResponsePacket;

            gameData.chat.populateFromPacket(packet);
            gameData.players = packet.players;
            gameData.turnCount = packet.turnCount;
            // gameData.currentHost = packet.currentHost.username;

            // TODO if turnCount == -1 and gameData.currentHost = gameData.clientUsername, show start game button

            setPreexistingChatMessages(packet.chatMessages);
        }));
    }, []);

    return (
        // h-screen is ESSENTIAL to no-scroll. DO NOT REMOVE
        <div className="flex flex-col h-dvh lg:flex-row"> 
            {/* TODO doesn't update properly anymore, but it's a state?? */}
            {/* Conditionally render the chatbox when we're ready */}
            {/* {gameData.chat.messages.length == 0 || gameData.chat.messages[0].timestamp !== 0 ? ( */}
            {preexistingChatMessages.length == 0 || preexistingChatMessages[0].timestamp !== 0 ? (
                // <ChatBox serverConnection={serverConnection} preexistingChatMessages={gameData.chat.messages}/>
                <ChatBox serverConnection={serverConnection} preexistingChatMessages={preexistingChatMessages} />
            ) : <></>}  
        </div>
    );
}