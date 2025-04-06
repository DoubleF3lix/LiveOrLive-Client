import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import { Toaster } from "@/sonner";
import OpenSidebarButton from "~/components/Chat/OpenSidebarButton";
import { addPlayer, loadFromPacket, removePlayer, setHost } from "~/store/LobbyDataSlice";
import { Separator } from "@/separator";
import { Lobby, Player } from "~/types/generated/liveorlive_server";
import AlertDialogQueue from "./AlertDialogQueue";
import { showAlertDialog } from "~/store/AlertDialogQueueSlice";
import PlayerCard from "~/components/PlayerCard";
import GameInfoSidebar from "~/components/GameInfoSidebar";
import { Info } from "lucide-react";
import IconButton from "~/components/micro/IconButton";


export default function MainGameUI() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const dispatch = useAppDispatch();

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const lobbyHost = useSelector((state: IRootState) => state.lobbyDataReducer.host);
    const players = useSelector((state: IRootState) => state.lobbyDataReducer.players);

    const [gameInfoSidebarOpen, setGameInfoSidebarOpen] = useState<boolean>(true);

    const selfPlayer = players.find(p => p.username === clientUsername);
    const isHost = clientUsername === lobbyHost;

    // Auto-reload window if the server dies, maybe comment out
    serverConnection.onDisconnect((error) => {
        if (error) {
            dispatch(showAlertDialog({
                title: "Connection Lost",
                description: "The server has disconnected. The page will now reload.",
                onClick: "reloadWindow"
            }));
        }
    });

    useEffect(() => {
        const sub_getLobbyDataResponse = serverConnection.subscribe("getLobbyDataResponse", async (lobbyData: Lobby) => {
            console.log("getLobbyDataResponse", lobbyData);
            dispatch(loadFromPacket(lobbyData));
        });

        const sub_playerJoined = serverConnection.subscribe("playerJoined", async (player: Player) => {
            dispatch(addPlayer(player));
        });

        const sub_playerLeft = serverConnection.subscribe("playerLeft", async (username: string) => {
            dispatch(removePlayer(username));
        });

        const sub_hostChanged = serverConnection.subscribe("hostChanged", async (previous: string | undefined, current: string | undefined, reason: string | undefined) => {
            dispatch(setHost(current));
            console.log("Host Changed", previous, current, reason);
        });

        const sub_playerKicked = serverConnection.subscribe("playerKicked", async (username: string) => {
            if (username === clientUsername) {
                dispatch(showAlertDialog({
                    title: "Connection Lost",
                    description: "You were kicked from the game",
                    onClick: "reloadWindowKicked"
                }));
            } else {
                dispatch(removePlayer(username));
            }
        });

        const sub_actionFailed = serverConnection.subscribe("actionFailed", async (reason: string) => {
            dispatch(showAlertDialog({
                title: "Action Failed",
                description: reason
            }));
        });

        serverConnection.getLobbyDataRequest();

        return () => {
            serverConnection.unsubscribe("getLobbyDataResponse", sub_getLobbyDataResponse);
            serverConnection.unsubscribe("playerJoined", sub_playerJoined);
            serverConnection.unsubscribe("playerLeft", sub_playerLeft);
            serverConnection.unsubscribe("hostChanged", sub_hostChanged);
            serverConnection.unsubscribe("playerKicked", sub_playerKicked);
            serverConnection.unsubscribe("actionFailed", sub_actionFailed);
        };
    }, [dispatch, serverConnection]);

    return <div className="flex flex-col h-dvh w-dvw p-2 overflow-x-auto">
        {/* Header */}
        <div className="flex mb-0 mt-3 justify-between pb-3">
            <OpenSidebarButton className="ml-2" />
            <h1 className="flex-grow text-center justify-center content-center text-2xl font-bold -mt-1">Live or Live</h1>
            <IconButton onClick={() => setGameInfoSidebarOpen(true)} className="mr-2">
                <Info />
            </IconButton>
        </div>
        <Separator />
        {/* Body */}
        <div className="flex flex-col flex-grow m-1 p-2 lg:p-4 overflow-y-auto @container">
            <p className="text-wrap overflow-x-auto">{JSON.stringify(selfPlayer)}</p>
            <div className="grid grid-cols-1 gap-1 @lg:grid-cols-2 @lg:gap-4 @4xl:grid-cols-3 @7xl:grid-cols-4 @7xl:gap-6">
                {players.map(player => !player.isSpectator && <PlayerCard key={player.username + "_playerCard"} player={player} />)}
            </div>
        </div>
        {/* Admin-Only Footer */}
        {isHost && <div className="flex m-1">
            <div className="flex flex-col flex-grow mt-auto">
                <Separator />
                <p className="mt-2 flex-grow text-center content-center text-2xl">{clientUsername}</p>
            </div>
        </div>}

        <AlertDialogQueue />
        <GameInfoSidebar open={gameInfoSidebarOpen} setOpen={setGameInfoSidebarOpen} />
        <Toaster duration={10000} visibleToasts={3} />
    </div>
}
