import { useContext } from "react";
import { useSelector } from "react-redux";

import WebSocketConnection from "~/lib/WebSocketConnection";
import { condenseItemList } from "~/lib/util";

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

    return currentPlayer ? (
        <div className="flex flex-col flex-grow border-solid border-black border-2 rounded-lg p-3 m-3 lg:p-4 lg:m-4">
            <p>
                <strong>{player.username}</strong> - {player.lives} {player.lives !== 1 ? "lives" : "life"}
            </p>

            <br/>
            <br/>

            {currentPlayer.items.length > 0 ? (<>
                <p>Items:</p>
                <ul className="list-disc list-inside">
                    {condenseItemList(player.items).map((item, index) => <li key={index + "_playerItem"}>{item}</li>)} 
                </ul>
            </>) : <p>No Items</p>}


            <div className="flex flex-row mt-auto pt-2">
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 flex-grow disabled:bg-opacity-50" onClick={shootPlayer} disabled={currentPlayer.username !== currentTurn}>Shoot</button>
            </div>
        </div>
    ) : <></>;
}