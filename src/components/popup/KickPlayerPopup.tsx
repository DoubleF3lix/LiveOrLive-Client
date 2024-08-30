import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import WebSocketConnection from "~/lib/WebSocketConnection";
import { selectCurrentPlayer, selectNonSpectators } from "~/store/Selectors";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import StyledButton from "~/components/StyledButton";
import { closePopup } from "~/store/PopupSlice";
import { useAppDispatch } from "~/store/Store";
import { KickPlayerPacket } from "~/types/PacketType";


export default function KickPlayerPopup() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const currentPlayer = useSelector(selectCurrentPlayer);
    const selectablePlayers = useSelector(selectNonSpectators).filter(player => player.username !== currentPlayer.username);

    const dispatch = useAppDispatch();

    // Stores what item we have selected via the dropdowns
    const [selectedPlayer, setSelectedPlayer] = useState<string>(selectablePlayers[0]?.username || "N/A");

    function kickPlayer() {
        const kickPlayerPacket: KickPlayerPacket = {packetType: "kickPlayer", username: selectedPlayer}
        serverConnection.send(kickPlayerPacket);
    }

    return <>
        <div className="pt-3 pb-4">
            <div className="flex flex-row m-1 items-center">
                <label htmlFor="itemSelect" className="align-middle">Player:</label>
                <select name="itemsList" id="itemSelect" className="ml-2" onChange={e => setSelectedPlayer(e.target.value)}>
                    {selectablePlayers.length > 0 ?
                        selectablePlayers.map(player =>
                            <option key={`${player.username}_${player}_playerSelect`} value={player.username}>
                                {player.username}
                            </option>
                        )
                        : <option key={`${currentPlayer.username}_noPlayer_playerSelect`} value={"N/A"}>N/A</option>
                    }
                </select>
            </div>
        </div>
        <div className="flex flex-row">
            <StyledButton disabled={selectedPlayer === "N/A"} onClick={() => { kickPlayer(); dispatch(closePopup()); }}>Kick</StyledButton>
            <StyledButton onClick={() => dispatch(closePopup())}>Cancel</StyledButton>
        </div>
    </>;
}