import { useState } from "react";


type LabelAndNumberGridRowArgs = {
    label: string;
    numberRef: React.MutableRefObject<number>;
    disabled?: boolean;
};

export default function LabelAndNumberGridRow({ label, numberRef, disabled = false }: LabelAndNumberGridRowArgs) {
    const [number, setNumber] = useState<number>(numberRef.current); 

    return [
        <label key={`${label}_label`} htmlFor={label} className="content-center mr-2">{label}</label>,
        <input disabled={disabled} key={`${label}_input`} size={2} type="number" value={number} onChange={e => { setNumber(e.currentTarget.valueAsNumber); numberRef.current = e.currentTarget.valueAsNumber; }} className="border-2 border-input rounded-lg px-1 text-center" /> 
    ];  
}