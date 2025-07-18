import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/dropdown-menu";
import { CircleAlert, Sparkles } from "lucide-react";
import { PLAYER_CARD_BADGE_ICONS } from "~/lib/const";
import { useSelector } from "react-redux";
import { IRootState, useAppDispatch } from "~/store/Store";
import { Badge } from "@/badge";
import { showAlertDialog } from "~/store/AlertDialogQueueSlice";


type PlayerDropdownDisplayArgs = {
    playerUsername: string;
};

export default function PlayerDropdownDisplay({ playerUsername }: PlayerDropdownDisplayArgs) {
    const dispatch = useAppDispatch();

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const lobbyHost = useSelector((state: IRootState) => state.lobbyDataReducer.host);

    const isHost = clientUsername === lobbyHost;

    // Actual server call is handled in confirmation
    function promptTransferHost(username: string) {
        setTimeout(() => {
            dispatch(showAlertDialog({
                title: "Confirm",
                description: `Are you sure you want to transfer host to ${username}?`, 
                onClick: "transferHost",
                skippable: true,
                arg: username
            }));
        }, 175);
    }

    function promptKickPlayer(username: string) {
        // TODO overhaul dialogs to make them more dynamic, probably don't need them in the store
        setTimeout(() => {
            dispatch(showAlertDialog({
                title: "Confirm",
                description: `Are you sure you want to kick ${username}?`, 
                onClick: "kickPlayer",
                skippable: true,
                arg: username
            }));
        }, 175);
    }

    return <li>
        <DropdownMenu>
            <DropdownMenuTrigger className="w-min">
                <div className="flex">
                    <p className="shrink-0">{playerUsername === clientUsername ? <strong>{playerUsername} (You)</strong> : playerUsername}</p>
                    {playerUsername === lobbyHost && <Badge className="ml-2 mt-1 bg-amber-400 font-bold h-5 text-foreground">{PLAYER_CARD_BADGE_ICONS ? <Sparkles color="#ffffff" /> : "Host"}</Badge>}
                </div>
            </DropdownMenuTrigger>
            {isHost && playerUsername !== clientUsername &&
                <DropdownMenuContent className="ml-12">
                    <DropdownMenuLabel className="font-bold">{playerUsername}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => promptTransferHost(playerUsername)}>Transfer Host</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => promptKickPlayer(playerUsername)}>
                        <CircleAlert color="#ff6467" className="p-0 mt-0.5" />
                        <span className="text-red-400">Kick</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            }
        </DropdownMenu>
    </li>;
}