import { useContext } from "react";
import { useSelector } from "react-redux";

import WebSocketConnection from "~/lib/WebSocketConnection";
import { condenseItemList } from "~/lib/utils";

import { selectCurrentPlayer } from "~/store/Selectors";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";

import { ShootPlayerPacket } from "~/types/PacketType";
import { PlayerType } from "~/types/PlayerType";


type PlayerArgs = {
    player: PlayerType
};


export default function Player({ player }: PlayerArgs) {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentTurn = useSelector((state: IRootState) => state.gameDataReducer.currentTurn);

    function shootPlayer() {
        const shootPlayerPacket: ShootPlayerPacket = {packetType: "shootPlayer", target: player.username};
        serverConnection.send(shootPlayerPacket);
    }

    return (
        <div className={`flex flex-col grow border-solid border-${player.isSkipped ? "red-700" : "black"} border-2 rounded-lg p-3 m-3 lg:p-4 lg:m-4`}>
            <p>
                <strong>{player.username}</strong> - {player.lives} {player.lives !== 1 ? "lives" : "life"}
            </p>

            <br/>
            <br/>

            {player.items.length > 0 ? (<>
                <p>Items:</p>
                <ul className="list-disc list-inside">
                    {condenseItemList(player.items).map((item, index) => <li id={index + "_playerItem"}>{item}</li>)} 
                </ul>
            </>) : <p>No Items</p>}


            <div className="flex flex-row mt-auto pt-2">
                {/* <button className="bg-gray-600 px-2 mx-0.5 text-white rounded-sm h-8 grow disabled:bg-opacity-50" onClick={shootPlayer} disabled={currentPlayer.username !== currentTurn}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/>
                    </svg>

                    <span className="ml-2">Shoot</span>
                </button> */}
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded-sm h-8 grow disabled:bg-opacity-50" onClick={shootPlayer} disabled={currentPlayer.username !== currentTurn}>Shoot</button>
            </div>
        </div>
    );
}