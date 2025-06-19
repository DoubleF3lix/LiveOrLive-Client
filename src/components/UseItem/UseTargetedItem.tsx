import { useEffect } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/Store";
import SelectBox from "~/components/micro/SelectBox";
import { SelectItem } from "@/select";


type UseTargetedItemArgs = {
    keySuffix: string;
    usernames: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UseTargetedItem({ keySuffix, usernames, targetUsername, setTargetUsername }: UseTargetedItemArgs) {
    const selfUsername = useSelector((state: IRootState) => state.selfDataReducer.username);

    useEffect(() => {
        if (usernames.length > 0 && !targetUsername) {
            setTargetUsername(usernames[0]);
        }
    }, [usernames, setTargetUsername, targetUsername]);

    return <SelectBox label="Use On:" optionsHeader="Targets" placeholder="Select a target" onValueChange={setTargetUsername} defaultValue={usernames[0]}> 
        {usernames.map(playerUsername => <SelectItem key={playerUsername + keySuffix} value={playerUsername}>
            {playerUsername === selfUsername ? "Yourself" : playerUsername}
        </SelectItem>)}
    </SelectBox>;
}