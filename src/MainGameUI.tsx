import { useContext, useEffect } from "react";
import ChatBox from "./ChatBox";
import WebSocketConnection from "./WebSocketConnection";
import { GetGameInfoPacket, GetGameInfoResponsePacket } from "./Packet";
import { populateFromPacket } from "./GameData";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "./Store";
import { ServerConnectionContext } from "./ServerConnectionContext";
import Player from "./Player";
import { Player as PlayerObj } from "./GameData";



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
    }, []);

    const chunkedPlayers: PlayerObj[][] = [];
    for (let i = 0; i < players.length; i += 2) {
        chunkedPlayers.push(players.slice(i, i + 2));
    }

    return (
        <div className="flex flex-col h-dvh">
            <p className="text-center font-bold text-base lg:text-lg pt-3">EPIC GAME - CODE - Player 1's Turn</p>
            <hr></hr>
            <div className="flex flex-col lg:flex-row overflow-auto"> 
                <div className="w-full overflow-auto grid auto-rows-min sm:grid-cols-2 xl:grid-cols-3">
                    {chunkedPlayers.map((playersChunk) => <>
                        <Player key={playersChunk[0].username} player={playersChunk[0]}/>
                        {playersChunk.length == 2 ? <Player key={playersChunk[1].username} player={playersChunk[1]}/> : <></>}
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