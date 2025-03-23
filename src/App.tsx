import { useState } from "react";
import { Provider } from "react-redux";
import LobbyHub from "~/components/LobbyHub/LobbyHub";
import ContextWrapper from "~/components/ContextWrapper";
import store from "~/store/Store";


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
