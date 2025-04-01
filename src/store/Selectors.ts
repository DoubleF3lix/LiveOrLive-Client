import { createSelector } from "@reduxjs/toolkit";
import { IRootState } from "~/store/Store";


export const isHost = createSelector(
    [
        (state: IRootState) => state.selfDataReducer.username,
        (state: IRootState) => state.lobbyDataReducer.host
    ],
    (username, host) => username === host
);