import { createSelector } from '@reduxjs/toolkit'
import { PlayerType } from "~/types/PlayerType";
import { IRootState } from "./Store";


// These look like magic, but they're just to make sure that we don't return a new array with the same input
// (and thus avoid those pesky warnings)
export const selectCurrentPlayer = createSelector(
    [
        (state: IRootState) => state.gameDataReducer.players,
        (state: IRootState) => state.gameDataReducer.clientUsername
    ],
    (players, clientUsername): PlayerType => {
        return (
            players.find(player => player.username === clientUsername) ||
            { username: "", inGame: false, isSpectator: true, lives: 0, items: [], isSkipped: false, joinTime: 0 }
        );
    }
);

export const selectPlayerForTurn = createSelector(
    [
        (state: IRootState) => state.gameDataReducer.players,
        (state: IRootState) => state.gameDataReducer.currentTurn
    ],
    (players, currentTurn): PlayerType => {
        return (
            players.find(player => player.username === currentTurn) ||
            { username: "", inGame: false, isSpectator: true, lives: 0, items: [], isSkipped: false, joinTime: 0 }
        );
    }
);

export const selectNonSpectators = createSelector(
    (state: IRootState) => state.gameDataReducer.players,
    players => players.filter(player => player.isSpectator === false)
);

export const selectHost = createSelector(
    [
        (state: IRootState) => state.gameDataReducer.players,
        (state: IRootState) => state.gameDataReducer.currentHost
    ],
    (players, currentHost): PlayerType | undefined => {
        return players.find(player => player.username === currentHost);
    }
);