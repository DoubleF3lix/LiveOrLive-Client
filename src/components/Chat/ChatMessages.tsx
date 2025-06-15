import { ChatMessage as ChatMessageType } from "~/types/generated/liveorlive_server.Models";
import ChatMessage from "~/components/Chat/ChatMessage";


type ChatMessagesArgs = {
    messages: ChatMessageType[];
}

export default function ChatMessages({ messages }: ChatMessagesArgs) {
    let lastAuthor: string | undefined = undefined;

    function getComponent(message: ChatMessageType) {
        const component = <ChatMessage key={message.id} message={message} isNewAuthorChain={message.author !== lastAuthor} />;
        if (message.author !== lastAuthor) {
            lastAuthor = message.author;
        }
        return component;
    }

    return messages.map(message => getComponent(message));
}