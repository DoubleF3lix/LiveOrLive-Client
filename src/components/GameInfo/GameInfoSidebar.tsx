import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/sheet";
import { Button } from "@/button";
import { IRootState, useAppDispatch } from "~/store/Store";
import { useSelector } from "react-redux";
import { Separator } from "@/separator";
import { CircleHelp } from "lucide-react";
import PlayerDropdownDisplay from "~/components/GameInfo/PlayerDropdownDisplay";
import { Popover, PopoverContent } from "@/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import SettingsDisplay from "~/components/SettingsDisplay";
import { useContext, useEffect } from "react";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { ServerConnection } from "~/lib/ServerConnection";
import { GameLogMessage } from "~/types/generated/liveorlive_server.Models";
import { addGameLogMessage, setGameLogMessages } from "~/store/GameLogSlice";
import { checkClientIsPlayer } from "~/lib/utils";
import { showAlertDialog } from "~/store/AlertDialogQueueSlice";


type GameInfoSidebarArgs = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

function timestampToFormatString(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString(undefined, { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function GameInfoSidebar({ open, setOpen }: GameInfoSidebarArgs) {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const dispatch = useAppDispatch();

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const lobbyId = useSelector((state: IRootState) => state.lobbyDataReducer.id);
    const isGameStarted = useSelector((state: IRootState) => state.lobbyDataReducer.gameStarted);
    const lobbyName = useSelector((state: IRootState) => state.lobbyDataReducer.name);
    const lobbyHost = useSelector((state: IRootState) => state.lobbyDataReducer.host);
    const players = useSelector((state: IRootState) => state.lobbyDataReducer.players);
    const spectators = useSelector((state: IRootState) => state.lobbyDataReducer.spectators);
    const settings = useSelector((state: IRootState) => state.lobbyDataReducer.settings);
    const queueLength = useSelector((state: IRootState) => state.alertDialogQueueReducer.queue.length);
    const gameLogMessages = useSelector((state: IRootState) => state.gameLogReducer.gameLogMessages);

    const client = players.find(player => player.username === clientUsername) ?? spectators.find(spectator => spectator.username === clientUsername);
    const clientIsPlayer = client !== undefined ? checkClientIsPlayer(client) : false;

    const isHost = clientUsername === lobbyHost;

    const closeSidebar = () => setOpen(false);

    useEffect(() => {
        const sub_getGameLogResponse = serverConnection.subscribe("getGameLogResponse", async (messages: GameLogMessage[]) => {
            dispatch(setGameLogMessages(messages));
        });

        const sub_gameLogUpdate = serverConnection.subscribe("gameLogUpdate", async (message: GameLogMessage) => {
            dispatch(addGameLogMessage(message));
        });

        serverConnection.getGameLogRequest();

        return () => {
            serverConnection.unsubscribe("getGameLogResponse", sub_getGameLogResponse);
            serverConnection.unsubscribe("gameLogUpdate", sub_gameLogUpdate);
        };
    }, [dispatch, serverConnection]);

    return <Sheet open={open}>
        <SheetContent side="right" onCloseButtonClick={closeSidebar} onInteractOutside={queueLength === 0 ? closeSidebar : undefined}>
            <SheetHeader>
                <SheetTitle>{lobbyName}</SheetTitle>
                <SheetDescription>
                    Room Code: {lobbyId}
                    <br />
                    Players: {players.length}/{settings.maxPlayers}
                </SheetDescription>
                <Separator className="my-2" />
            </SheetHeader>
            <div className="flex flex-col px-4 -mt-8 overflow-y-auto">
                <div className="flex justify-between">
                    <p>Players: </p>
                    {isHost && <Popover>
                        <PopoverTrigger>
                            <CircleHelp className="stroke-muted-foreground" />
                        </PopoverTrigger>
                        <PopoverContent className="mr-2 max-w-60 p-3">
                            <p className="italic text-muted-foreground">Click on a username below for host-only actions</p>
                        </PopoverContent>
                    </Popover>}
                </div>
                <ul className="list-disc list-inside pl-2">
                    {players.map(player => <PlayerDropdownDisplay key={`${player.username}_playerDropdownDisplay`} playerUsername={player.username} />)}
                </ul>

                {spectators.length > 0 && <>
                    <p>Spectators:</p>
                    <ul className="list-disc list-inside pl-2">
                        {spectators.map(player => <PlayerDropdownDisplay key={`${player.username}_playerDropdownDisplay`} playerUsername={player.username} />)}
                    </ul>
                </>}
                <Separator className="my-2" />

                <p className="mb-2">Lobby Settings:</p>
                <SettingsDisplay settings={settings} editable={false} className="overflow-y-auto pr-2" />
                <Separator className="my-2" />

                <p className="mb-2">Game Log:</p>
                <textarea className="border-2 border-input rounded-lg p-1 px-2 resize-none grow text-xs font-mono" rows={6} disabled={true}
                    value={gameLogMessages.map(message => `[${timestampToFormatString(message.timestamp)}]: ${message.message}`).join("\n")}
                    placeholder="No game log available" />
            </div>
            <SheetFooter>
                <Separator className="-mt-4 mb-2" />
                {isGameStarted && clientIsPlayer &&
                    <Button variant="destructive" onClick={() => dispatch(showAlertDialog({
                        title: "Forfeit Game",
                        description: "Are you sure you want to forfeit the game? You can't undo this action.",
                        onClick: "forfeitGame",
                        skippable: true
                    }))}>Forfeit</Button>
                }
                <Button onClick={closeSidebar}>Close</Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
}