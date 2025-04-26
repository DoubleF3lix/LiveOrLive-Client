
import { useState } from "react";
import { Switch } from "@/switch";


type LabelAndSwitchGridRowArgs = {
    label: string;
    boolRef: React.MutableRefObject<boolean>;
    disabled?: boolean;
};

export default function LabelAndSwitchGridRow({ label, boolRef, disabled = false }: LabelAndSwitchGridRowArgs) {
    const [checked, setChecked] = useState<boolean>(boolRef.current); 

    return [
        <label key={`${label}_label`} htmlFor={label} className="content-center mr-2">{label}</label>,
        <Switch disabled={disabled}key={`${label}_switch`} id={label} checked={checked} onCheckedChange={checked => { setChecked(checked); boolRef.current = checked; }} className="mx-auto my-1"/>
    ];
}