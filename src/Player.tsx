import { Player as PlayerObj } from "./GameData"

type PlayerArgs = {
    player: PlayerObj
}

export default function Player({ player }: PlayerArgs) {
    const items = player.items.map(item => <li>{item}</li>);

    return (
        <div className="flex flex-col flex-grow border-solid border-black border-2 rounded-lg p-3 m-3 lg:p-4 lg:m-4">
            <p>
                <strong>{player.username}</strong> - {player.lives} {player.lives !== 1 ? "lives" : "life"}
            </p>
            <br/>
            <br/>
            <p>Items:</p>
            <ul className="list-disc list-inside">{items}</ul>

            <div className="flex flex-row mt-auto pt-2">
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 flex-grow">Action 1</button>
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 flex-grow">Action 2 VVVVVV</button>
            </div>
        </div>
    );
}