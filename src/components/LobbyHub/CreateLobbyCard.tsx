import { Button } from "@/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LabelAndTextInputGridRow from "~/components/micro/LabelAndTextInputGridRow";
import { BASE_URL, DEFAULT_SETTINGS } from "~/lib/const";
import { toLowercaseKeys } from "~/lib/utils";
import { Settings } from "~/types/generated/liveorlive_server.Models";
import { SettingsRefs } from "~/types/SettingsRefs";
import EditLifeGambleWeightsModal from "~/components/LobbyHub/EditLifeGambleWeightsModal";
import SettingsDisplay from "~/components/SettingsDisplay";


type CreateLobbyCardArgs = {
    validateAndSetConnectionInfo: (lobbyId: string, username: string) => void;
};

export default function CreateLobbyCard({ validateAndSetConnectionInfo }: CreateLobbyCardArgs) {
    const username = useRef<string>("");
    const lobbyName = useRef<string>("");

    const [settingsInitialized, setSettingsInitialized] = useState<boolean>(false);

    function createLobby() {
        if (username.current === "") {
            toast.error("Please enter a username");
            return;
        }
        if (username.current.length > 20) {
            toast.error("Username must be less than 20 characters");
            return;
        }
        if (username.current.length < 2) {
            toast.error("Username must be at least 2 characters");
            return;
        }

        const convertedSettings: Settings = Object.fromEntries(
            Object.entries(settings).map(([key, ref]) => [key, ref.current])
        ) as Settings;

        fetch(`${BASE_URL}/lobbies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username.current,
                lobbyName: lobbyName.current,
                settings: convertedSettings
            })
        }).then(async response => {
            if (response.status === 200) {
                const data: { lobbyId: string } = await response.json();
                validateAndSetConnectionInfo(data.lobbyId, username.current);
            }
        });
    }

    const [editLifeGambleWeightsModalOpen, setEditLifeGambleWeightsModalOpen] = useState<boolean>(false);
    const [lifeGambleWeights, setLifeGambleWeights] = useState<Partial<Record<number, number>>>(DEFAULT_SETTINGS.lifeGambleWeights);
    const settings: SettingsRefs = {
        private: useRef<boolean>(DEFAULT_SETTINGS.private),
        maxPlayers: useRef<number>(DEFAULT_SETTINGS.maxPlayers),
        minBlankRounds: useRef<number>(DEFAULT_SETTINGS.minBlankRounds),
        minLiveRounds: useRef<number>(DEFAULT_SETTINGS.minLiveRounds),
        maxBlankRounds: useRef<number>(DEFAULT_SETTINGS.maxBlankRounds),
        maxLiveRounds: useRef<number>(DEFAULT_SETTINGS.maxLiveRounds),
        showFiredRoundsTally: useRef<boolean>(DEFAULT_SETTINGS.showFiredRoundsTally),
        defaultLives: useRef<number>(DEFAULT_SETTINGS.defaultLives),
        maxLives: useRef<number>(DEFAULT_SETTINGS.maxLives),
        allowExtraLifeWhenFull: useRef<boolean>(DEFAULT_SETTINGS.allowExtraLifeWhenFull),
        allowLifeGambleExceedMax: useRef<boolean>(DEFAULT_SETTINGS.allowLifeGambleExceedMax),
        randomItemsPerRound: useRef<boolean>(DEFAULT_SETTINGS.randomItemsPerRound),
        minItemsPerRound: useRef<number>(DEFAULT_SETTINGS.minItemsPerRound),
        maxItemsPerRound: useRef<number>(DEFAULT_SETTINGS.maxItemsPerRound),
        maxItems: useRef<number>(DEFAULT_SETTINGS.maxItems),
        lootItemsOnKill: useRef<boolean>(DEFAULT_SETTINGS.lootItemsOnKill),
        maxLootItemsOnKill: useRef<number>(DEFAULT_SETTINGS.maxLootItemsOnKill),
        allowLootItemsExceedMax: useRef<boolean>(DEFAULT_SETTINGS.allowLootItemsExceedMax),
        enableReverseTurnOrderItem: useRef<boolean>(DEFAULT_SETTINGS.enableReverseTurnOrderItem),
        enableRackChamberItem: useRef<boolean>(DEFAULT_SETTINGS.enableRackChamberItem),
        enableExtraLifeItem: useRef<boolean>(DEFAULT_SETTINGS.enableExtraLifeItem),
        enablePickpocketItem: useRef<boolean>(DEFAULT_SETTINGS.enablePickpocketItem),
        enableLifeGambleItem: useRef<boolean>(DEFAULT_SETTINGS.enableLifeGambleItem),
        enableInvertItem: useRef<boolean>(DEFAULT_SETTINGS.enableInvertItem),
        enableChamberCheckItem: useRef<boolean>(DEFAULT_SETTINGS.enableChamberCheckItem),
        enableDoubleDamageItem: useRef<boolean>(DEFAULT_SETTINGS.enableDoubleDamageItem),
        enableSkipItem: useRef<boolean>(DEFAULT_SETTINGS.enableSkipItem),
        enableRicochetItem: useRef<boolean>(DEFAULT_SETTINGS.enableRicochetItem),
        enableTrenchcoatItem: useRef<boolean>(DEFAULT_SETTINGS.enableTrenchcoatItem),
        enableMisfireItem: useRef<boolean>(DEFAULT_SETTINGS.enableMisfireItem),
        enableHypnotizeItem: useRef<boolean>(DEFAULT_SETTINGS.enableHypnotizeItem),
        enablePocketPistolItem: useRef<boolean>(DEFAULT_SETTINGS.enablePocketPistolItem),
        allowLifeDonation: useRef<boolean>(DEFAULT_SETTINGS.allowLifeDonation),
        allowPlayerRevival: useRef<boolean>(DEFAULT_SETTINGS.allowPlayerRevival),
        allowDoubleDamageStacking: useRef<boolean>(DEFAULT_SETTINGS.allowDoubleDamageStacking),
        allowSequentialSkips: useRef<boolean>(DEFAULT_SETTINGS.allowSequentialSkips),
        allowSelfSkip: useRef<boolean>(DEFAULT_SETTINGS.allowSelfSkip),
        showRicochets: useRef<boolean>(DEFAULT_SETTINGS.showRicochets),
        showRicochetsCounter: useRef<boolean>(DEFAULT_SETTINGS.showRicochetsCounter),
        disableDealReverseAndRicochetWhenTwoPlayers: useRef<boolean>(DEFAULT_SETTINGS.disableDealReverseAndRicochetWhenTwoPlayers),
        loseSkipAfterRound: useRef<boolean>(DEFAULT_SETTINGS.loseSkipAfterRound),
        ricochetIgnoreSkippedPlayers: useRef<boolean>(DEFAULT_SETTINGS.ricochetIgnoreSkippedPlayers),
        suddenDeathActivationPoint: useRef<number>(DEFAULT_SETTINGS.suddenDeathActivationPoint),
        secondWind: useRef<boolean>(DEFAULT_SETTINGS.secondWind),
        copySkipOnKill: useRef<boolean>(DEFAULT_SETTINGS.copySkipOnKill),
        allowLootingDead: useRef<boolean>(DEFAULT_SETTINGS.allowLootingDead),
        refreshDeadPlayerItems: useRef<boolean>(DEFAULT_SETTINGS.refreshDeadPlayerItems),
        clearDeadPlayerItemsAfterRound: useRef<boolean>(DEFAULT_SETTINGS.clearDeadPlayerItemsAfterRound),
        // Not implemented currently on purpose, need to figure out table stuff
        lifeGambleWeights: { current: lifeGambleWeights }
    };

    useEffect(() => {
        fetch(`${BASE_URL}/default-settings`, {
            method: "GET"
        }).then(async response => {
            if (response.status === 200) {
                const data = toLowercaseKeys(await response.json()) as Settings;
                let key: keyof Settings;
                for (key in data) {
                    const value = data[key];
                    settings[key].current = value;
                }
                setSettingsInitialized(true);
            }
        });
    }, []);

    return <>
        {editLifeGambleWeightsModalOpen && <EditLifeGambleWeightsModal setOpen={setEditLifeGambleWeightsModalOpen} lifeGambleWeights={lifeGambleWeights} setLifeGambleWeights={setLifeGambleWeights} />}
        <Card>
            <CardHeader>
                <CardTitle>Create a Lobby</CardTitle>
                <CardDescription>Once the lobby is created, you'll automatically join it</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[40dvh] overflow-y-auto">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center my-4">
                    <LabelAndTextInputGridRow label="Username:" placeholder="2-20 characters" textInputRef={username} />
                    <LabelAndTextInputGridRow label={`Name:`} placeholder="Optional" textInputRef={lobbyName} />
                </div>
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full">
                            <span>Advanced Settings</span>
                            <ChevronsUpDown />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {settingsInitialized && <SettingsDisplay settings={settings} />}
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
            <CardFooter>
                <Button onClick={createLobby} className="font-bold w-full">Create</Button>
            </CardFooter>
        </Card>
    </>;
}