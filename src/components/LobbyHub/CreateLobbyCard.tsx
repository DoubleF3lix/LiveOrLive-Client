import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/card"
import { Button } from "@/button";
import LabelAndTextInputGridRow from "~/components/micro/LabelAndTextInputGridRow";
import React, { useEffect, useRef, useState } from "react";
import { Separator } from "@/separator";
import { BASE_URL } from "~/lib/const";
import LabelAndSwitchGridRow from "~/components/micro/LabelAndSwitchGridRow";
import { SettingsRefs, SettingsRefsWithSeparators } from "~/types/SettingsRefs";
import LabelAndNumberGridRow from "~/components/micro/LabelAndNumberGridRow";
import { fromCamelCase, toLowercaseKeys } from "~/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/collapsible"
import { ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Settings } from "~/types/generated/liveorlive_server";


type CreateLobbyCardArgs = {
    validateAndSetConnectionInfo: (lobbyId: string, username: string) => void;
};

export default function CreateLobbyCard({ validateAndSetConnectionInfo }: CreateLobbyCardArgs) {
    const username = useRef<string>("");
    const lobbyName = useRef<string>("");

    const [settingsInitialized, setSettingsInitialized] = useState<boolean>(false);

    function createLobby() {
        const filteredSettings = Object.keys(settings).reduce((out: {[key: string]: boolean | number}, current: string) => {
            if (!current.startsWith("sep")) {
                out[current] = (settings as SettingsRefs)[current as keyof Settings].current;
            }
            return out;
        }, {} as {[key: string]: boolean | number}); 

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

        fetch(`${BASE_URL}/lobbies`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username.current,
                lobbyName: lobbyName.current,
                settings: filteredSettings
            })
        }).then(async response => {
            if (response.status === 200) {
                const data: {lobbyId: string} = await response.json();
                validateAndSetConnectionInfo(data.lobbyId, username.current);
            }
        });
    }

    const settings: SettingsRefsWithSeparators = {
        private: useRef<boolean>(false),
        maxPlayers: useRef<number>(0),
        sepChamber: null,
        minBlankRounds: useRef<number>(0),
        minLiveRounds: useRef<number>(0),
        maxBlankRounds: useRef<number>(0),
        maxLiveRounds: useRef<number>(0),
        sepLives: null,
        defaultLives: useRef<number>(0),
        maxLives: useRef<number>(0),
        sepItemDist: null,
        randomItemsPerRound: useRef<boolean>(false),
        minItemsPerRound: useRef<number>(0),
        maxItemsPerRound: useRef<number>(0),
        maxItems: useRef<number>(0),
        sepItemEnable: null,
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
        sepGameplay: null,
        allowLifeDonation: useRef<boolean>(false),
        allowPlayerRevival: useRef<boolean>(false),
        allowDoubleDamageStacking: useRef<boolean>(false),
        allowSequentialSkips: useRef<boolean>(false),
        allowExtraLifeWhenFull: useRef<boolean>(false),
        allowLifeGambleExceedMax: useRef<boolean>(false),
        allowSelfSkip: useRef<boolean>(false),
        ricochetIgnoreSkippedPlayers: useRef<boolean>(false),
        loseSkipAfterRound: useRef<boolean>(false),
        copySkipOnKill: useRef<boolean>(false),
        lootItemsOnKill: useRef<boolean>(false),
        maxLootItemsOnKill: useRef<number>(0),
        allowLootItemsExceedMax: useRef<boolean>(false)
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
                        {settingsInitialized && <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                            {Object.keys(settings).map((settingsKey: string) => {
                                if (settingsKey.startsWith("sep")) {
                                    return <Separator key={settingsKey} className="col-span-2" />;
                                }
                                const castedSettingsKey = settingsKey as keyof SettingsRefs;
                                const configType = settings[castedSettingsKey] as React.MutableRefObject<boolean | number>;
                                switch (typeof configType.current) {
                                    case "boolean":
                                        return <LabelAndSwitchGridRow key={settingsKey} label={`${fromCamelCase(settingsKey)}:`} boolRef={settings[castedSettingsKey] as React.MutableRefObject<boolean>} />;
                                    case "number":
                                        return <LabelAndNumberGridRow key={settingsKey} label={`${fromCamelCase(settingsKey)}:`} numberRef={settings[castedSettingsKey] as React.MutableRefObject<number>} />;
                                }
                            })}
                        </div>}
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
            <CardFooter>
                <Button onClick={createLobby} className="font-bold w-full">Create</Button>
            </CardFooter>
        </Card>
    </>;
}