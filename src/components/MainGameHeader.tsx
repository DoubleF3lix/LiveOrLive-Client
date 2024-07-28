import { useContext } from "react";
import { useSelector } from "react-redux";

import WebSocketConnection from "~/lib/WebSocketConnection";

import { selectCurrentPlayer, selectHost } from "~/store/Selectors";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";

import { StartGamePacket } from "~/types/PacketType";


export default function MainGameHeader() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentHost = useSelector(selectHost);
    const gameStarted = useSelector((state: IRootState) => state.gameDataReducer.gameStarted);

    function startGame() {
        const startGamePacket: StartGamePacket = {packetType: "startGame"};
        serverConnection.send(startGamePacket);
    }

    return (
        <div className="flex flex-row justify-center m-1 relative">
            <p className="text-center font-bold text-base lg:text-lg pt-3">EPIC GAME - CODE - Player 1's Turn</p>
            {gameStarted || currentPlayer !== currentHost ? <></> : 
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end absolute right-0" onClick={startGame}>Start Game</button>
            }
        </div>
    );
}