import UseTargetedItem from "~/components/UseItem/UseTargetedItem";


type UseExtraLifeArgs = {
    playerUsernamesSelfFirst: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UseExtraLife({ playerUsernamesSelfFirst, targetUsername, setTargetUsername }: UseExtraLifeArgs) {
    return <UseTargetedItem keySuffix="_useItemSelectLifeTarget" usernames={playerUsernamesSelfFirst} targetUsername={targetUsername} setTargetUsername={setTargetUsername} />;    
}
