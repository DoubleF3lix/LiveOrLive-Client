import { useState } from "react";


type LabelAndTextInputGridRowArgs = {
    label: string;
    placeholder?: string;
    hideText?: boolean;
    textInputRef: React.MutableRefObject<string>;
};

export default function LabelAndTextInputGridRow({ label, placeholder, hideText, textInputRef }: LabelAndTextInputGridRowArgs) {
    const [textInput, setTextInput] = useState<string>("");

    return [
        <label htmlFor={label} className="content-center mr-2">{label}</label>,
        <input size={1} type={hideText ? "password" : "text"} id={label} value={textInput} onChange={e => { setTextInput(e.currentTarget.value); textInputRef.current = e.currentTarget.value; }} placeholder={placeholder} className="min-w-0 border-2 border-input rounded-lg p-1 pl-2" />
    ];
}