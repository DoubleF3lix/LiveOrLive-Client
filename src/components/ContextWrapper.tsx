import { useEffect, useRef, useState } from "react";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { useAppDispatch } from "~/store/Store";
import MainGameUI from "~/components/MainGameUI";
import { setUsername } from "~/store/SelfDataSlice";
import { SidebarProvider } from "@/sidebar";
import { ChatSidebar } from "~/components/Chat/ChatSidebar";
import { showAlertDialog } from "~/store/AlertDialogQueueSlice";
import AlertDialogQueue from "~/components/AlertDialogQueue";


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
                "connectionFailed": async (reason: string) => { 
                    dispatch(showAlertDialog({
                        title: "Connection Failed",
                        description: reason,
                        onClick: "reloadWindow"
                    })); 
                    setConnected(false) 
                },
            });
            serverConnection.current.start();
        }
    });

    // Bring in just the dialog queue if we're not connected (so we can show alert dialogs for connection failure)
    // Otherwise, render the entire game UI (AlertDialogQueue is part of MainGameUI)
    return connected ? <>
        <ServerConnectionContext.Provider value={serverConnection.current}>
            <SidebarProvider defaultOpen={false}>
                <ChatSidebar />
                <MainGameUI />
            </SidebarProvider>
        </ServerConnectionContext.Provider>
    </> : <AlertDialogQueue />;
}