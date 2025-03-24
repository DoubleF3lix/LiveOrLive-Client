import { useEffect, useRef, useState } from "react";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import MainGameUI from "~/components/MainGameUI";
import { setUsername } from "~/store/SelfDataSlice";
import { SidebarProvider } from "@/sidebar";
import { ChatSidebar } from "~/components/Chat/ChatSidebar";
import { useSelector } from "react-redux";
import { setIsOpen } from "~/store/ChatSlice";


type ContextWrapperArgs = {
    lobbyId: string,
    username: string;
};

export default function ContextWrapper({ lobbyId, username }: ContextWrapperArgs) {
    const serverConnection = useRef<ServerConnection | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    const chatIsOpen = useSelector((state: IRootState) => state.chatReducer.isOpen);

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

    return connected ? <>
        <ServerConnectionContext.Provider value={serverConnection.current}>
            <SidebarProvider defaultOpen={false} open={chatIsOpen} onOpenChange={(open) => dispatch(setIsOpen(open))}>
                <ChatSidebar />
                <MainGameUI />
            </SidebarProvider>
        </ServerConnectionContext.Provider>
    </> : <></>;
}