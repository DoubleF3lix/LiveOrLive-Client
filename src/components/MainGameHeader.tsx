import { useContext } from "react";
import { useSelector } from "react-redux";

import WebSocketConnection from "~/lib/WebSocketConnection";
import { queuePopup } from "~/store/PopupSlice";

import { selectCurrentPlayer, selectHost } from "~/store/Selectors";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";

import { StartGamePacket } from "~/types/PacketType";


export default function MainGameHeader() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentHost = useSelector(selectHost);
    const currentTurn = useSelector((state: IRootState) => state.gameDataReducer.currentTurn);
    const gameStarted = useSelector((state: IRootState) => state.gameDataReducer.gameStarted);
    const dispatch = useAppDispatch();

    function startGame() {
        const startGamePacket: StartGamePacket = { packetType: "startGame" };
        serverConnection.send(startGamePacket);
    }

    return (
        <div className="flex flex-row justify-center m-1 relative">
            <p className="font-bold text-base lg:text-lg pt-2 pb-2">Live or Live - {currentTurn ? `${currentTurn}'s turn` : `Waiting for ${currentHost.username}`}</p>

            <div className="flex flex-row left-0 absolute self-start mt-1.5">
                {!gameStarted ? <></> :
                    <button
                        className="bg-gray-600 px-2 mx-0.5 text-white rounded-sm h-8 disabled:bg-opacity-50"
                        onClick={() => dispatch(queuePopup({ type: "SelectItem" }))}
                        disabled={currentPlayer.username !== currentTurn || currentPlayer.items.length === 0}
                    >
                        Use Item
                    </button>
                }

                {gameStarted || currentPlayer !== currentHost ? <></> :
                    <button className="bg-gray-600 px-2 mx-0.5 text-white rounded-sm h-8" onClick={startGame}>Start Game</button>
                }

                {currentPlayer !== currentHost ? <></> :
                    <button
                        className="bg-gray-600 px-2 mx-0.5 text-white rounded-sm h-8 disabled:bg-opacity-50"
                        onClick={() => dispatch(queuePopup({ type: "KickPlayer" }))}
                    >
                        Kick
                    </button>
                }
            </div>
        </div>
    );
}