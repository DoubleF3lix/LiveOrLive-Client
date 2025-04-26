import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/breadcrumb";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/Store";


export default function TurnOrderBar({ className }: { className?: string }) {
    const turnOrder = useSelector((state: IRootState) => state.lobbyDataReducer.turnOrder);
    const currentTurn = useSelector((state: IRootState) => state.lobbyDataReducer.currentTurn);

    return <div className={`flex ${className} mx-auto`}>
        <Breadcrumb className="overflow-x-auto">
            <BreadcrumbList className="flex-nowrap">
                {turnOrder && turnOrder.map((username, index) => <>
                    <BreadcrumbItem className="text-base">{username === currentTurn ? <strong>{username}</strong> : username}</BreadcrumbItem>
                    {index !== (turnOrder.length - 1) && <BreadcrumbSeparator />}
                </>)}
            </BreadcrumbList>
        </Breadcrumb>
    </div>;
}