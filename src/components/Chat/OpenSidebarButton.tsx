import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useSidebar } from "../ui/sidebar";


export default function OpenSidebarButton() {
    const { toggleSidebar } = useSidebar();
    const hasUnread = false;

    return <div onClick={toggleSidebar} className="size-7 mt-3 ml-2" group-data-collapsible="icon">
        {hasUnread ? <MessageCircleMore /> : <MessageCircle />}
    </div>;
}