import UseTargetedItem from "~/components/UseItem/UseTargetedItem";


type UseSkipArgs = {
    usernames: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UseSkip({ usernames, targetUsername, setTargetUsername }: UseSkipArgs) {
    return <UseTargetedItem keySuffix="_useItemSelectSkipTarget" usernames={usernames} targetUsername={targetUsername} setTargetUsername={setTargetUsername} />;    
}