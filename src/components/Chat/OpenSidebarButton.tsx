import { useSelector } from "react-redux";
import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useSidebar } from "@/sidebar";
import { IRootState } from "~/store/Store";


export default function OpenSidebarButton() {
    const { toggleSidebar } = useSidebar();
    const hasUnread = useSelector((state: IRootState) => state.chatReducer.hasUnread);

    return <div onClick={toggleSidebar} className="size-7 mt-3 ml-2 absolute" group-data-collapsible="icon">
        {hasUnread ? <MessageCircleMore /> : <MessageCircle />}
    </div>;
}