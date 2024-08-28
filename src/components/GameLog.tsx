import { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import WebSocketConnection, { WebSocketServerPacketSubscription } from "~/lib/WebSocketConnection";
import { addGameLogMessage, populateGameLogFromPacket } from "~/store/GameDataSlice";

import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";

import { GameLogMessagesRequestPacket, GameLogMessagesSyncPacket, NewGameLogMessageSentPacket } from "~/types/PacketType";


type GameLogArgs = {
    visible: boolean
};


export default function ChatBox({ visible }: GameLogArgs) {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const gameLog = useSelector((state: IRootState) => (state.gameDataReducer.gameLog));
    const dispatch = useDispatch();
    
    const endOfMessages = useRef<HTMLDivElement>(null);

    function scrollToBottom() {
        endOfMessages.current?.scrollIntoView({behavior: "instant"});
    }

    useEffect(() => {
        // This should only be called once per client (on page load) in theory, but technically the server can send this whenever it wants 
        const gameLogMessagesSyncSubscription = serverConnection.subscribeToServerPacket("gameLogMessagesSync", packet => {
            packet = packet as GameLogMessagesSyncPacket;
            dispatch(populateGameLogFromPacket(packet));
        });

        const gameLogMessageSubscription: WebSocketServerPacketSubscription = serverConnection.subscribeToServerPacket("newGameLogMessageSent", packet => {
            packet = packet as NewGameLogMessageSentPacket;
            dispatch(addGameLogMessage(packet));
        });


        const getGameLogMessagesPacket: GameLogMessagesRequestPacket = { packetType: "gameLogMessagesRequest" };
        serverConnection.send(getGameLogMessagesPacket);

        scrollToBottom();

        return () => {
            serverConnection.unsubscribeFromServerPacket(gameLogMessageSubscription);
            serverConnection.unsubscribeFromServerPacket(gameLogMessagesSyncSubscription);
        };
    }, []);

    // Always move to the bottom
    useEffect(() => {
        scrollToBottom();
    }, [gameLog]);

    return (
        visible ? <>
            <br className="mt-1 lg:mt-4" />
            <div className="-space-y-0 overflow-y-auto break-words text-sm lg:text-base lg:h-screen ">
                {gameLog.map((message, index) => <p key={index}>{message.message}</p>)}
                <div ref={endOfMessages} id="EOMMarker"></div>
            </div>
            <br className="mt-1 lg:mt-4" />
            <div className="flex-grow"></div>
        </> : <></>
    );
}
