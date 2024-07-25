import { FormEvent, useContext, useState } from "react";
import { JoinGamePacket } from "./Packet";
import { useDispatch } from "react-redux";
import { setClientUsername } from "./GameData";
import { ServerConnectionContext } from "./ServerConnectionContext";
import WebSocketConnection from "./WebSocketConnection";


type LobbyArgs = {
    setIsLobby: (value: boolean) => void
};

export default function Lobby({ setIsLobby }: LobbyArgs) {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const dispatch = useDispatch();

    const [usernameField, setUsernameField] = useState<string>("");

    function joinGame(event: FormEvent) {
        event.preventDefault();

        // Send the confirmation packet
        const joinGamePacket: JoinGamePacket = { packetType: "joinGame", username: usernameField };
        serverConnection.send(joinGamePacket);

        serverConnection.waitForServerPacket(["playerJoined", "playerJoinRejected"]).then((packet) => {
            if (packet.packetType === "playerJoined") {
                // Check if the accepted player is us, and if so, log in
                if (packet.player.username == usernameField) {
                    dispatch(setClientUsername(usernameField));
                    setIsLobby(false);
                }
            // Username was probably taken already
            } else if (packet.packetType === "playerJoinRejected") {
                alert(packet.reason);
            }
        });
    }

    return (
        <>
            <form onSubmit={joinGame}>
                <p>Enter Your Username (3-20 characters):</p>
                <input
                    type="text"
                    value={usernameField}
                    onChange={e => setUsernameField(e.currentTarget.value)}
                    className="border-solid border-gray-600 border-2 rounded-lg mx-0.5 mb-1"
                />
                <br />
                <button type="submit" className="bg-gray-600 p-1 mx-0.5 text-white rounded h-8">Join Game</button>
            </form>
        </>
    );
}