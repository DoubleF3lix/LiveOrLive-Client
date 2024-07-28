import { useSelector } from "react-redux";

import { IRootState } from "~/store/Store";
import { selectCurrentPlayer, selectNonSpectators } from "~/store/Selectors";


export default function MainGameFooter() {
    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentActionablePlayers = useSelector(selectNonSpectators);
    const gameStarted = useSelector((state: IRootState) => state.gameDataReducer.gameStarted);

    return (
        <div className="flex flex-row m-1">
            <label htmlFor="playersList" className="align-middle">Select Player:</label>
            <select name="playersList" id="playerSelect" className="ml-2">
                {/* Don't show any players if the game hasn't started yet. TODO Maybe expose gameStarted publicly instead */}
                {currentActionablePlayers.map((player) => gameStarted ? <option key={player.username + "_playerSelect"} value={player.username}>{player.username}</option> : <></>)}
            </select>

            <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end">Shoot Player</button>
            
            <label htmlFor="itemsList" className="align-middle">Select Item:</label>
            <select name="itemsList" id="itemSelect" className="ml-2">
                {currentPlayer?.items.map((item) => <option key={`${currentPlayer.username}_${item}_itemSelect`} value={item}>{item}</option>)}
            </select>
            <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end">Kick Player</button>
        </div>
    );
}