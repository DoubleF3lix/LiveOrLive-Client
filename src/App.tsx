import { useState } from "react";
import LobbyHub from "./components/LobbyHub";
import ContextWrapper from "./components/ContextWrapper";
import { Provider } from "react-redux";
import store from "./store/Store";


export default function App() {
    const [lobbyConnectionInfo, setLobbyConnectionInfo] = useState<string[]>([]);

    return <>
        {lobbyConnectionInfo.length === 0 ? 
            <LobbyHub setLobbyConnectionInfo={setLobbyConnectionInfo} /> : 
            <Provider store={store}>
                <ContextWrapper lobbyId={lobbyConnectionInfo[0]} username={lobbyConnectionInfo[1]} />
            </Provider>
        }
    </>;
}
