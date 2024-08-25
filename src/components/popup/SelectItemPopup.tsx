import { useContext, useRef } from "react";
import { useSelector } from "react-redux";
import WebSocketConnection from "~/lib/WebSocketConnection";
import { normalizeItemListWithCounts } from "~/lib/util";
import { selectCurrentPlayer } from "~/store/Selectors";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import ItemType, { convertItemTypeToName } from "~/types/ItemType";
import StyledButton from "~/components/StyledButton";
import { closePopup } from "~/store/PopupSlice";
import { useAppDispatch } from "~/store/Store";


export default function SelectItemPopup() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const currentPlayer = useSelector(selectCurrentPlayer);
    const dispatch = useAppDispatch();

    // Stores what item we have selected via the dropdown
    const selectedItem = useRef<ItemType>(currentPlayer.items[0]);
    
    function itemUse() {
        if (selectedItem.current !== undefined) {
            switch (selectedItem.current) {
                case "DoubleDamage":
                    serverConnection.send({ packetType: "useDoubleDamageItem" });
                    break;
                default:
                    console.log(selectedItem);
                    break;
            }
        }
    }

    return <>
        <div className="pt-3 pb-4">
            <select name="itemsList" id="itemSelect" className="ml-2" disabled={currentPlayer.items.length === 0} onChange={e => selectedItem.current = e.target.value as ItemType}>
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
        <div className="flex flex-row">
            <StyledButton onClick={() => {dispatch(closePopup()); itemUse();}}>Use</StyledButton>
            <StyledButton onClick={() => dispatch(closePopup())}>Cancel</StyledButton>
        </div>
    </>;
}