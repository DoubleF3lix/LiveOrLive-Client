import LabelAndSwitchGridRow from "~/components/micro/LabelAndSwitchGridRow";
import LabelAndNumberGridRow from "~/components/micro/LabelAndNumberGridRow";
import { Separator } from "@/separator";
import { SettingsRefs } from "~/types/SettingsRefs";
import { Settings } from "~/types/generated/liveorlive_server.Models";


type SettingsDisplayArgs = {
    settings: SettingsRefs | Settings;
    className?: string;
    editable?: boolean;
};

export default function SettingsDisplay({ settings, className, editable = true }: SettingsDisplayArgs) {
    let modSettings: SettingsRefs;
    if (!editable) {
        modSettings = Object.fromEntries(
            Object.entries(settings).map(([k, v]) => [k, { current: v }])
        ) as SettingsRefs;
    } else {
        modSettings = settings as SettingsRefs;
    }

    return <div className={`grid grid-cols-[1fr_auto] gap-2 items-center ${className}`}>
        <LabelAndSwitchGridRow label="Private:" boolRef={modSettings.private} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndNumberGridRow label="Max Players:" numberRef={modSettings.maxPlayers} disabled={!editable}></LabelAndNumberGridRow>
        <Separator className="col-span-2" />
        <LabelAndNumberGridRow label="Min Blank Rounds:" numberRef={modSettings.minBlankRounds} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndNumberGridRow label="Min Live Rounds:" numberRef={modSettings.minLiveRounds} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndNumberGridRow label="Max Blank Rounds:" numberRef={modSettings.maxBlankRounds} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndNumberGridRow label="Max Live Rounds:" numberRef={modSettings.maxLiveRounds} disabled={!editable}></LabelAndNumberGridRow>
        <Separator className="col-span-2" />
        <LabelAndNumberGridRow label="Default Lives:" numberRef={modSettings.defaultLives} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndNumberGridRow label="Max Lives:" numberRef={modSettings.maxLives} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndSwitchGridRow label="Allow Extra Life When Full:" boolRef={modSettings.allowExtraLifeWhenFull} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Allow Life Gamble Exceed Max:" boolRef={modSettings.allowLifeGambleExceedMax} disabled={!editable}></LabelAndSwitchGridRow>
        <Separator className="col-span-2" />
        <LabelAndSwitchGridRow label="Random Items Per Round:" boolRef={modSettings.randomItemsPerRound} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndNumberGridRow label="Min Items Per Round:" numberRef={modSettings.minItemsPerRound} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndNumberGridRow label="Max Items Per Round:" numberRef={modSettings.maxItemsPerRound} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndNumberGridRow label="Max Items:" numberRef={modSettings.maxItems} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndSwitchGridRow label="Loot Items On Kill:" boolRef={modSettings.lootItemsOnKill} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndNumberGridRow label="Max Loot Items On Kill:" numberRef={modSettings.maxLootItemsOnKill} disabled={!editable}></LabelAndNumberGridRow>
        <LabelAndSwitchGridRow label="Allow Loot Items Exceed Max:" boolRef={modSettings.allowLootItemsExceedMax} disabled={!editable}></LabelAndSwitchGridRow>
        <Separator className="col-span-2" />
        <LabelAndSwitchGridRow label="Enable Reverse Turn Order Item:" boolRef={modSettings.enableReverseTurnOrderItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Rack Chamber Item:" boolRef={modSettings.enableRackChamberItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Extra Life Item:" boolRef={modSettings.enableExtraLifeItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Pickpocket Item:" boolRef={modSettings.enablePickpocketItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Life Gamble Item:" boolRef={modSettings.enableLifeGambleItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Invert Item:" boolRef={modSettings.enableInvertItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Chamber Check Item:" boolRef={modSettings.enableChamberCheckItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Double Damage Item:" boolRef={modSettings.enableDoubleDamageItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Skip Item:" boolRef={modSettings.enableSkipItem} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Enable Ricochet Item:" boolRef={modSettings.enableRicochetItem} disabled={!editable}></LabelAndSwitchGridRow>
        <Separator className="col-span-2" />
        <LabelAndSwitchGridRow label="Allow Life Donation:" boolRef={modSettings.allowLifeDonation} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Allow Player Revival:" boolRef={modSettings.allowPlayerRevival} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Allow Double Damage Stacking:" boolRef={modSettings.allowDoubleDamageStacking} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Allow Sequential Skips:" boolRef={modSettings.allowSequentialSkips} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Allow Self Skip:" boolRef={modSettings.allowSelfSkip} disabled={!editable}></LabelAndSwitchGridRow>
        <Separator className="col-span-2" />
        <LabelAndSwitchGridRow label="Show Ricochets:" boolRef={modSettings.showRicochets} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Show Ricochets Counter:" boolRef={modSettings.showRicochetsCounter} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Disable Deal Reverse When Two Players:" boolRef={modSettings.disableDealReverseWhenTwoPlayers} disabled={!editable}></LabelAndSwitchGridRow>
        <Separator className="col-span-2" />
        <LabelAndSwitchGridRow label="Lose Skip After Round:" boolRef={modSettings.loseSkipAfterRound} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Ricochet Ignore Skipped Players:" boolRef={modSettings.ricochetIgnoreSkippedPlayers} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndNumberGridRow label="Sudden Death Activation Point:" numberRef={modSettings.suddenDeathActivationPoint} disabled={!editable}></LabelAndNumberGridRow>
        <Separator className="col-span-2" />
        <LabelAndSwitchGridRow label="Second Wind:" boolRef={modSettings.secondWind} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Copy Skip On Kill:" boolRef={modSettings.copySkipOnKill} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Allow Looting Dead:" boolRef={modSettings.allowLootingDead} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Refresh Dead Player Items:" boolRef={modSettings.refreshDeadPlayerItems} disabled={!editable}></LabelAndSwitchGridRow>
        <LabelAndSwitchGridRow label="Clear Dead Player Items After Round:" boolRef={modSettings.clearDeadPlayerItemsAfterRound} disabled={!editable}></LabelAndSwitchGridRow>
        <Separator className="col-span-2" />
        {/* <Button className="col-span-2" variant="secondary" onClick={() => setEditLifeGambleWeightsModalOpen(true)} disabled={!editable}>Edit Life Gamble Weights</Button>
                            <Separator className="col-span-2" /> */}
    </div>;
}