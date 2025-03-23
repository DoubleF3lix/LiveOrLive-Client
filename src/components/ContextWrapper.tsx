import { useEffect, useRef, useState } from "react";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { useAppDispatch } from "~/store/Store";
import MainGameUI from "./MainGameUI";
import { setUsername } from "~/store/SelfDataSlice";


type ContextWrapperArgs = {
    lobbyId: string,
    username: string;
};

export default function ContextWrapper({ lobbyId, username }: ContextWrapperArgs) {
    const serverConnection = useRef<ServerConnection | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!serverConnection.current) {
            serverConnection.current = new ServerConnection(lobbyId, username);
            serverConnection.current.waitForAny({
                "connectionSuccess": async () => { 
                    dispatch(setUsername(username));
                    setConnected(true);  
                },
                "connectionFailed": async (reason: string) => { alert(reason); setConnected(false) },
            });
            serverConnection.current.start();
        }
    });

    return <>
        <ServerConnectionContext.Provider value={serverConnection.current}>
            {connected ? <MainGameUI /> : <></>
                // // It's practically instant anyway but just in case we want it later...
                // <div className="flex flex-col justify-center items-center h-screen ">
                //     <img src="./src/assets/loading.gif" className="max-w-full max-h-full"alt="Loading..." />
                //     <p className="mt-4">Please wait...</p>
                // </div>
            }
        </ServerConnectionContext.Provider>
    </>;
}