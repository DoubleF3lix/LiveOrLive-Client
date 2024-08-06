import { useEffect, useRef,  } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/Store";


type GameLogArgs = {
    visible: boolean
};


export default function ChatBox({ visible }: GameLogArgs) {
    const gameLog = useSelector((state: IRootState) => (state.gameDataReducer.gameLog));
    const endOfMessages = useRef<HTMLDivElement>(null);

    // Always move to the bottom
    useEffect(() => {
        endOfMessages.current?.scrollIntoView({behavior: "instant"});
    }, [gameLog]);

    return (
        visible ? <>
            <br className="mt-1 lg:mt-4"/>
            <div className="-space-y-0 overflow-y-auto break-words text-sm lg:text-base lg:h-screen ">
                {gameLog.map((message, index) => <p key={index}>{message}</p>)}
                <div ref={endOfMessages} id="EOMMarker"></div>
            </div>  
            <br className="mt-1 lg:mt-4"/>
            <div className="flex-grow"></div>
        </> : <></>
    );
}
