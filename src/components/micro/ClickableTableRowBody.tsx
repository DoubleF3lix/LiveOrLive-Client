import React, { useRef } from "react";
import { TableBody } from "@/table";

const SELECTED_COLOR = "!bg-table-row-active";

type ClickableTableRowBodyArgs = {
    selectedKey: React.MutableRefObject<string>;
    children?: React.ReactElement[];
    className?: string;
};

export default function ClickableTableRowBody({ children, selectedKey, className }: ClickableTableRowBodyArgs) {
    const selectedRow = useRef<HTMLTableRowElement | null>(null);

    function onRowClick(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) {
        const newSelectedRow = e.currentTarget;
        // If we clicked the same row, toggle the state, and if it's highlighted, set the key to null
        if (newSelectedRow == selectedRow.current) {
            if (newSelectedRow.classList.contains(SELECTED_COLOR)) {
                selectedRow.current = null;
            }
            newSelectedRow.classList.toggle(SELECTED_COLOR);
        } else {
            // Otherwise remove it from the previous one and mark the new
            selectedRow.current?.classList.remove(SELECTED_COLOR);
            selectedRow.current = e.currentTarget;
            newSelectedRow.classList.add(SELECTED_COLOR);
        }
        selectedKey.current = selectedRow.current?.dataset.id ?? "";
    }

    return <TableBody className={className}>
        {children?.map(child => {
            return React.cloneElement(child, { onRowClick: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => { onRowClick(e) } });
        })}
    </TableBody>;
}