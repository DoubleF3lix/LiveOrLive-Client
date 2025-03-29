import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import { Toaster } from "@/sonner";
import { Button } from "@/button";
import { toast } from "~/components/CustomToast";
import OpenSidebarButton from "~/components/Chat/OpenSidebarButton";
import { setHost } from "~/store/LobbyDataSlice";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const dispatch = useAppDispatch();

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);

    useEffect(() => {
        const sub_hostChanged = serverConnection.subscribe("hostChanged", async (previous: string | undefined, current: string | undefined, reason: string | undefined) => {
            dispatch(setHost(current));
            // TODO
            console.log("Host Changed", previous, current, reason);
        });

        const sub_playerKicked = serverConnection.subscribe("playerKicked", async (username: string) => {
            // TODO
            console.log("Player Kicked", username);
        });

        const sub_actionFailed = serverConnection.subscribe("actionFailed", async (reason: string) => {
            // TODO
            console.log("Action Failed", reason);
        });

        return () => {
            serverConnection.unsubscribe("hostChanged", sub_hostChanged);
            serverConnection.unsubscribe("playerKicked", sub_playerKicked);
            serverConnection.unsubscribe("actionFailed", sub_actionFailed);
        };
    }, [dispatch, serverConnection]);

    return <div className="h-dvh w-dvw pl-2">
        <div className="flex">
            <OpenSidebarButton />
            <h1 className="flex-grow text-center justify-center content-center text-2xl font-bold">Live or Live</h1>
        </div>
        <div className="flex flex-grow border-2 border-foreground m-2 mr-4 p-4">
            <div className="flex-col">
                <p>{clientUsername}</p>
                <Button onClick={() => toast({
                    type: "achievement",
                    title: "Ultimate Victory",
                    description: "With only two players left at one life each and a 1/1 chamber, kill your opponent and win the game without using any items",
                    button: {
                        label: "Close",
                        onClick: () => null,
                    }
                })}>Show Toast</Button>

                <div className="flex">
                    <Button onClick={() => serverConnection.kickPlayer("test")}>Kick Player</Button>
                </div>
            </div>
        </div>
        <Toaster duration={Infinity} visibleToasts={5} />
    </div>
}

// TODO ADD "Can Loot Dead Players"