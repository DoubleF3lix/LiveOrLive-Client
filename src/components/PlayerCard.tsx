import { condenseItemList } from "~/lib/utils";
import { Player } from "~/types/generated/liveorlive_server";
import { Badge } from "@/badge";
import { Button } from "@/button";
import { Ban, Shield, Sparkles } from "lucide-react";
import { Separator } from "@/separator";


type PlayerCardArgs = {
    player: Player,
    isHost: boolean
};

export default function PlayerCard({ player, isHost }: PlayerCardArgs) {
    const BADGE_ICONS = true;

    return <div className="border-foreground border-3 rounded-sm my-2 p-2 md:px-4 md:py-3">
        <div className="flex justify-between">
            <div className="flex flex-col shrink-0">
                <p className="text-xl font-bold">{player.username}</p>
                <p className="italic">{player.lives} {player.lives === 1 ? "life" : "lives"}</p>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
                {isHost && <Badge className="bg-amber-400 font-bold h-5 text-foreground">{BADGE_ICONS ? <Sparkles color="#ffffff" /> : "Host"}</Badge>}
                {player.isSkipped && <Badge className="bg-blue-500 font-bold h-5 text-foreground">{BADGE_ICONS ? <Ban color="#ffffff" /> : "Skipped"}</Badge>}
                {player.isRicochet && <Badge className="bg-green-400 font-bold h-5 text-foreground">{BADGE_ICONS ? <Shield color="#ffffff" /> : "Ricochet"}</Badge>}
            </div>
        </div>
        <Separator className="my-1" />
        <p>Items:</p>
        <ul className="list-disc list-inside">
            {condenseItemList(player.items).map((item, index) => <li key={index + "_playerItem"}>{item}</li>)}
        </ul>
        <Button className="mt-2 h-8 w-full">Shoot</Button>
    </div>;
}