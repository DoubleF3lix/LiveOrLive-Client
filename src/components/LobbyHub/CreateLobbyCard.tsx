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
import { BASE_URL } from "~/lib/const";
import { toLowercaseKeys } from "~/lib/utils";
import { Settings } from "~/types/generated/liveorlive_server";
import { SettingsRefs } from "~/types/SettingsRefs";
import EditLifeGambleWeightsModal from "./EditLifeGambleWeightsModal";
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
    const [lifeGambleWeights, setLifeGambleWeights] = useState<Partial<Record<number, number>>>({ 2: 1, [-1]: 1 });
    const settings: SettingsRefs = {
        private: useRef<boolean>(false),
        maxPlayers: useRef<number>(0),
        minBlankRounds: useRef<number>(0),
        minLiveRounds: useRef<number>(0),
        maxBlankRounds: useRef<number>(0),
        maxLiveRounds: useRef<number>(0),
        defaultLives: useRef<number>(0),
        maxLives: useRef<number>(0),
        allowExtraLifeWhenFull: useRef<boolean>(false),
        allowLifeGambleExceedMax: useRef<boolean>(false),
        randomItemsPerRound: useRef<boolean>(false),
        minItemsPerRound: useRef<number>(0),
        maxItemsPerRound: useRef<number>(0),
        maxItems: useRef<number>(0),
        lootItemsOnKill: useRef<boolean>(false),
        maxLootItemsOnKill: useRef<number>(0),
        allowLootItemsExceedMax: useRef<boolean>(false),
        enableReverseTurnOrderItem: useRef<boolean>(false),
        enableRackChamberItem: useRef<boolean>(false),
        enableExtraLifeItem: useRef<boolean>(false),
        enablePickpocketItem: useRef<boolean>(false),
        enableLifeGambleItem: useRef<boolean>(false),
        enableInvertItem: useRef<boolean>(false),
        enableChamberCheckItem: useRef<boolean>(false),
        enableDoubleDamageItem: useRef<boolean>(false),
        enableSkipItem: useRef<boolean>(false),
        enableRicochetItem: useRef<boolean>(false),
        allowLifeDonation: useRef<boolean>(false),
        allowPlayerRevival: useRef<boolean>(false),
        allowDoubleDamageStacking: useRef<boolean>(false),
        allowSequentialSkips: useRef<boolean>(false),
        allowSelfSkip: useRef<boolean>(false),
        showRicochets: useRef<boolean>(false),
        showRicochetsCounter: useRef<boolean>(false),
        disableDealReverseWhenTwoPlayers: useRef<boolean>(false),
        loseSkipAfterRound: useRef<boolean>(false),
        ricochetIgnoreSkippedPlayers: useRef<boolean>(false),
        suddenDeathActivationPoint: useRef<number>(0),
        secondWind: useRef<boolean>(false),
        copySkipOnKill: useRef<boolean>(false),
        allowLootingDead: useRef<boolean>(false),
        refreshDeadPlayerItems: useRef<boolean>(false),
        clearDeadPlayerItemsAfterRound: useRef<boolean>(false),
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