import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/Store";


export default function OpenSidebarButton() {
    const { toggleSidebar } = useSidebar();
    const hasUnread = useSelector((state: IRootState) => state.chatReducer.hasUnread);

    return <div onClick={toggleSidebar} className="size-7 mt-3 ml-2" group-data-collapsible="icon">
        {hasUnread ? <MessageCircleMore /> : <MessageCircle />}
    </div>;
}