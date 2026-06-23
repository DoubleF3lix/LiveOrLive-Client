import UseTargetedItem from "~/components/UseItem/UseTargetedItem";


type UseRicochetArgs = {
    usernames: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UseRicochet({ usernames, targetUsername, setTargetUsername }: UseRicochetArgs) {
    return <UseTargetedItem keySuffix="_useItemSelectRicochetTarget" usernames={usernames} targetUsername={targetUsername} setTargetUsername={setTargetUsername} />;    
}
