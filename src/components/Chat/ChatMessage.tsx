import { ChatMessage as ChatMessageType } from "~/types/generated/liveorlive_server";

type ChatMessageArgs = {
    message: ChatMessageType;
};

export default function ChatMessage({ message }: ChatMessageArgs) {
    function timestampToFormatString(timestamp: number): string {
        // Turns it into 9:22 PM
        return new Date(timestamp * 1000).toLocaleTimeString(undefined, {hour12: true, hour: "numeric", minute: "2-digit"});
    }

    return <p>{message.author} ({timestampToFormatString(message.timestamp)}): {message.content}</p>;
}