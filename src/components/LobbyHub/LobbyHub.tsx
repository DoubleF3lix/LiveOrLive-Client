import { BASE_URL } from "~/lib/const";
import { toast, Toaster } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/tabs";
import CreateLobbyCard from "~/components/LobbyHub/CreateLobbyCard";
import JoinPublicLobbyCard from "~/components/LobbyHub/JoinPublicLobbyCard";
import JoinPrivateLobby from "~/components/LobbyHub/JoinPrivateLobbyCard";


type LobbySelectorArgs = {
    setLobbyConnectionInfo: (connectionInfo: string[]) => void;
}

export default function LobbyHub({ setLobbyConnectionInfo: setLobbyConnectionInfo }: LobbySelectorArgs) {
    function validateAndSetConnectionInfo(lobbyId: string, username: string, lobbyIdManuallyEntered: boolean = false) {
        if (lobbyId === "") {
            toast.error(lobbyIdManuallyEntered ? "Please enter a lobby code" : "Please select a lobby");
            return;
        }
        if (username === "") {
            toast.error("Please enter a username");
            return;
        }
        if (username.length > 20) {
            toast.error("Username must be less than 20 characters");
            return;
        }
        if (username.length < 3) {
            toast.error("Username must be at least 3 characters");
            return;
        }

        fetch(`${BASE_URL}/verify-lobby-connection-info?lobbyId=${lobbyId}&username=${username}`)
            .then(async response => {
                if (response.status === 200) {
                    setLobbyConnectionInfo([lobbyId, username]);
                } else {
                    const reason = await response.text();
                    toast.error(reason.substring(1, reason.length - 1));
                }
            });
    }

    return <>
        <div className="flex flex-col justify-center items-center h-screen m-auto mb-auto">
            <h1 className="font-bold text-center text-4xl mb-4 mt-[-2dvh] md:mb-8 ">Live or Live</h1>
            <Tabs defaultValue="joinPublic" className="min-w-[40dvw] max-w-[96dvw] max-h-[70dvh] w-[96dvw] xl:w-min"> 
                <TabsList className="w-full">
                    <TabsTrigger value="joinPublic">Join Public</TabsTrigger>
                    <TabsTrigger value="joinPrivate">Join Private</TabsTrigger>
                    <TabsTrigger value="create">Create</TabsTrigger>
                </TabsList>
                <TabsContent value="joinPublic">
                    <JoinPublicLobbyCard validateAndSetConnectionInfo={validateAndSetConnectionInfo} />
                </TabsContent>
                <TabsContent value="joinPrivate">
                    <JoinPrivateLobby validateAndSetConnectionInfo={validateAndSetConnectionInfo} />
                </TabsContent>
                <TabsContent value="create">
                    <CreateLobbyCard validateAndSetConnectionInfo={validateAndSetConnectionInfo} />
                </TabsContent>
            </Tabs>
        </div>
        <Toaster duration={5000} visibleToasts={1} richColors />
    </>;
}
