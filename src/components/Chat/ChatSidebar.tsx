import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/sidebar";
import SendChatButton from "~/components/Chat/SendChatButton";



export function ChatSidebar() {
    return (
        <Sidebar variant="floating">
            <SidebarHeader>
                <p className="font-bold text-xl text-center">Chat</p>
            </SidebarHeader>
            <SidebarContent />
            <SidebarFooter>
                <div className="flex">
                    <textarea rows={1} placeholder="Type a message..." className="grow min-w-0 border-2 border-input rounded-lg p-1 pl-2 resize-none h-auto" />
                    <SendChatButton />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
