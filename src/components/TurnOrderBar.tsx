import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/breadcrumb";
// import { useSelector } from "react-redux";
// import { IRootState } from "~/store/Store";


export default function TurnOrderBar({ className }: { className?: string }) {
    const turnOrder = ["feef1", "feef2", "feef3", "feef4", "feef5", "feef6"] // useSelector((state: IRootState) => state.lobbyDataReducer.turnOrder);
    const currentTurn = "feef3" // useSelector((state: IRootState) => state.lobbyDataReducer.currentTurn);

    return <div className={`flex ${className}`}>
        <span className="text-muted-foreground text-sm mr-3 shrink-0">Turn Order:</span>
        <Breadcrumb className="overflow-x-auto">
            <BreadcrumbList className="flex-nowrap">
                {turnOrder && turnOrder.map((username, index) => <>
                    <BreadcrumbItem>{username === currentTurn ? <strong>{username}</strong> : username}</BreadcrumbItem>
                    {index !== (turnOrder.length - 1) && <BreadcrumbSeparator />}
                </>)}
            </BreadcrumbList>
        </Breadcrumb>
    </div>;
}