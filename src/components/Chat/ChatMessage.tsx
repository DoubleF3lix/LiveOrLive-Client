import { ChatMessage as ChatMessageType } from "~/types/generated/liveorlive_server.Models";
// import Markdown from "react-markdown";


type ChatMessageArgs = {
    message: ChatMessageType;
    isNewAuthorChain: boolean;
};

function timestampToFormatString(timestamp: number): string {
    // Turns it into 9:22 PM
    return new Date(timestamp * 1000).toLocaleTimeString(undefined, { hour12: true, hour: "numeric", minute: "2-digit" });
}

function ChatMessageTimestamp({ timestamp }: { timestamp: string }) {
    return <span className="text-xs text-muted-foreground">({timestamp})</span>;
}

export default function ChatMessage({ message, isNewAuthorChain = false }: ChatMessageArgs) {
    const timestamp = timestampToFormatString(message.timestamp);

    return <div className={`${isNewAuthorChain ? "mt-3" : ""} -mb-2 break-words hover:bg-accent rounded-md px-2 cursor-pointer whitespace-pre-wrap pb-0.75`} title={timestamp}>
        {isNewAuthorChain ? <>
            {message.author} <ChatMessageTimestamp timestamp={timestamp} />
            <br />
        </> : <></>}
        {/* <Markdown unwrapDisallowed disallowedElements={["blockquote", "a", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "hr", "table", "thead", "tbody", "tr", "th", "td", "del", "img", "figure", "figcaption"]}> */}
        {message.content}
        {/* </Markdown> */}
    </div>;
}