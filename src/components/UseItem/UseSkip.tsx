import UseTargetedItem from "~/components/UseItem/UseTargetedItem";


type UseSkipArgs = {
    playerUsernamesSelfLast: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UseSkip({ playerUsernamesSelfLast, targetUsername, setTargetUsername }: UseSkipArgs) {
    return <UseTargetedItem keySuffix="_useItemSelectSkipTarget" usernames={playerUsernamesSelfLast} targetUsername={targetUsername} setTargetUsername={setTargetUsername} />;    
}