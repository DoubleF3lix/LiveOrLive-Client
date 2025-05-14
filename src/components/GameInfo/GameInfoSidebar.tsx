import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/sheet";
import { Button } from "@/button";
import { IRootState } from "~/store/Store";
import { useSelector } from "react-redux";
import { Separator } from "@/separator";
import { CircleHelp } from "lucide-react";
import PlayerDropdownDisplay from "./PlayerDropdownDisplay";
import { Popover, PopoverContent } from "@/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import SettingsDisplay from "~/components/SettingsDisplay";


type GameInfoSidebarArgs = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function GameInfoSidebar({ open, setOpen }: GameInfoSidebarArgs) {
    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const lobbyId = useSelector((state: IRootState) => state.lobbyDataReducer.id);
    const lobbyName = useSelector((state: IRootState) => state.lobbyDataReducer.name);
    const lobbyHost = useSelector((state: IRootState) => state.lobbyDataReducer.host);
    const allPlayers = useSelector((state: IRootState) => state.lobbyDataReducer.players)
    const settings = useSelector((state: IRootState) => state.lobbyDataReducer.settings);
    const queueLength = useSelector((state: IRootState) => state.alertDialogQueueReducer.queue.length);

    const isHost = clientUsername === lobbyHost;
    const players = allPlayers.filter(player => !player.isSpectator);
    const spectators = allPlayers.filter(player => player.isSpectator);

    const closeSidebar = () => setOpen(false);

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
                    {players.map(player => <PlayerDropdownDisplay key={`${player.username}_playerDropdownDisplay`} player={player} />)}
                </ul>

                {spectators.length > 0 && <>
                    <p>Spectators:</p>
                    <ul className="list-disc list-inside pl-2">
                        {spectators.map(player => <PlayerDropdownDisplay key={`${player.username}_playerDropdownDisplay`} player={player} />)}
                    </ul>
                </>}
                <Separator className="my-2" />

                <p className="mb-2">Lobby Settings:</p>
                <SettingsDisplay settings={settings} editable={false} className="overflow-y-auto pr-2" />
                <Separator className="my-2" />

                <p className="mb-2">Game Log:</p>
                <textarea className="border-2 border-input rounded-lg p-1 px-2 resize-none grow" rows={4} disabled={true}
                    value={``}
                    placeholder="No game log available" />
            </div>
            <SheetFooter>
                <Separator className="-mt-4 mb-2" />
                <Button onClick={closeSidebar}>Close</Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
}