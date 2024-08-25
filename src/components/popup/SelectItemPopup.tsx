import { ReactElement, useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import WebSocketConnection from "~/lib/WebSocketConnection";
import { normalizeItemListWithCounts } from "~/lib/util";
import { selectCurrentPlayer, selectNonSpectators } from "~/store/Selectors";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import ItemType, { convertItemTypeToName } from "~/types/ItemType";
import StyledButton from "~/components/StyledButton";
import { closePopup } from "~/store/PopupSlice";
import { useAppDispatch } from "~/store/Store";
import { PlayerType } from "~/types/PlayerType";


export default function SelectItemPopup() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentActionablePlayers = useSelector(selectNonSpectators);
    const dispatch = useAppDispatch();

    // Stores what item we have selected via the dropdown
    // We need the ref so `itemUse` works properly
    const [selectedItem, setSelectedItem] = useState<ItemType>(currentPlayer.items[0]);
    const [selectedPlayer, setSelectedPlayer] = useState<string>(currentActionablePlayers[0].username);
    const selectedPlayerItem = useRef<ItemType>();

    function showPlayerItemsSelect(): ReactElement {
        // Guaranteed to not be null since showPlayerSelect is called first
        const selectedPlayerObject = currentActionablePlayers.find(player => player.username === selectedPlayer) as PlayerType;
        selectedPlayerItem.current = selectedPlayerObject.items[0];
        return <>
            <div className="flex flex-row m-1 items-center">
                <label htmlFor="playersList" className="align-middle">Steal:</label>
                <select name="playerItemList" id="playerItemSelect" className="ml-2" onChange={e => selectedPlayerItem.current = e.target.value as ItemType}>
                    {currentPlayer.items.length > 0 ?
                        Array.from(normalizeItemListWithCounts(selectedPlayerObject.items)).map(([item, count]) =>
                            <option key={`${selectedPlayerObject.username}_${item}_playerItemSelect`} value={item}>
                                {convertItemTypeToName(item)}{count > 1 ? ` (x${count})` : ``}
                            </option>
                        )
                        : <option key={`${currentPlayer.username}_noItems_playerItemSelect`} value={"N/A"}>No Items</option>
                    }
                </select>
                
            </div>
        </>;
    }

    function itemUse() {
        console.log(selectedItem);

        if (selectedItem !== undefined) {
            switch (selectedItem) {
                case "SkipPlayerTurn":
                    // TODO Skip Player Popup
                    // serverConnection.send({packetType: "useSkipItem", target: ...});
                    break;
                case "DoubleDamage":
                    serverConnection.send({ packetType: "useDoubleDamageItem" });
                    break;
                case "CheckBullet":
                    // serverConnection.send({ packetType: "useCheckBulletItem" });
                    break;
                case "Rebalancer":
                    // TODO Select ammo type
                    // serverConnection.send({packetType: "useRebalancerItem", ammoType: ...});
                    break;
                case "Adrenaline":
                    // serverConnection.send({ packetType: "useAdrenalineItem" });
                    break;
                case "StealItem":
                    // TODO 
                    // serverConnection.send({packetType: "useStealItem", target: ..., item: ...});
                    console.log(selectedPlayer, selectedPlayerItem.current);
                    break;
                case "AddLife":
                    // serverConnection.send({ packetType: "useAddLifeItem" });
                    break;
                case "Quickshot":
                    break;
            }
        }
    }

    return <>
        <div className="pt-3 pb-4">
            <div className="flex flex-row m-1 items-center">
                <label htmlFor="itemSelect" className="align-middle">Item:</label>
                <select name="itemsList" id="itemSelect" className="ml-2" onChange={e => setSelectedItem(e.target.value as ItemType)}>
                    {currentPlayer.items.length > 0 ?
                        Array.from(normalizeItemListWithCounts(currentPlayer.items)).map(([item, count]) =>
                            <option key={`${currentPlayer.username}_${item}_itemSelect`} value={item}>
                                {convertItemTypeToName(item)}{count > 1 ? ` (x${count})` : ``}
                            </option>
                        )
                        : <option key={`${currentPlayer.username}_noItems_itemSelect`} value={"N/A"}>No Items</option>
                    }
                </select>
            </div>

            {selectedItem === "SkipPlayerTurn" || selectedItem === "StealItem" ? <>
                <div className="flex flex-row m-1 items-center">
                    <label htmlFor="playersList" className="align-middle">Player:</label>
                    <select name="playersList" id="playerSelect" className="ml-2" onChange={e => setSelectedPlayer(e.target.value as ItemType)}>
                        {currentActionablePlayers.map((player) => <option key={player.username + "_playerSelect"} value={player.username}>{player.username}</option>)}
                    </select>
                </div>
            </> : <></>}

            {selectedItem === "StealItem" && selectedPlayer ? showPlayerItemsSelect() : <></>}

        </div>
        <div className="flex flex-row">
            <StyledButton onClick={() => { dispatch(closePopup()); itemUse(); }}>Use</StyledButton>
            <StyledButton onClick={() => dispatch(closePopup())}>Cancel</StyledButton>
        </div>
    </>;
}