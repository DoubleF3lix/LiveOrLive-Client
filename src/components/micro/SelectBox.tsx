import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/select";


type SelectBoxArgs = {
    label: string;
    optionsHeader: string;
    placeholder: string;
    children: React.ReactNode;
    onValueChange: (value: string) => void;
    defaultValue?: string;
};

export default function SelectBox({ label, optionsHeader, placeholder, children, onValueChange, defaultValue }: SelectBoxArgs) {
    return [
        <label className="shrink" htmlFor={label} key={`${label}-selectedBoxLabel`}>{label}</label>,
        <Select onValueChange={onValueChange} defaultValue={defaultValue} key={`${label}-selectedBoxSelect`}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectContent className="w-full">
                <SelectGroup>
                    <SelectLabel>{optionsHeader}</SelectLabel>
                    {children}
                </SelectGroup>
            </SelectContent>
        </Select>
    ];
}
