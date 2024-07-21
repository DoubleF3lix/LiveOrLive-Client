import { useContext, useEffect } from "react";
import ChatBox from "./ChatBox";
import WebSocketConnection from "./WebSocketConnection";
import { GetGameInfoPacket, GetGameInfoResponsePacket, PlayerJoinedPacket, StartGamePacket } from "./Packet";
import { addPlayer, populateFromPacket } from "./GameData";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "./Store";
import { ServerConnectionContext } from "./ServerConnectionContext";
import Player from "./Player";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const players = useSelector((state: IRootState) => state.gameDataReducer.players);
    const clientUsername = useSelector((state: IRootState) => state.gameDataReducer.clientUsername);
    const currentHost = useSelector((state: IRootState) => state.gameDataReducer.currentHost);
    const chatMessages = useSelector((state: IRootState) => state.gameDataReducer.chatMessages);
    const turnCount = useSelector((state: IRootState) => state.gameDataReducer.turnCount);
    const dispatch = useDispatch();

    // Runs on successful connection
    useEffect(() => {
        // Populate the redux store with existing game info 
        // (the gameInfoResponse already contains this player, since playerJoined is received in order to make it into this component)
        const getGameInfoPacket: GetGameInfoPacket = {packetType: "getGameInfo"};
        serverConnection.waitForServerPacket("getGameInfoResponse").then((packet => {
            packet = packet as GetGameInfoResponsePacket;
            dispatch(populateFromPacket(packet));
            
            // TODO if turnCount == -1 and gameData.currentHost = gameData.clientUsername, show start game button
        }));
        serverConnection.send(getGameInfoPacket);

        // If any new players connect mid-game (doesn't catch us)
        const playerJoinedSubscription = serverConnection.subscribeToServerPacket("playerJoined", (packet) => {
            packet = packet as PlayerJoinedPacket;
            dispatch(addPlayer(packet.player)); // De-duplication is handled in here
        });

        return () => {
            serverConnection.unsubscribeFromServerPacket(playerJoinedSubscription);
        };
    }, []);

    function startGame() {
        const startGamePacket: StartGamePacket = {packetType: "startGame"};
        serverConnection.send(startGamePacket);
    }

    return (
        <div className="flex flex-col h-dvh">
            {/* TODO make <Header/> component */}
            <div className="flex flex-row justify-center m-1 relative">
                <p className="text-center font-bold text-base lg:text-lg pt-3">EPIC GAME - CODE - Player 1's Turn</p>
                {turnCount != -1 || clientUsername != currentHost ? <></> : 
                    <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end absolute right-0" onClick={startGame}>Start Game</button>
                }
            </div>
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
                {/* TODO ITEMS */}
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