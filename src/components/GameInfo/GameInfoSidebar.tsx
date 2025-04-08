import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/sheet";
import { Button } from "@/button";
import { IRootState } from "~/store/Store";
import { useSelector } from "react-redux";
import { Separator } from "@/separator";
import { CircleHelp} from "lucide-react";
import PlayerDropdownDisplay from "./PlayerDropdownDisplay";


type GameInfoSidebarArgs = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function GameInfoSidebar({ open, setOpen }: GameInfoSidebarArgs) {
    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const lobbyName = useSelector((state: IRootState) => state.lobbyDataReducer.name);
    const lobbyHost = useSelector((state: IRootState) => state.lobbyDataReducer.host);
    const allPlayers = useSelector((state: IRootState) => state.lobbyDataReducer.players)
    const settings = useSelector((state: IRootState) => state.lobbyDataReducer.settings);

    const isHost = clientUsername === lobbyHost;
    const players = allPlayers.filter(player => !player.isSpectator);
    const spectators = allPlayers.filter(player => player.isSpectator);

    const closeSidebar = () => setOpen(false);

    return <Sheet open={open}>
        <SheetContent side="right" onCloseButtonClick={closeSidebar} onInteractOutside={closeSidebar}>
            <SheetHeader>
                <SheetTitle>{lobbyName}</SheetTitle>
                <SheetDescription>Players: {players.length}/{settings.maxPlayers}</SheetDescription>
                <Separator className="my-2" />
            </SheetHeader>
            <div className="flex flex-col px-4 -mt-8 overflow-y-auto">
                <div className="flex justify-between">
                    <p>Players:</p>
                    {/* TODO onclick show help */}
                    {isHost && <CircleHelp className="stroke-muted-foreground" />}
                    {/* <span className="text-muted-foreground text-sm">Click a username to open admin controls</span> */}
                </div>
                <ul className="list-disc list-inside pl-2">
                    {players.map(player => <PlayerDropdownDisplay key={`${player.username}_playerDropdownDisplay`} player={player} />)}
                </ul>

                <p>Spectators:</p>
                <ul className="list-disc list-inside pl-2">
                    {spectators.map(player => <PlayerDropdownDisplay key={`${player.username}_playerDropdownDisplay`} player={player} />)}
                </ul>
                <Separator className="my-2" />
                <p>Settings:</p>

            </div>
            <SheetFooter>
                <Button onClick={closeSidebar}>Close</Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
}