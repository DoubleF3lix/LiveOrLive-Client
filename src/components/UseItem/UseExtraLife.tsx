import UseTargetedItem from "~/components/UseItem/UseTargetedItem";


type UseExtraLifeArgs = {
    usernames: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UseExtraLife({ usernames, targetUsername, setTargetUsername }: UseExtraLifeArgs) {
    return <UseTargetedItem keySuffix="_useItemSelectLifeTarget" usernames={usernames} targetUsername={targetUsername} setTargetUsername={setTargetUsername} />;    
}
