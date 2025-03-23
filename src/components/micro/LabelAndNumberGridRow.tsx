import { useState } from "react";


type LabelAndSwitchGridRowArgs = {
    label: string;
    numberRef: React.MutableRefObject<number>;
};

export default function LabelAndTextInputGridRow({ label, numberRef }: LabelAndSwitchGridRowArgs) { 
    const [number, setNumber] = useState<number>(numberRef.current); 

    return [
        <label htmlFor={label} className="content-center mr-2">{label}</label>,
        <input size={1} type="number" value={number} onChange={e => { setNumber(e.currentTarget.valueAsNumber); numberRef.current = e.currentTarget.valueAsNumber; }} className="border-2 border-input rounded-lg p-1 text-center" /> 
    ];  
}