import { useContext, useState } from "react";
import { ServerConnection } from "~/lib/ServerConnection";
import { ServerConnectionContext } from "~/store/ServerConnectionContext";
import { IRootState, useAppDispatch } from "~/store/Store";
import { useSelector } from "react-redux";
import { condenseItemList, moveToFrontOfArray } from "~/lib/utils";
import SelectBox from "./micro/SelectBox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/dialog";
import { Button } from "@/button";
import { SelectItem } from "@/select";
import { Item } from "~/types/generated/liveorlive_server.Enums";


type UseItemDialogArgs = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function UseItemDialog({ open, setOpen }: UseItemDialogArgs) {
    const serverConnection = useContext(ServerConnectionContext) as ServerConnection;
    const dispatch = useAppDispatch();

    const clientUsername = useSelector((state: IRootState) => state.selfDataReducer.username);
    const playerItems = useSelector((state: IRootState) => state.lobbyDataReducer.players.find(player => player.username === clientUsername)?.items);
    const condensedPlayerItems = condenseItemList(playerItems ?? []);

    const players = useSelector((state: IRootState) => state.lobbyDataReducer.players);
    const nonSpectatorPlayers = players.filter(player => !player.isSpectator);
    const nonSpectatorPlayersUsernames = nonSpectatorPlayers.map(player => player.username);
    const nonSpectatorPlayersUsernamesSelfFirst = moveToFrontOfArray(nonSpectatorPlayersUsernames, clientUsername);
    const otherPlayers = nonSpectatorPlayers.filter(player => player.username !== clientUsername);

    const [selectedItem, setSelectedItem] = useState<number>(-1);
    const [targetPlayerUsername, setTargetPlayerUsername] = useState<string>("");

    function close() {
        setSelectedItem(-1);
        setOpen(false);
    }

    function setSelectedItemCast(value: string) {
        setSelectedItem(parseInt(value));
    }

    return playerItems && <Dialog open={open}>
        <DialogContent onInteractOutside={close} onCloseButtonClick={close}>
            <DialogHeader>
                <DialogTitle>Use Item</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center lg:gap-x-8">
                <label>Item:</label>
                <SelectBox label="Items" placeholder="Select an item" onValueChange={setSelectedItemCast}>
                    {condensedPlayerItems.map(item => <SelectItem key={item.id + "useItemSelectItem"} value={item.id.toString()}>{item.displayString}</SelectItem>)}
                </SelectBox>

                {/* Move preset select boxes to components, include labels */}
                {selectedItem === Item.ExtraLife && <>
                    <label>Use On:</label>
                    <SelectBox label="Targets" placeholder="Select a target" onValueChange={setTargetPlayerUsername} defaultValue={clientUsername}>
                        {nonSpectatorPlayersUsernamesSelfFirst.map(playerUsername => <SelectItem key={playerUsername + "useItemSelectLifeTarget"} value={playerUsername}>
                            {playerUsername === clientUsername ? "Yourself" : playerUsername}
                        </SelectItem>)} 
                    </SelectBox>
                </>}

                {selectedItem === Item.Pickpocket && <>
                    <label>Steal From:</label>
                    <SelectBox label="Targets" placeholder="Select a target" onValueChange={setTargetPlayerUsername} defaultValue={clientUsername}>
                        {nonSpectatorPlayersUsernamesSelfFirst.map(playerUsername => <SelectItem key={playerUsername + "useItemSelectLifeTarget"} value={playerUsername}>
                            {playerUsername === clientUsername ? "Yourself" : playerUsername}
                        </SelectItem>)} 
                    </SelectBox>

                    <label>Steal Item:</label>
                    <SelectBox label="Targets" placeholder="Select an item to steal" onValueChange={setTargetPlayerUsername} defaultValue={clientUsername}>
                        {nonSpectatorPlayersUsernamesSelfFirst.map(playerUsername => <SelectItem key={playerUsername + "useItemSelectLifeTarget"} value={playerUsername}>
                            {playerUsername === clientUsername ? "Yourself" : playerUsername}
                        </SelectItem>)} 
                    </SelectBox>

                    <label>Use Item On:</label>
                    <SelectBox label="Targets" placeholder="Select another target" onValueChange={setTargetPlayerUsername} defaultValue={clientUsername}>
                        {nonSpectatorPlayersUsernamesSelfFirst.map(playerUsername => <SelectItem key={playerUsername + "useItemSelectLifeTarget"} value={playerUsername}>
                            {playerUsername === clientUsername ? "Yourself" : playerUsername}
                        </SelectItem>)} 
                    </SelectBox>
                </>}
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={close}>Cancel</Button>
                <Button onClick={close}>Use</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>;
}