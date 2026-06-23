import UseTargetedItem from "~/components/UseItem/UseTargetedItem";


type UsePocketPistolArgs = {
    usernames: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UsePocketPistol({ usernames, targetUsername, setTargetUsername }: UsePocketPistolArgs) {
    return <UseTargetedItem keySuffix="_useItemSelectPocketPistolTarget" usernames={usernames} targetUsername={targetUsername} setTargetUsername={setTargetUsername} />;    
}
