import { ReactNode } from "react";
import PopupButtonStyleType from "~/types/PopupButtonStyleType";


type StyledButtonArgs = {
    style?: PopupButtonStyleType,
    className?: string,
    onClick?: () => void,
    key?: string,
    children?: ReactNode
};

export default function StyledButton({ style, className, onClick, key, children }: StyledButtonArgs) {
    function getColorForStyle(style: PopupButtonStyleType | undefined): string {
        return {
            "default": "bg-gray-600",
            "green": "bg-green-500",
            "red": "bg-red-600"
        }[style ?? "default"];
    }

    return <button key={key} onClick={onClick} className={`${getColorForStyle(style)} px-2 mx-0.5 text-white rounded h-8 flex-grow ${className}`}>{children}</button>
}