import { MouseEventHandler } from "react";


type MessageBoxControlButtonArgs = {
    text: string,
    underlined: boolean,
    onClickCallback: MouseEventHandler
};


export default function MessageBoxControlButton({ text, underlined, onClickCallback }: MessageBoxControlButtonArgs) {
    return (<>
        <button className="font-bold text-base lg:text-lg" onClick={onClickCallback}>
            {underlined ? <u>{text}</u> : text}
        </button>
    </>);
}