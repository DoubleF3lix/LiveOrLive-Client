import { useState, useEffect } from "react";
import Lobby from "./Lobby";
import WebSocketConnection from "./WebSocketConnection";
import MainGameUI from "./MainGameUI";
import store from "./Store";
import { Provider } from "react-redux";
import { ServerConnectionContext } from "./ServerConnectionContext";


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
    return isConnected ? (isLobby ? (
        <Provider store={store}>
            <ServerConnectionContext.Provider value={serverConnection}>
                <Lobby setIsLobby={(value: boolean) => {setIsLobby(value)}} />
            </ServerConnectionContext.Provider>
        </Provider>
    ) : (
        <Provider store={store}>
            <ServerConnectionContext.Provider value={serverConnection}>
                <MainGameUI/>
            </ServerConnectionContext.Provider>
        </Provider>
    )) : <p>Connecting...</p>;
}
