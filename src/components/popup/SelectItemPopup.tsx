import { useContext, useRef, useState } from "react";
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
import AmmoType from "~/types/AmmoType";


export default function SelectItemPopup() {
    const serverConnection = useContext(ServerConnectionContext) as WebSocketConnection;
    const currentPlayer = useSelector(selectCurrentPlayer);
    const selectablePlayers = useSelector(selectNonSpectators).filter(player => player.username !== currentPlayer.username);

    const dispatch = useAppDispatch();

    // Stores what item we have selected via the dropdowns
    const [selectedItem, setSelectedItem] = useState<ItemType>(currentPlayer.items[0]);
    const [selectedPlayer, setSelectedPlayer] = useState<string>(selectablePlayers[0].username);
    const selectedAmmoType = useRef<AmmoType>("Live");
    const selectedSkipTarget = useRef<string>(selectablePlayers[0].username);

    const selectedPlayerObject = selectablePlayers.find(player => player.username === selectedPlayer) as PlayerType;
    const [selectedPlayerItem, setSelectedPlayerItem] = useState<ItemType>(selectedPlayerObject.items.filter(item => item !== "StealItem")[0]);

    const rebalancerAmmoSelect = <>
        <div className="flex flex-row m-1 items-center">
            <label htmlFor="ammoTypeSelect" className="align-middle">Type:</label>
            <select name="ammoTypeList" id="ammoTypeSelect" className="ml-2" onChange={e => selectedAmmoType.current = e.target.value as AmmoType}>
                <option key="live_ammoTypeSelect" value="Live">Live</option>
                <option key="blank_ammoTypeSelect" value="Blank">Blank</option>
            </select>
        </div>
    </>;

    function itemUse() {
        if (selectedItem !== undefined) {
            switch (selectedItem) {
                case "SkipPlayerTurn":
                    serverConnection.send({ packetType: "useSkipItem", target: selectedPlayer });
                    break;
                case "DoubleDamage":
                    serverConnection.send({ packetType: "useDoubleDamageItem" });
                    break;
                case "CheckBullet":
                    serverConnection.send({ packetType: "useCheckBulletItem" });
                    break;
                case "Rebalancer":
                    serverConnection.send({ packetType: "useRebalancerItem", ammoType: selectedAmmoType.current });
                    break;
                case "Adrenaline":
                    serverConnection.send({ packetType: "useAdrenalineItem" });
                    break;
                case "StealItem":
                    if (selectedPlayer && selectedPlayerItem) {
                        console.log("STEAL ITEM PACKET:", { 
                            packetType: "useStealItem", 
                            target: selectedPlayer, 
                            item: selectedPlayerItem, 
                            ammoType: selectedPlayerItem === "Rebalancer" ? selectedAmmoType.current : null, 
                            skipTarget: selectedPlayerItem === "SkipPlayerTurn" ? selectedSkipTarget.current : null 
                        });
                        serverConnection.send({ 
                            packetType: "useStealItem", 
                            target: selectedPlayer, 
                            item: selectedPlayerItem, 
                            ammoType: selectedPlayerItem === "Rebalancer" ? selectedAmmoType.current : null, 
                            skipTarget: selectedPlayerItem === "SkipPlayerTurn" ? selectedSkipTarget.current : null 
                        });
                    }
                    break;
                case "AddLife":
                    serverConnection.send({ packetType: "useAddLifeItem" });
                    break;
                case "Quickshot":
                    serverConnection.send({ packetType: "useQuickshotItem" });
                    break;
            }
        }
    }

    // TODO this is bad and really should have like a ConditionalSelect component or something
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
                    <label htmlFor="playerSelect" className="align-middle">Player:</label>
                    <select name="playersList" id="playerSelect" className="ml-2" onChange={e => setSelectedPlayer(e.target.value)}>
                        {selectablePlayers.map((player) => <option key={player.username + "_playerSelect"} value={player.username}>{player.username}</option>)}
                    </select>
                </div>
            </> : <></>}
            {selectedItem === "StealItem" && selectedPlayer ? <>
                <div className="flex flex-row m-1 items-center">
                    <label htmlFor="playerItemSelect" className="align-middle">Steal:</label>
                    <select name="playerItemList" id="playerItemSelect" className="ml-2" onChange={e => setSelectedPlayerItem(e.target.value as ItemType)}>
                        {currentPlayer.items.length > 0 ?
                            Array.from(normalizeItemListWithCounts(selectedPlayerObject.items.filter(item => item !== "StealItem"))).map(([item, count]) =>
                                <option key={`${selectedPlayerObject.username}_${item}_playerItemSelect`} value={item}>
                                    {convertItemTypeToName(item)}{count > 1 ? ` (x${count})` : ``}
                                </option>
                            )
                            : <option key={`${currentPlayer.username}_noItems_playerItemSelect`} value={undefined}>No Items</option>
                        }
                    </select>
                </div>

                {selectedPlayerItem === "Rebalancer" ? rebalancerAmmoSelect : <></>}

                {selectedPlayerItem === "SkipPlayerTurn" ? <>
                    <div className="flex flex-row m-1 items-center">
                        <label htmlFor="stealItemSkipPlayerSelect" className="align-middle">Skip Player:</label>
                        <select name="stealItemSkipPlayersList" id="stealItemSkipPlayerSelect" className="ml-2" onChange={e => selectedSkipTarget.current = e.target.value}>
                            {selectablePlayers.map((player) => <option key={player.username + "_stealItemSkipPlayerSelect"} value={player.username}>{player.username}</option>)}
                        </select>
                    </div>
                </> : <></>}
            </> : <></>}

            {selectedItem === "Rebalancer" ? rebalancerAmmoSelect : <></>}

        </div>
        <div className="flex flex-row">
            <StyledButton
                disabled={
                    selectedItem === "SkipPlayerTurn" && selectedPlayer === undefined
                    || selectedItem === "StealItem" && (selectedPlayer === undefined || selectedItem === undefined)
                }
                onClick={() => { itemUse(); dispatch(closePopup()); }}
            >Use</StyledButton>
            <StyledButton onClick={() => dispatch(closePopup())}>Cancel</StyledButton>
        </div>
    </>;
}