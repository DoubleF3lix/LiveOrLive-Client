import { useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/card"
import { Button } from "@/button";
import LabelAndTextInputGridRow from "~/components/micro/LabelAndTextInputGridRow";
import LabelAndOTPGridRow from "~/components/micro/LabelAndOTPGridRow";


type JoinPrivateLobbyArgs = {
    validateAndSetConnectionInfo: (lobbyId: string, username: string, lobbyIdManuallyEntered: boolean) => void;
};

export default function JoinPrivateLobbyCard({ validateAndSetConnectionInfo }: JoinPrivateLobbyArgs) {
    const lobbyCode = useRef<string>("");
    const username = useRef<string>("");

    return <>
        <Card>
            <CardHeader>
                <CardTitle>Join a Private Lobby</CardTitle>
                <CardDescription>Enter the lobby code to join a private game</CardDescription> 
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                    <LabelAndOTPGridRow label="Lobby Code:" OTPRef={lobbyCode} />
                    <LabelAndTextInputGridRow label="Username:" placeholder="2-20 characters" textInputRef={username} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => validateAndSetConnectionInfo(lobbyCode.current.toUpperCase(), username.current, true)} className="font-bold w-full">Join</Button>
            </CardFooter>
        </Card >
    </>;
}


