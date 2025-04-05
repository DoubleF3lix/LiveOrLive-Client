import React, { useState } from "react";
import { Lobby } from "~/types/generated/liveorlive_server";
import ClickableTableRowBody from "~/components/micro/ClickableTableRowBody";
import ClickableTableRow from "~/components/micro/ClickableTableRow";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from "@/table"
import {
    Pagination,
    PaginationContent,
    PaginationNext,
    PaginationPrevious,
} from "@/pagination"
import { Check } from "lucide-react";


type LobbySelectorArgs = {
    selectedLobbyIdRef: React.MutableRefObject<string>;
    lobbies: Lobby[];
    className?: string;
};

export default function LobbySelector({ selectedLobbyIdRef, lobbies, className = "" }: LobbySelectorArgs) {
    const [page, setPage] = useState<number>(1);

    return <>
        <div className={className}>
            <Pagination className="border-b-1 border-t-1 border-collapse md:border-separate">
                <PaginationContent className="w-full">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-background hover:bg-background">
                                <TableHead className="pl-4 sm:pl-6 text-center">Name</TableHead>
                                <TableHead className="text-center">Host</TableHead>
                                <TableHead className="text-center">Players</TableHead>
                                <TableHead className="pr-4 sm:pr-6 text-center">Started</TableHead>
                            </TableRow>
                        </TableHeader>
                        <ClickableTableRowBody selectedKey={selectedLobbyIdRef}>
                            {lobbies.slice((page - 1) * 5, page * 5).map(lobby => (
                                <ClickableTableRow key={lobby.id} id={lobby.id}>
                                    <TableCell className="pl-2 sm:pl-6">{lobby.name}</TableCell>
                                    <TableCell className="text-center">{lobby.host ?? "N/A"}</TableCell>
                                    <TableCell className="text-center">{lobby.players.length}/{lobby.settings.maxPlayers}</TableCell>
                                    <TableCell className="flex justify-center pr-4 sm:pr-6 ">
                                        {lobby.gameStarted ? <Check /> : <></>}
                                    </TableCell>
                                </ClickableTableRow>
                            ))}
                        </ClickableTableRowBody>
                    </Table>
                </PaginationContent>
            </Pagination>
            {lobbies.length > 5 && <div className="flex justify-center items-center gap-4 mt-4">
                <PaginationPrevious onClick={() => setPage(Math.max(page - 1, 1))} className={`flex-1 max-w-24 ${page === 1 ? "cursor-not-allowed opacity-50" : ""}`} />
                <span className="text-sm text-center content-center">{page}/{Math.ceil(lobbies.length / 5)}</span>
                <PaginationNext onClick={() => setPage(Math.min(page + 1, Math.ceil(lobbies.length / 5)))} className={`flex-1 max-w-24 ${page === Math.ceil(lobbies.length / 5) ? "cursor-not-allowed opacity-50" : ""}`} />
            </div>}
        </div>
    </>;
}