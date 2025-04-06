import { ReactNode } from "react";


type IconButtonArgs = {
    onClick: () => void;
    className?: string;
    children?: ReactNode;
    overrideSpacing?: boolean;
};

export default function IconButton({ onClick, className, children, overrideSpacing}: IconButtonArgs) {
    // Because icons inside <Button/> does NOT play nice with spacing...
    return <div onClick={onClick} className={`${className} ${!overrideSpacing && "p-1 mb-0 -m-1"} hover:bg-accent/99 rounded-lg`}>
        {children}
    </div>;
}