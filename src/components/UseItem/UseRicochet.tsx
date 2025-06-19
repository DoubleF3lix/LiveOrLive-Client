import UseTargetedItem from "~/components/UseItem/UseTargetedItem";


type UseRicochetArgs = {
    playerUsernamesSelfFirst: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UseRicochet({ playerUsernamesSelfFirst, targetUsername, setTargetUsername }: UseRicochetArgs) {
    return <UseTargetedItem keySuffix="_useItemSelectRicochetTarget" usernames={playerUsernamesSelfFirst} targetUsername={targetUsername} setTargetUsername={setTargetUsername} />;    
}
