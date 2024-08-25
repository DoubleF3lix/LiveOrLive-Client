import { useState, useEffect } from "react";
import { Provider } from "react-redux";

import WebSocketConnection from "~/lib/WebSocketConnection";

import Lobby from "~/components/Lobby";
import MainGameUI from "~/components/MainGameUI";

import store from "~/store/Store";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import PopupManager from "./components/PopupManager";


export default function App() {
    const [serverConnection, setWs] = useState<WebSocketConnection | null>(null);

    const [isLobby, setIsLobby] = useState<boolean>(true);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const webSocketConn = import.meta.env.DEV ? new WebSocketConnection("http://localhost:8080") : new WebSocketConnection("https://liveorlive-server.fly.dev/");
        webSocketConn.subscribeToEvent("onConnect", () => {
            console.log("New connection!");
            setIsConnected(true);
        });

        setWs(webSocketConn);

        return () => {
            webSocketConn.close();
            setWs(null);
        }
    }, []);

    // No more null checking downstream :D
    return isConnected ? (
        <Provider store={store}>
            <ServerConnectionContext.Provider value={serverConnection}>
                {isLobby ? <Lobby setIsLobby={(value: boolean) => { setIsLobby(value) }} /> : <MainGameUI />}
                <PopupManager />
            </ServerConnectionContext.Provider>
        </Provider>
    ) : <p>Connecting...</p>;
}
