import { condenseItemList } from "~/lib/utils";
import { Player } from "~/types/generated/liveorlive_server.Models";
import { Badge } from "@/badge";
import { Button } from "@/button";
import { Ban, Shield } from "lucide-react";
import { Separator } from "@/separator";
import { PLAYER_CARD_BADGE_ICONS } from "~/lib/const";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/Store";
import { useContext } from "react";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { ServerConnection } from "~/lib/ServerConnection";


type PlayerCardArgs = {
    player: Player
};

export default function PlayerCard({ player }: PlayerCardArgs) {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const currentTurn = useSelector((state: IRootState) => state.lobbyDataReducer.currentTurn);

    const isOurTurn = clientUsername === currentTurn;

    function shootPlayer(username: string) {
        serverConnection.shootPlayer(username);
    }

    return <div className={`flex flex-col border-3 rounded-sm my-2 p-2 md:px-4 md:py-3 ${player.inGame ? "border-foreground" : "border-muted-foreground"}`}>
        <div className="flex justify-between">
            <div className="flex flex-col shrink-0">
                <p className="text-xl font-bold">{player.username}</p>
                <p className="italic">{player.lives} {player.lives === 1 ? "life" : "lives"}</p>
            </div>
            <div className="flex flex-wrap gap-1">
                {player.isSkipped && <Badge className="bg-blue-500 font-bold h-5 text-foreground">{PLAYER_CARD_BADGE_ICONS ? <Ban color="#ffffff" /> : "Skipped"}</Badge>}
                {player.isRicochet && <Badge className="bg-green-400 font-bold h-5 text-foreground">{PLAYER_CARD_BADGE_ICONS ? <Shield color="#ffffff" /> : "Ricochet"}</Badge>}
            </div>
        </div>
        {player.items.length > 0 && <>
            <Separator className="my-1" />
            <p>Items:</p>
            <ul className="list-disc list-inside">
                {condenseItemList(player.items).map((item, index) => <li key={index + "_playerItem"}>{item.displayString}</li>)}
            </ul>
        </>}
        <div className="mt-auto">
            <Button className="mt-2 h-8 w-full" disabled={!isOurTurn || player.lives === 0} onClick={() => shootPlayer(player.username)}>{player.username === clientUsername ? "Shoot Yourself" : "Shoot"}</Button> 
        </div>
    </div>;
}