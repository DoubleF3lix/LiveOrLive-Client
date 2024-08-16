import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { IRootState } from "~/store/Store";
import { selectCurrentPlayer, selectNonSpectators } from "~/store/Selectors";
import { normalizeItemListWithCounts } from "~/lib/util";
import ItemType, { convertItemTypeToName } from "~/types/ItemType";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import WebSocketConnection from "~/lib/WebSocketConnection";


export default function MainGameFooter() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;

    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentTurn = useSelector((state: IRootState) => state.gameDataReducer.currentTurn);
    const currentActionablePlayers = useSelector(selectNonSpectators);
    const gameStarted = useSelector((state: IRootState) => state.gameDataReducer.gameStarted);

    // Stores what item we have selected via the dropdown
    const [selectedItem, setSelectedItem] = useState<ItemType>();

    // Weird name because VSCode thinks it's a react hook if we use "useItem" lol
    function itemUse() {
        if (selectedItem !== undefined) {
            // Having different packets per item may have been a bad move in hindsight...
            switch (selectedItem) {
                case "DoubleDamage":
                    serverConnection.send({ packetType: "useDoubleDamageItem" });
                    break;
                default:
                    console.log(selectedItem);
                    break;
            }
        }
    }

    // This is probably a very bad way to do this, but it DOES work...
    useEffect(() => {
        if (currentPlayer) {
            if (currentPlayer.items.length > 0) {
                setSelectedItem(currentPlayer.items[0]);
            } else {
                setSelectedItem(undefined);
            }
        }
    }, [currentPlayer, currentPlayer?.items]);

    return (
        currentPlayer !== undefined ?
            <div className="flex flex-row m-1 items-center">
                <label htmlFor="playersList" className="align-middle">Select Player:</label>
                <select name="playersList" id="playerSelect" className="ml-2">
                    {/* Don't show any players if the game hasn't started yet. TODO Maybe expose gameStarted publicly instead */}
                    {currentActionablePlayers.map((player) => gameStarted ? <option key={player.username + "_playerSelect"} value={player.username}>{player.username}</option> : <></>)}
                </select>

                <div className="min-w-10"></div>

                <label htmlFor="itemsList" className="">Select Item:</label>
                <select name="itemsList" id="itemSelect" className="ml-2" disabled={currentPlayer.items.length === 0} onChange={e => setSelectedItem(e.target.value as ItemType)}>
                    {/* Keep the item in the value column for fetching, but display a normalized version like what shows up in the item cards */}
                    {/* Sidenote, this probably is an awful way to do this */}
                    {currentPlayer.items.length > 0 ?
                        Array.from(normalizeItemListWithCounts(currentPlayer.items)).map(([item, count]) =>
                            <option key={`${currentPlayer.username}_${item}_itemSelect`} value={item}>
                                {convertItemTypeToName(item)}{count > 1 ? ` (x${count})` : ``}
                            </option>
                        )
                        : <option key={`${currentPlayer.username}_noItems_itemSelect`} value={"N/A"}>No Items</option>
                    }
                </select>
                <button className="bg-gray-600 px-2 mx-0.5 text-white rounded h-8 self-end disabled:bg-opacity-50" disabled={currentPlayer.items.length === 0 || currentPlayer.username !== currentTurn} onClick={itemUse}>Use</button>
            </div>
            : <></>
    );
}