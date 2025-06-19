import SelectBox from "~/components/micro/SelectBox";
import { SelectItem } from "@/select";
import { Player } from "~/types/generated/liveorlive_server";
import { Item } from "~/types/generated/liveorlive_server.Enums";
import UseStolenItem from "~/components/UseItem/UseStolenItem";
import { condenseItemList } from "~/lib/utils";


type UsePickpocketArgs = {
    playerUsernamesSelfFirst: string[];
    playerUsernamesSelfLast: string[];
    otherPlayers: Player[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
    selectedItemToSteal: Item | -1;
    setSelectedItemToSteal: (value: Item) => void;
    stolenItemTargetUsername: string;
    setStolenItemTargetUsername: (value: string) => void;
};

export default function UsePickpocket({ playerUsernamesSelfFirst, playerUsernamesSelfLast, otherPlayers, targetUsername, setTargetUsername, selectedItemToSteal, setSelectedItemToSteal, stolenItemTargetUsername, setStolenItemTargetUsername }: UsePickpocketArgs) {
    const validPickpocketTargets: Player[] = otherPlayers
        .map(player => ({ ...player, items: player.items.filter(item => item !== Item.Pickpocket) }))
        .filter(player => player.items.length >= 1) ?? [];
    const validPickpocketTargetUsernames = validPickpocketTargets.map(player => player.username);
    const targetPlayer = validPickpocketTargets.find(player => player.username === targetUsername);
    const targetItems = targetPlayer?.items ?? [];
    const condensedTargetItemsNoPickpocket = condenseItemList(targetItems);

    // If you want defaultValue for Steal From, add defaultValue={validPickpocketTargetUsernames[0]} and uncomment the below
    /* // Without this, the defaultValue of Steal From doesn't properly populate the item list
    useEffect(() => {
        if (validPickpocketTargetUsernames.length > 0 && !targetUsername) {
            setTargetUsername(validPickpocketTargetUsernames[0]);
        }
    }, [validPickpocketTargetUsernames, targetUsername, setTargetUsername]); */

    return <>
        <SelectBox label="Steal From:" optionsHeader="Targets" placeholder="Select a target" onValueChange={setTargetUsername}>
            {validPickpocketTargetUsernames.map(playerUsername => <SelectItem key={playerUsername + "_useItemSelectStealTarget"} value={playerUsername}>{playerUsername}</SelectItem>)}
        </SelectBox>

        <SelectBox label="Steal Item:" optionsHeader="Takeable Items" placeholder="Select an item to steal" onValueChange={(value: string) => setSelectedItemToSteal(parseInt(value))}>
            {condensedTargetItemsNoPickpocket.map(item => <SelectItem key={item.id + "_useItemSelectStealItem"} value={item.id.toString()}>{item.displayString}</SelectItem>)}
        </SelectBox>

        <UseStolenItem
            selectedItemToSteal={selectedItemToSteal}
            playerUsernamesSelfFirst={playerUsernamesSelfFirst}
            playerUsernamesSelfLast={playerUsernamesSelfLast}
            stolenItemTargetUsername={stolenItemTargetUsername}
            setStolenItemTargetUsername={setStolenItemTargetUsername}
        />
    </>;
}