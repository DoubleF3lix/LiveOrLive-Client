import { Player as PlayerObj } from "./GameData"

type PlayerArgs = {
    player: PlayerObj
}

export default function Player({ player }: PlayerArgs) {
    return (
        <div className="flex flex-col flex-grow border-solid border-black border-2 rounded-lg p-3 m-3 lg:p-4 lg:m-4">
            <p>
                <strong>{player.username}</strong> - {player.lives} {player.lives !== 1 ? "lives" : "life"}
            </p>
            <br/>
            <br/>
            <p>Items:</p>
            <ul className="list-disc list-inside">
                {player.items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>

            <div className="flex flex-row mt-auto pt-2">
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 flex-grow disabled:bg-opacity-50">Shoot</button>
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 flex-grow disabled:bg-opacity-50" disabled>Skip</button>
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 flex-grow disabled:bg-opacity-50">Kick</button>
            </div>
        </div>
    );
}