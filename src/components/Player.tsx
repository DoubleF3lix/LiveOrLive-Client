import { useSelector } from "react-redux";

import { selectCurrentPlayer, selectHost } from "~/store/Selectors";

import { PlayerType } from "~/types/PlayerType";


type PlayerArgs = {
    player: PlayerType
};


export default function Player({ player }: PlayerArgs) {
    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentHost = useSelector(selectHost);

    return (
        <div className="flex flex-col flex-grow border-solid border-black border-2 rounded-lg p-3 m-3 lg:p-4 lg:m-4">
            <p>
                <strong>{player.username}</strong> - {player.lives} {player.lives !== 1 ? "lives" : "life"}
            </p>

            <br/>
            <br/>

            {currentPlayer?.items.length !== 0 ? (<>
                <p>Items:</p>
                <ul className="list-disc list-inside">
                    {/* TODO need collapsible items (like Double Damage x2) */}
                    {player.items.map((item, index) => <li key={index + "_playerItem"}>{item}</li>)} 
                </ul>
            </>) : <p>No Items</p>}


            <div className="flex flex-row mt-auto pt-2">
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 flex-grow disabled:bg-opacity-50">Shoot</button>
                {currentPlayer === currentHost ? <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 flex-grow disabled:bg-opacity-50">Kick</button> : <></>}
            </div>
        </div>
    );
}