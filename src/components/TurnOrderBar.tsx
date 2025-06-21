import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/breadcrumb";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/Store";
import { Fragment } from "react";


export default function TurnOrderBar({ className }: { className?: string }) {
    const turnOrder = useSelector((state: IRootState) => state.lobbyDataReducer.turnOrder);
    const currentTurn = useSelector((state: IRootState) => state.lobbyDataReducer.currentTurn);

    const turnOrderReversed = useSelector((state: IRootState) => state.roundDataReducer.turnOrderReversed);

    return <div className={`flex ${className} mx-auto`}>
        <Breadcrumb className="overflow-x-auto">
            <BreadcrumbList className="flex-nowrap">
                {turnOrder && turnOrder.map((username, index) => <Fragment key={`${username}_turnOrder`}>
                    <BreadcrumbItem className="text-base">{username === currentTurn ? <strong>{username}</strong> : username}</BreadcrumbItem>
                    {index !== (turnOrder.length - 1) && <BreadcrumbSeparator direction={turnOrderReversed ? "left" : "right"} />}
                </Fragment>)}
            </BreadcrumbList>
        </Breadcrumb>
    </div>;
}