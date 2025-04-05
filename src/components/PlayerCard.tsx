import { condenseItemList } from "~/lib/utils";
import { Player } from "~/types/generated/liveorlive_server";


type PlayerCardArgs = {
    player: Player
};

export default function PlayerCard({ player }: PlayerCardArgs) {
    return <div className="flex flex-col border-foreground border-2 rounded-sm my-2 p-2 md:px-4 md:py-3">
        <div className="flex justify-between">
            <p><strong>{player.username}</strong></p>
            <p>{player.lives} {player.lives === 1 ? "life" : "lives"}</p>
        </div>
        <p>Items:</p>
        <ul className="list-disc list-inside">
            {condenseItemList(player.items).map((item, index) => <li key={index + "_playerItem"}>{item}</li>)}
        </ul>
    </div>;
}