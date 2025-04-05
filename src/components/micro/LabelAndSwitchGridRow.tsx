import { useState } from "react";
import { Switch } from "@/switch";


type LabelAndSwitchGridRowArgs = {
    label: string;
    boolRef: React.MutableRefObject<boolean>
};

export default function LabelAndTextInputGridRow({ label, boolRef }: LabelAndSwitchGridRowArgs) {
    const [checked, setChecked] = useState<boolean>(boolRef.current); 

    return [
        <label key={`${label}_label`} htmlFor={label} className="content-center mr-2">{label}</label>,
        <Switch key={`${label}_switch`} id={label} checked={checked} onCheckedChange={checked => { setChecked(checked); boolRef.current = checked; }}/>
    ];
}