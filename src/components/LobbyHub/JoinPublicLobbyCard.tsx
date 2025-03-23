import { useRef } from "react";
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
import LabelAndTextInputGridRow from "../micro/LabelAndTextInputGridRow";


type JoinPubicLobbyCardArgs = {
    validateAndSetConnectionInfo: (lobbyId: string, username: string) => void;
};

export default function JoinPublicLobbyCard({ validateAndSetConnectionInfo }: JoinPubicLobbyCardArgs) {
    const selectedLobbyId = useRef<string>("");
    const username = useRef<string>("");

    return <>
        <Card>
            <CardHeader>
                <CardTitle>Join a Public Lobby</CardTitle>
                <CardDescription>Click on a lobby below to join</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 mt-[-6px]">
                    <LobbySelector selectedLobbyIdRef={selectedLobbyId} className="col-span-1 mx-[-24px] md:overflow-auto" />
                    <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                        <LabelAndTextInputGridRow label="Username:" placeholder="3-20 characters" textInputRef={username} />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => validateAndSetConnectionInfo(selectedLobbyId.current, username.current)} className="font-bold w-full">Join</Button>
            </CardFooter>
        </Card>

    </>;
}