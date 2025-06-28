import { Switch } from "@/switch";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { ServerConnection } from "~/lib/ServerConnection";
import { checkClientIsPlayer } from "~/lib/utils";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState } from "~/store/Store";
import { ClientType } from "~/types/generated/liveorlive_server.Enums";

export default function ClientTypeSwitch() {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const players = useSelector((state: IRootState) => state.lobbyDataReducer.players);
    const spectators = useSelector((state: IRootState) => state.lobbyDataReducer.spectators);
    const client = players.find(player => player.username === clientUsername) ?? spectators.find(spectator => spectator.username === clientUsername);
    const clientIsPlayer = client !== undefined ? checkClientIsPlayer(client) : false;

    const [isChecked, setIsChecked] = useState<boolean>(clientIsPlayer);

    function onCheckedChange(checked: boolean) {
        setIsChecked(checked);
        serverConnection.changeClientType(checked ? ClientType.Player : ClientType.Spectator);
    }

    return <div className="flex gap-2 left-0 bottom-0 absolute mb-4 ml-4">
        <p className={clientIsPlayer ? "" : "font-semibold"}>Spectator</p>
        <Switch checked={isChecked} onCheckedChange={onCheckedChange} className="mx-auto my-1" />
        <p className={clientIsPlayer ? "font-semibold" : ""}>Player</p>
    </div>
}