import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/sheet";
import { Button } from "@/button";
import { IRootState } from "~/store/Store";
import { useSelector } from "react-redux";
import { Separator } from "@/separator";
import { Sparkles } from "lucide-react";
import { PLAYER_CARD_BADGE_ICONS } from "~/lib/const";
import { Badge } from "@/badge";
import { useContext } from "react";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { ServerConnection } from "~/lib/ServerConnection";


type GameInfoSidebarArgs = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function GameInfoSidebar({ open, setOpen }: GameInfoSidebarArgs) {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);

    const lobbyName = useSelector((state: IRootState) => state.lobbyDataReducer.name);
    const lobbyHost = useSelector((state: IRootState) => state.lobbyDataReducer.host);
    const players = useSelector((state: IRootState) => state.lobbyDataReducer.players);
    const settings = useSelector((state: IRootState) => state.lobbyDataReducer.settings);
    
    const isHost = clientUsername === lobbyHost;

    function promptKickPlayer(username: string) {
        // TODO make DialogQueue for skippable ones
        serverConnection.kickPlayer(username)
    }

    return <Sheet open={open} onOpenChange={() => { setOpen(!open) }}>
        <SheetContent side="right">
            <SheetHeader onClick={() => setOpen(false)}>
                <SheetTitle>{lobbyName}</SheetTitle>
                <SheetDescription>
                    <span>Players: {players.length}/{settings.maxPlayers}</span>
                </SheetDescription>
                <Separator className="my-4" />
            </SheetHeader>
            <div className="flex flex-col px-4 -mt-8">
                <p>Players:</p>
                <ul className="list-disc list-inside pl-2 overflow-y-auto">
                    {players.map(player => !player.isSpectator && (<>
                        <div className="flex justify-between my-1">
                            <div className="flex">
                                <li className="content-center">{player.username === clientUsername ? <strong>{player.username} (You)</strong> : player.username}</li>
                                {player.username === lobbyHost && <Badge className="ml-2 mt-1 bg-amber-400 font-bold h-5 text-foreground">{PLAYER_CARD_BADGE_ICONS ? <Sparkles color="#ffffff" /> : "Host"}</Badge>}
                            </div>
                            {/* Only show kick button if it's the host and not us */}
                            {isHost && player.username !== clientUsername && <Button onClick={() => promptKickPlayer(player.username)} variant="destructive" className="h-7">Kick</Button>}
                        </div>
                    </>))}
                </ul>
                <Separator className="my-4" />
                <p>Spectators:</p>
                <ul className="list-disc list-inside pl-2 overflow-y-auto">
                    {players.map(player => player.isSpectator && <li>{player.username === clientUsername ? <strong>{player.username} (You)</strong> : player.username}</li>)}
                </ul>
                <Separator className="my-4" />
                <p>Settings:</p>

            </div>
            <SheetFooter>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
}