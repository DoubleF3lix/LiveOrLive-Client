import UseTargetedItem from "~/components/UseItem/UseTargetedItem";


type UsePocketPistolArgs = {
    otherLivingPlayerUsernames: string[];
    targetUsername: string;
    setTargetUsername: (value: string) => void;
};

export default function UsePocketPistol({ otherLivingPlayerUsernames, targetUsername, setTargetUsername }: UsePocketPistolArgs) {
    return <UseTargetedItem keySuffix="_useItemSelectPocketPistolTarget" usernames={otherLivingPlayerUsernames} targetUsername={targetUsername} setTargetUsername={setTargetUsername} />;    
}
