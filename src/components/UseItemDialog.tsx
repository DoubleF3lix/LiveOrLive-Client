import { useContext, useState } from "react";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";
import { useSelector } from "react-redux";
import { condenseItemList, moveToBackOfArray, moveToFrontOfArray } from "~/lib/utils";
import SelectBox from "~/components/micro/SelectBox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/dialog";
import { Button } from "@/button";
import { SelectItem } from "@/select";
import { Item } from "~/types/generated/LiveOrLiveServer.Enums";
import UseExtraLife from "~/components/UseItem/UseExtraLife";
import UsePickpocket from "~/components/UseItem/UsePickpocket";
import UseSkip from "~/components/UseItem/UseSkip";
import UseRicochet from "~/components/UseItem/UseRicochet";
import UsePocketPistol from "./UseItem/UsePocketPistol";
import { PlayerDto } from "~/types/generated/LiveOrLiveServer.Models.Dto";


type UseItemDialogArgs = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

enum PlaceSelfMode {
    None,
    Front,
    Back
}

export default function UseItemDialog({ open, setOpen }: UseItemDialogArgs) {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;

    const [error, setError] = useState<string>("");

    const selfUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const players = useSelector((state: IRootState) => state.lobbyDataReducer.players);

    const selfItems = players.find(player => player.username === selfUsername)?.items;
    const condensedSelfItems = condenseItemList(selfItems ?? []);
    
    function fetchPlayers(players: PlayerDto[], livingOnly: boolean = false, excludeSelf: boolean = false): PlayerDto[] {
        if (excludeSelf) players = players.filter(player => player.username !== selfUsername);
        if (livingOnly) players = players.filter(player => player.lives >= 1 && !player.eliminated);
        return players;
    }

    function fetchUsernames(players: PlayerDto[], livingOnly: boolean = false, excludeSelf: boolean = false, placeSelfMode: PlaceSelfMode = PlaceSelfMode.None): string[] {
        players = fetchPlayers(players, livingOnly, excludeSelf);
        const usernames = players.map(player => player.username);
        switch (placeSelfMode) {
            case PlaceSelfMode.Front:
                return moveToFrontOfArray(usernames, selfUsername);
            case PlaceSelfMode.Back:
                return moveToBackOfArray(usernames, selfUsername);
            default:
                return usernames;
        }
    }

    const [selectedItem, setSelectedItem] = useState<Item | -1>(-1);
    const [targetUsername, setTargetUsername] = useState<string>("");
    const [selectedItemToSteal, setSelectedItemToSteal] = useState<Item | -1>(-1);
    const [stolenItemTargetUsername, setStolenItemTargetUsername] = useState<string>("");

    function resetFields() {
        setSelectedItem(-1);
        setTargetUsername("");
        setSelectedItemToSteal(-1);
        setStolenItemTargetUsername("");
    }

    function close() {
        setOpen(false);
        // I don't like seeing the error go away before it fades out
        setTimeout(() => {
            resetFields(); 
            setError("");
        }, 100);
    }

    function useItem() {
        // Some quick client side validation
        if (selectedItem === -1) {
            setError("Please select an item");
            return;
        }
        if ((selectedItem === Item.ExtraLife || selectedItem === Item.Pickpocket || selectedItem === Item.Skip || selectedItem === Item.Ricochet) && targetUsername === "") {
            setError("Please select a target");
            return;        
        }
        if (selectedItem === Item.Pickpocket) {
            if (selectedItemToSteal === -1) {
                setError("Please select an item to steal");
                return;
            }
            if ((selectedItemToSteal === Item.ExtraLife || selectedItemToSteal === Item.Skip || selectedItemToSteal === Item.Ricochet) && stolenItemTargetUsername === "") {
                setError("Please select a target for the item you're stealing");
                return;
            }
        }
        
        switch (selectedItem as Item) {
            case Item.ReverseTurnOrder:
                serverConnection.useReverseTurnOrderItem();
                break;
            case Item.RackChamber:
                serverConnection.useRackChamberItem();
                break;
            case Item.ExtraLife:
                serverConnection.useExtraLifeItem(targetUsername);
                break;
            case Item.Pickpocket:
                serverConnection.usePickpocketItem(targetUsername, selectedItemToSteal as Item, stolenItemTargetUsername);
                break;
            case Item.LifeGamble:
                serverConnection.useLifeGambleItem();
                break;
            case Item.Invert:
                serverConnection.useInvertItem();
                break;
            case Item.ChamberCheck:
                serverConnection.useChamberCheckItem();
                break;
            case Item.DoubleDamage:
                serverConnection.useDoubleDamageItem();
                break;
            case Item.Skip:
                serverConnection.useSkipItem(targetUsername);
                break;
            case Item.Ricochet:
                serverConnection.useRicochetItem(targetUsername);
                break;
            case Item.PocketPistol:
                serverConnection.usePocketPistolItem(targetUsername);
                break;
        }
        close();
    }

    return selfItems && <Dialog open={open}>
        <DialogContent onInteractOutside={close} onCloseButtonClick={close}>
            <DialogHeader>
                <DialogTitle>Use Item</DialogTitle>
                <DialogDescription className="text-red-300">{error}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center lg:gap-x-8">
                <SelectBox label="Item:" optionsHeader="Items" placeholder="Select an item" onValueChange={(value: string) => { resetFields(); setSelectedItem(parseInt(value)); }}>
                    {condensedSelfItems.map(item => <SelectItem key={item.id + "useItemSelectItem"} value={item.id.toString()}>{item.displayString}</SelectItem>)}
                </SelectBox>

                {/* Move preset select boxes to components, include labels */}
                {selectedItem === Item.ExtraLife && <UseExtraLife 
                    usernames={fetchUsernames(players, false, false, PlaceSelfMode.Front)}
                    targetUsername={targetUsername}
                    setTargetUsername={setTargetUsername} 
                />}

                {selectedItem === Item.Pickpocket && <UsePickpocket 
                    playerUsernamesSelfFirst={fetchUsernames(players, false, true, PlaceSelfMode.Front)}         // Passed to UseStolenItem (for Extra Life and Ricochet)
                    playerUsernamesSelfLast={fetchUsernames(players, false, true, PlaceSelfMode.Back)}           // Passed to UseStolenItem (for Skip)
                    otherPlayers={fetchPlayers(players, false, true)}                                            // Used to compute valid pickpocket targets (has to have at least one non-pickpocket item)
                    targetUsername={targetUsername}                                                              // The player we're stealing from
                    setTargetUsername={setTargetUsername}
                    selectedItemToSteal={selectedItemToSteal}                                                    // The item we're stealing from the above player
                    setSelectedItemToSteal={setSelectedItemToSteal}
                    stolenItemTargetUsername={stolenItemTargetUsername}                                          // The player we're using the stolen item on. May be null.     
                    setStolenItemTargetUsername={setStolenItemTargetUsername} 
                />}

                {selectedItem === Item.Skip && <UseSkip 
                    usernames={fetchUsernames(players, true, false, PlaceSelfMode.Back)}
                    targetUsername={targetUsername} 
                    setTargetUsername={setTargetUsername} 
                />}

                {selectedItem === Item.Ricochet && <UseRicochet 
                    usernames={fetchUsernames(players, true, false, PlaceSelfMode.Front)}
                    targetUsername={targetUsername}
                    setTargetUsername={setTargetUsername} 
                />}

                {selectedItem === Item.PocketPistol && <UsePocketPistol 
                    usernames={fetchUsernames(players, true, true, PlaceSelfMode.None)}
                    targetUsername={targetUsername}
                    setTargetUsername={setTargetUsername} 
                />}
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={close}>Cancel</Button>
                <Button onClick={useItem}>Use</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>;
}