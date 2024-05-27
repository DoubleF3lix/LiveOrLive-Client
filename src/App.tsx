import { useState, useEffect, } from "react";
import Lobby from "./Lobby";
import WebSocketConnection from "./WebSocketConnection";
import MainGameUI from "./MainGameUI";
import GameData from "./GameData";


export default function App() {
    const [serverConnection, setWs] = useState<WebSocketConnection | null>(null);
    const [isLobby, setIsLobby] = useState<boolean>(true);

    const [gameData, _] = useState<GameData>(new GameData()); // eslint-disable-line @typescript-eslint/no-unused-vars

    useEffect(() => {
        const webSocketConn = new WebSocketConnection("http://localhost:8080");
        webSocketConn.subscribeToEvent("onConnect", (_) => { // eslint-disable-line @typescript-eslint/no-unused-vars
            console.log("New connection!");
        });

        setWs(webSocketConn);

        return () => {
            webSocketConn.close();
            setWs(null);
        }
    }, [])

    return isLobby ? (
        <>
            <Lobby serverConnection={serverConnection} gameData={gameData} setIsLobby={(value: boolean) => {setIsLobby(value)}} />
        </>
    ) : (
        <>
            <MainGameUI serverConnection={serverConnection} gameData={gameData} />
        </>
    )
}
