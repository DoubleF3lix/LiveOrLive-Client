import { SendHorizontal } from "lucide-react";


export default function SendChatButton() {
    return <div onClick={() => console.log("Send")} className="bg-chat-send hover:bg-chat-send-hover content-center p-1 pl-2 rounded-xl aspect-square ml-2">
        <SendHorizontal size={20} color="#ffffff" />
    </div>;
}