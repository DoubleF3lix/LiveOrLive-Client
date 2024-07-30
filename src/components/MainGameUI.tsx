import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import WebSocketConnection from "~/lib/WebSocketConnection";

import ChatBox from "~/components/ChatBox";
import Player from "~/components/Player";

import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";
import { addPlayer, onGameStarted, newRoundStarted, populateGameDataFromPacket, setCurrentHost } from "~/store/GameData";

import { ActionFailedPacket, GameDataRequestPacket, GameDataSyncPacket, HostSetPacket, NewRoundStartedPacket, PlayerJoinedPacket } from "~/types/PacketType";
import MainGameHeader from "./MainGameHeader";
import MainGameFooter from "./MainGameFooter";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const players = useSelector((state: IRootState) => state.gameDataReducer.players);
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

        const gameStartedSubscription = serverConnection.subscribeToServerPacket("gameStarted", () => {
            dispatch(onGameStarted());
        });

        const newRoundStartedSubscription = serverConnection.subscribeToServerPacket("newRoundStarted", (packet) => {
            packet = packet as NewRoundStartedPacket;
            dispatch(newRoundStarted(packet));
            alert(`A new round has started. The chamber has been loaded with ${packet.liveCount} live rounds and ${packet.blankCount} blanks`);
        });

        const actionFailedSubscription = serverConnection.subscribeToServerPacket("actionFailed", (packet) => {
            packet = packet as ActionFailedPacket;
            alert(packet.reason);
        });


        // Trigger the initial UI population *after* we've setup the callbacks
        const getGameInfoPacket: GameDataRequestPacket = {packetType: "gameDataRequest"};
        serverConnection.send(getGameInfoPacket);
        

        return () => {
            serverConnection.unsubscribeFromServerPacket(gameDataSyncSubscription);
            serverConnection.unsubscribeFromServerPacket(playerJoinedSubscription);
            serverConnection.unsubscribeFromServerPacket(hostSetSubscription);
            serverConnection.unsubscribeFromServerPacket(gameStartedSubscription);
            serverConnection.unsubscribeFromServerPacket(newRoundStartedSubscription);
            serverConnection.unsubscribeFromServerPacket(actionFailedSubscription);
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

                {/* Used to push the chatbox to the bottom on smaller views */}
                <div className="flex-grow"></div>
                <hr></hr>

                <ChatBox/>
            </div>
            <hr></hr>
            <MainGameFooter/>
        </div>
    );
}
