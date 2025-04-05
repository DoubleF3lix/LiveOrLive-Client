export interface Toast {
    id: string | number;
    type: "achievement" | "normal" | "default";
    title: string;
    description: string;
    button: {
        label: string;
        onClick: () => void;
    };
}