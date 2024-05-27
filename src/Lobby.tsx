import { FormEvent, useState } from "react";
import WebSocketConnection from "./WebSocketConnection";
import { JoinGamePacket } from "./Packet";
import GameData from "./GameData";


type LobbyArgs = {
    serverConnection: WebSocketConnection | null,
    gameData: GameData
    setIsLobby: (value: boolean) => void
};

export default function Lobby({ serverConnection, gameData, setIsLobby }: LobbyArgs) {
    const [username, setUsername] = useState<string>("");

    function joinGame(event: FormEvent) {
        event.preventDefault();

        // Send the confirmation packet
        const joinGamePacket: JoinGamePacket = {packetType: "joinGame", username: username};
        serverConnection?.send(joinGamePacket);

        serverConnection?.waitForServerPacket(["playerJoined", "playerJoinRejected"]).then((packet) => {
            if (packet.packetType === "playerJoined") {
                // Check if the accepted player is us, and if so, log in
                if (packet.player.username == username) {
                    gameData.clientUsername = username;
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
                <p>Enter Your Username:</p>
                <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.currentTarget.value)}
                        className="border-solid border-1 border-black"
                />
                <br/>
                <br/>
                <button type="submit">Join Game</button>
            </form>
        </>
    );
}