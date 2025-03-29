import { TableRow } from "@/table";


type ClickableTableRowArgs = {
    id: string;
    key?: string;
    children?: React.ReactNode;
    onRowClick?: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;
    className?: string;
};

export default function ClickableTableRow({ id , children, onRowClick, className = "" }: ClickableTableRowArgs) {
    return <TableRow data-id={id} onClick={(e) => { onRowClick?.(e) }} className={`even:bg-primary-foreground odd:bg-muted hover:bg-table-row-hover ${className}`}>{children}</TableRow> 
}