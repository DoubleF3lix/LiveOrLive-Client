import { useEffect, useRef, useState } from "react";
import LobbySelector from "~/components/LobbyHub/LobbySelector";
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
import { RefreshCw } from "lucide-react";
import { toLowercaseKeys } from "~/lib/utils";
import { BASE_URL } from "~/lib/const";
import { LobbyDto } from "~/types/generated/LiveOrLiveServer.Models.Dto";


type JoinPubicLobbyCardArgs = {
    validateAndSetConnectionInfo: (lobbyId: string, username: string) => void;
};

export default function JoinPublicLobbyCard({ validateAndSetConnectionInfo }: JoinPubicLobbyCardArgs) {
    const [lobbies, setLobbies] = useState<LobbyDto[]>([]);
    const selectedLobbyId = useRef<string>("");
    const username = useRef<string>("");

    useEffect(() => {
        getLobbies();
    }, []);

    function getLobbies() {
        fetch(`${BASE_URL}/lobbies`)
            .then(response => response.json())
            .then((lobbies: LobbyDto[]) => setLobbies(lobbies.map(toLowercaseKeys) as LobbyDto[]));
    }

    return <>
        <Card>
            <CardHeader>
                <div className="flex justify-between">
                    <div className="flex flex-col">
                        <CardTitle className="pb-1.5 pt-0">Join a Public Lobby</CardTitle>
                        <CardDescription className="p-[-1] mb-[-0.5rem]">Click on a lobby below to join</CardDescription>
                    </div>
                    <Button variant="secondary" onClick={getLobbies}>Refresh<RefreshCw /></Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 mt-[-6px]">
                    <LobbySelector selectedLobbyIdRef={selectedLobbyId} lobbies={lobbies} className="col-span-1 mx-[-24px] md:overflow-auto" />
                    <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                        <LabelAndTextInputGridRow label="Username:" placeholder="2-20 characters" textInputRef={username} />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => validateAndSetConnectionInfo(selectedLobbyId.current, username.current)} className="font-bold w-full">Join</Button>
            </CardFooter>
        </Card>
    </>;
}