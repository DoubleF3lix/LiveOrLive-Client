import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import WebSocketConnection from "~/lib/WebSocketConnection";

import ChatBox from "~/components/ChatBox";
import Player from "~/components/Player";

import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";
import { addPlayer, populateGameDataFromPacket, setCurrentHost } from "~/store/GameData";
import { populateChatFromPacket } from "~/store/ChatSlice";

import { ChatMessagesRequest, ChatMessagesSyncPacket, GameDataRequestPacket, GameDataSyncPacket, HostSetPacket, PlayerJoinedPacket } from "~/types/PacketType";
import MainGameHeader from "./MainGameHeader";
import MainGameFooter from "./MainGameFooter";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const players = useSelector((state: IRootState) => state.gameDataReducer.players);
    const chatMessages = useSelector((state: IRootState) => (state.chatReducer.chatMessages));
    const dispatch = useDispatch();

    // Runs on successful connection
    useEffect(() => {
        // These are their own packets for now just to avoid an extra sync
        // If any new players connect mid-game (doesn't catch us)
        const playerJoinedSubscription = serverConnection.subscribeToServerPacket("playerJoined", (packet) => {
            packet = packet as PlayerJoinedPacket;
            dispatch(addPlayer(packet.player)); // De-duplication is handled in here
        });

        const hostSetSubscription = serverConnection.subscribeToServerPacket("hostSet", (packet) => {
            packet = packet as HostSetPacket;
            dispatch(setCurrentHost(packet.username));
        });

        // These are subscriptions cause we want to be up to date just in case anything else gets sent, but they're also triggered by the below requests
        // Responsible for existing info (players, host, etc.)
        const gameDataSyncSubscription = serverConnection.subscribeToServerPacket("gameDataSync", (packet) => {
            packet = packet as GameDataSyncPacket;
            dispatch(populateGameDataFromPacket(packet));
        });    

        // This should only be called once per client (on page load) in theory, but technically the server can send this whenever it wants 
        // NewChatMessageSent is handled in the ChatBox component to avoid all message history when a single message is sent
        const chatMessagesSyncSubscription = serverConnection.subscribeToServerPacket("chatMessagesSync", (packet) => {
            packet = packet as ChatMessagesSyncPacket;
            dispatch(populateChatFromPacket(packet));
        });

        // Populate the UI initially by making requests (handled by the above)
        const getGameInfoPacket: GameDataRequestPacket = {packetType: "gameDataRequest"};
        const getChatMessagesPacket: ChatMessagesRequest = {packetType: "chatMessagesRequest"};
        serverConnection.send(getGameInfoPacket);
        serverConnection.send(getChatMessagesPacket);

        return () => {
            serverConnection.unsubscribeFromServerPacket(gameDataSyncSubscription);
            serverConnection.unsubscribeFromServerPacket(chatMessagesSyncSubscription);
            serverConnection.unsubscribeFromServerPacket(playerJoinedSubscription);
            serverConnection.unsubscribeFromServerPacket(hostSetSubscription);
        };
    }, []);

    return (
        <div className="flex flex-col h-dvh">
            <MainGameHeader/>
            <hr></hr>
            <div className="flex flex-col flex-grow lg:flex-row overflow-auto"> 
                <div className="w-full overflow-auto grid auto-rows-min sm:grid-cols-2 xl:grid-cols-3">
                    {players.map((player) => <Player key={player.username + "_playerCard"} player={player}/>)}
                </div>

                <div className="flex-grow"></div>
                <hr></hr>

                {/* Make sure we're fully initialized (after getGameInfo comes in) */}
                {chatMessages.length === 0 || chatMessages[0].timestamp !== 0 ? (
                    <ChatBox/>
                ) : <></>}  
            </div>
            <hr></hr>
            <MainGameFooter/>
        </div>
    );
}