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
import React, { useRef } from "react";
import { Separator } from "@/separator";
import { BASE_URL } from "~/lib/const";
import LabelAndSwitchGridRow from "~/components/micro/LabelAndSwitchGridRow";
import { ConfigRefs, ConfigRefsWithSeparators } from "~/types/ConfigRefs";
import LabelAndNumberGridRow from "~/components/micro/LabelAndNumberGridRow";
import { toCamelCase } from "~/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/collapsible"
import { ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Config } from "~/types/generated/liveorlive_server";


type CreateLobbyCardArgs = {
    validateAndSetConnectionInfo: (lobbyId: string, username: string) => void;
};

export default function CreateLobbyCard({ validateAndSetConnectionInfo }: CreateLobbyCardArgs) {
    const username = useRef<string>("");
    const lobbyName = useRef<string>("");

    const config: ConfigRefsWithSeparators = {
        // Game
        private: useRef<boolean>(false),
        maxPlayers: useRef<number>(8),

        sep1: null,
        // Lives
        defaultLives: useRef<number>(3),
        maxLives: useRef<number>(3),

        sep2: null,
        // Items
        randomItemsPerRound: useRef<boolean>(false),
        minItemsPerRound: useRef<number>(3),
        maxItemsPerRound: useRef<number>(3),
        maxItems: useRef<number>(4),

        sep3: null,
        // Chamber
        minBlankRounds: useRef<number>(1),
        minLiveRounds: useRef<number>(1),
        maxBlankRounds: useRef<number>(4),
        maxLiveRounds: useRef<number>(4),

        sep4: null,
        // Item use
        allowLifeDonation: useRef<boolean>(true),
        allowPlayerRevival: useRef<boolean>(true),
        allowDoubleDamageStacking: useRef<boolean>(false),
        allowDoubleSkips: useRef<boolean>(false),
        allowExtraLifeWhenFull: useRef<boolean>(false),
        allowSelfSkip: useRef<boolean>(false),

        sep5: null,
        // Events
        loseSkipAfterRound: useRef<boolean>(true),
        lootItemsOnKill: useRef<boolean>(false),
        copySkipOnKill: useRef<boolean>(true)
    };

    function createLobby() {
        const filteredConfig = Object.keys(config).reduce((out: {[key: string]: boolean | number}, current: string) => {
            if (!current.startsWith("sep")) {
                out[current] = (config as ConfigRefs)[current as keyof Config].current;
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

        fetch(`${BASE_URL}/lobbies?username=${username.current}&name=${lobbyName.current}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username.current,
                config: filteredConfig
            })
        }).then(async response => {
            if (response.status === 200) {
                const data: {lobbyId: string} = await response.json();
                validateAndSetConnectionInfo(data.lobbyId, username.current);
            }
        });
    }

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
                        <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                            {Object.keys(config).map((configKey: string) => {
                                if (configKey.startsWith("sep")) {
                                    return <Separator key={configKey} className="col-span-2" />;
                                }
                                const castedConfigKey = configKey as keyof ConfigRefs;
                                const configType = config[castedConfigKey] as React.MutableRefObject<boolean | number>;
                                switch (typeof configType.current) {
                                    case "boolean":
                                        return <LabelAndSwitchGridRow key={configKey} label={`${toCamelCase(configKey).replace("Enable ", "")}:`} boolRef={config[castedConfigKey] as React.MutableRefObject<boolean>} />;
                                    case "number":
                                        return <LabelAndNumberGridRow key={configKey} label={`${toCamelCase(configKey)}:`} numberRef={config[castedConfigKey] as React.MutableRefObject<number>} />;
                                }
                            })}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
            <CardFooter>
                <Button onClick={createLobby} className="font-bold w-full">Create</Button>
            </CardFooter>
        </Card>
    </>;
}