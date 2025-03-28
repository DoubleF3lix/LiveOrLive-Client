import { ChatMessage as ChatMessageType } from "~/types/generated/liveorlive_server";

type ChatMessageArgs = {
    message: ChatMessageType;
    isNewAuthorChain: boolean; 
};

function timestampToFormatString(timestamp: number): string {
    // Turns it into 9:22 PM
    return new Date(timestamp * 1000).toLocaleTimeString(undefined, {hour12: true, hour: "numeric", minute: "2-digit"});
}


function ChatMessageTimestamp({timestamp}: {timestamp: number}) {
    return <span className="text-xs text-muted-foreground">({timestampToFormatString(timestamp)})</span>;
}

export default function ChatMessage({ message, isNewAuthorChain = false }: ChatMessageArgs) {
    return <div className={`${isNewAuthorChain ? "mt-3" : ""} mb-[-0.5rem] break-words hover:bg-accent rounded-md px-2 cursor-pointer`} title={timestampToFormatString(message.timestamp)}> 
        {isNewAuthorChain ? <>
            {message.author} <ChatMessageTimestamp timestamp={message.timestamp}/>
            <br/>
        </> : <></>} 
        {message.content}
    </div>; 
}