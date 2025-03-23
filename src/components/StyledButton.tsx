import { ReactNode } from "react";
import PopupButtonStyleType from "~/types/PopupButtonStyleType";


type StyledButtonArgs = {
    style?: PopupButtonStyleType,
    className?: string,
    onClick?: () => void,
    key?: string,
    disabled?: boolean,
    children?: ReactNode
};

export default function StyledButton({ style, className, onClick, key, disabled, children }: StyledButtonArgs) {
    function getColorForStyle(style: PopupButtonStyleType | undefined): string {
        return {
            "default": "bg-gray-600",
            "green": "bg-green-500",
            "red": "bg-red-600"
        }[style ?? "default"];
    }

    return <button id={key} onClick={onClick} disabled={disabled} className={`${getColorForStyle(style)} px-2 mx-0.5 text-white rounded-sm h-8 grow disabled:bg-opacity-50 ${className}`}>{children}</button>
}