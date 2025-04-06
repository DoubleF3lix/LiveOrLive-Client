import { useSelector } from "react-redux";
import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useSidebar } from "@/sidebar";
import { IRootState } from "~/store/Store";
import IconButton from "~/components/micro/IconButton";


type OpenSidebarButtonArgs = {
    className?: string;
};

export default function OpenSidebarButton({ className }: OpenSidebarButtonArgs) {
    const { toggleSidebar } = useSidebar();
    const hasUnread = useSelector((state: IRootState) => state.chatReducer.hasUnread);

    return <IconButton onClick={toggleSidebar} className={className}>
        {hasUnread ? <MessageCircleMore /> : <MessageCircle />}
    </IconButton>
}