import { Item } from "~/types/generated/liveorlive_server.Enums";
import UseExtraLife from "~/components/UseItem/UseExtraLife";
import UseSkip from "~/components/UseItem/UseSkip";
import UseRicochet from "~/components/UseItem/UseRicochet";


type UseStolenItemArgs = {
    selectedItemToSteal: Item | -1;
    playerUsernamesSelfFirst: string[];
    playerUsernamesSelfLast: string[];
    stolenItemTargetUsername: string;
    setStolenItemTargetUsername: (value: string) => void;
};

export default function UseStolenItem({ selectedItemToSteal, playerUsernamesSelfFirst, playerUsernamesSelfLast, stolenItemTargetUsername, setStolenItemTargetUsername }: UseStolenItemArgs) {
    if (selectedItemToSteal === Item.ReverseTurnOrder) return null;
    if (selectedItemToSteal === Item.RackChamber) return null;
    if (selectedItemToSteal === Item.ExtraLife) return <UseExtraLife playerUsernamesSelfFirst={playerUsernamesSelfFirst} targetUsername={stolenItemTargetUsername} setTargetUsername={setStolenItemTargetUsername} />;
    if (selectedItemToSteal === Item.Pickpocket) return null;
    if (selectedItemToSteal === Item.LifeGamble) return null;
    if (selectedItemToSteal === Item.Invert) return null;
    if (selectedItemToSteal === Item.ChamberCheck) return null;
    if (selectedItemToSteal === Item.DoubleDamage) return null;
    if (selectedItemToSteal === Item.Skip) return <UseSkip playerUsernamesSelfLast={playerUsernamesSelfLast} targetUsername={stolenItemTargetUsername} setTargetUsername={setStolenItemTargetUsername} />;
    if (selectedItemToSteal === Item.Ricochet) return <UseRicochet playerUsernamesSelfFirst={playerUsernamesSelfFirst} targetUsername={stolenItemTargetUsername} setTargetUsername={setStolenItemTargetUsername} />;
    return null;
}