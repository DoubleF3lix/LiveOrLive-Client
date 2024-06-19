import { useContext, useEffect } from "react";
import ChatBox from "./ChatBox";
import WebSocketConnection from "./WebSocketConnection";
import { GetGameInfoPacket, GetGameInfoResponsePacket, PlayerJoinedPacket } from "./Packet";
import { addPlayer, populateFromPacket } from "./GameData";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "./Store";
import { ServerConnectionContext } from "./ServerConnectionContext";
import Player from "./Player";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const players = useSelector((state: IRootState) => (state.gameDataReducer.players));
    const chatMessages = useSelector((state: IRootState) => (state.gameDataReducer.chatMessages));
    const dispatch = useDispatch();

    useEffect(() => {
        // Runs on successful connection
        const getGameInfoPacket: GetGameInfoPacket = {packetType: "getGameInfo"};
        serverConnection.send(getGameInfoPacket);
        serverConnection.waitForServerPacket("getGameInfoResponse").then((packet => {
            packet = packet as GetGameInfoResponsePacket;
            dispatch(populateFromPacket(packet));

            // TODO if turnCount == -1 and gameData.currentHost = gameData.clientUsername, show start game button
        }));

        const playerJoinedSubscription = serverConnection.subscribeToServerPacket("playerJoined", (packet) => {
            packet = packet as PlayerJoinedPacket;
            if (!players.some((player) => player.username === packet.player.username)) {
                dispatch(addPlayer(packet.player));
            }
        });

        return () => {
            serverConnection.unsubscribeFromServerPacket(playerJoinedSubscription);
        };
    }, []);

    return (
        <div className="flex flex-col h-dvh">
            <div className="flex flex-row justify-center m-1">
                <p className="text-center font-bold text-base lg:text-lg pt-3">EPIC GAME - CODE - Player 1's Turn</p>
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end">Kick Player</button>
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end">Start Game</button>
            </div>
            <hr></hr>
            <div className="flex flex-col lg:flex-row overflow-auto"> 
                <div className="w-full overflow-auto grid auto-rows-min sm:grid-cols-2 xl:grid-cols-3">
                    {players.map((player) => <>
                        <Player key={player.username} player={player}/>
                    </>)}
                </div>

                <hr></hr>

                {chatMessages.length === 0 || chatMessages[0].timestamp !== 0 ? (
                    <ChatBox/>
                ) : <></>}  
            </div>
        </div>
    );
}