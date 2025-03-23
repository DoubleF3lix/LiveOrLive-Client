import { useState } from "react";
import LobbyHub from "./components/LobbyHub";
import ContextWrapper from "./components/ContextWrapper";
import { Provider } from "react-redux";
import store from "./store/Store";


export default function App() {

    // useEffect(() => {
    //     const webSocketConn = import.meta.env.DEV ? new WebSocketConnection("http://localhost:8080") : new WebSocketConnection("https://liveorlive-server.fly.dev/");
    //     const onConnectSubscription = webSocketConn.subscribeToEvent("onConnect", () => {
    //         console.log("Connected!");
    //         setIsConnected(true);
    //     });

    //     setWs(webSocketConn);

    //     return () => {
    //         webSocketConn.unsubscribeFromEvent(onConnectSubscription);
    //         webSocketConn.close();
    //         setWs(null);
    //     }
    // }, []);

    const [lobbyConnectionInfo, setLobbyConnectionInfo] = useState<string[]>([]);

    // No more null checking downstream :D
    return <>
        {lobbyConnectionInfo.length === 0 ? 
            <LobbyHub setLobbyConnectionInfo={setLobbyConnectionInfo} /> : 
            <Provider store={store}>
                <ContextWrapper lobbyId={lobbyConnectionInfo[0]} username={lobbyConnectionInfo[1]} />
            </Provider>
        }
    </>;
}
