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


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const players = useSelector((state: IRootState) => state.gameDataReducer.players);
    const chatMessages = useSelector((state: IRootState) => (state.chatReducer.chatMessages));
    const dispatch = useDispatch();

    // Runs on successful connection
    useEffect(() => {
        // Populate the redux store with existing game info 
        // (the gameInfoResponse already contains this player, since playerJoined is received in order to make it into this component)
        const getGameInfoPacket: GameDataRequestPacket = {packetType: "gameDataRequest"};
        serverConnection.waitForServerPacket("gameDataSync").then((packet => {
            packet = packet as GameDataSyncPacket;
            dispatch(populateGameDataFromPacket(packet));
        }));
        serverConnection.send(getGameInfoPacket);

        const getChatMessagesPacket: ChatMessagesRequest = {packetType: "chatMessagesRequest"};
        serverConnection.waitForServerPacket("chatMessagesSync").then((packet => {
            packet = packet as ChatMessagesSyncPacket;
            dispatch(populateChatFromPacket(packet));
        }));
        serverConnection.send(getChatMessagesPacket);

        // If any new players connect mid-game (doesn't catch us)
        const playerJoinedSubscription = serverConnection.subscribeToServerPacket("playerJoined", (packet) => {
            packet = packet as PlayerJoinedPacket;
            dispatch(addPlayer(packet.player)); // De-duplication is handled in here
        });

        const hostSetSubscription = serverConnection.subscribeToServerPacket("hostSet", (packet) => {
            packet = packet as HostSetPacket;
            dispatch(setCurrentHost(packet.username));
        });

        return () => {
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
            {/* TODO make <Footer/> component */}
            <div className="flex flex-row m-1">
                <label htmlFor="playersList" className="align-middle">Select Player:</label>
                <select name="playersList" id="playerSelect" className="ml-2">
                    {players.map((player) => player.lives > 0 ? <option key={player.username + "_playerSelect"} value={player.username}>{player.username}</option> : <></>)}
                </select>
                {/* TODO ITEMS fetchCurrentPlayerData function */}
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end">Shoot Player</button>
                <label htmlFor="itemsList" className="align-middle">Select Item:</label>
                <select name="itemsList" id="itemSelect" className="ml-2">
                    {players.map((player) => player.lives > 0 ? <option key={player.username + "_playerSelect"} value={player.username}>{player.username}</option> : <></>)}
                </select>
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end">Kick Player</button>
            </div>
        </div>
    );
}