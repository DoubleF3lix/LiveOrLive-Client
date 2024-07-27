import { ChatMessageType } from "~/types/ChatMessageType";


type ChatMessageArgs = {
    message: ChatMessageType,
    isNewAuthor: boolean,
    includeLineBefore: boolean
};


export default function ChatMessage({ message, isNewAuthor, includeLineBefore }: ChatMessageArgs) {
    function timestampToFormatString(timestamp: number): string {
        // Turns it into 9:22 PM
        return new Date(timestamp * 1000).toLocaleTimeString(undefined, {hour12: true, hour: "numeric", minute: "2-digit"});
    }

    return (
        <>
            {/* Include a line if it's a new author and it's not the first message */}
            {includeLineBefore && isNewAuthor ? <><br/><hr/><br/></> : <></>}
            {/* Include the timestamp and author if it's a new author */}
            {isNewAuthor ? (<>
                {message.author.username} ({timestampToFormatString(message.timestamp)}):
                <br/>
            </>) : <></>}
            <p>
                {message.message}
            </p>
        </>
    );
}