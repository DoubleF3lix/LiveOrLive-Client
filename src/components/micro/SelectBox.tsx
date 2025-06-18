import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/select";


type SelectBoxArgs = {
    label: string;
    placeholder: string;
    children: React.ReactNode;
    onValueChange: (value: string) => void;
    defaultValue?: string;
};

export default function SelectBox({ label, placeholder, children, onValueChange, defaultValue }: SelectBoxArgs) {
    return <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder}/>
        </SelectTrigger>
        <SelectContent className="w-full">
            <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {children}
            </SelectGroup>
        </SelectContent>
    </Select>;
}
