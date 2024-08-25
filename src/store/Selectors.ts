import { PlayerType } from "~/types/PlayerType";
import { IRootState } from "./Store";


export function selectCurrentPlayer(state: IRootState): PlayerType {
    return state.gameDataReducer.players.find(player => player.username === state.gameDataReducer.clientUsername) ||
        { username: "", inGame: false, isSpectator: true, lives: 0, items: [], isSkipped: false, joinTime: 0 };
}

export function selectNonSpectators(state: IRootState) {
    return state.gameDataReducer.players.filter(player => player.isSpectator === false);
}

export function selectHost(state: IRootState): PlayerType | undefined {
    return state.gameDataReducer.players.find(player => player.username === state.gameDataReducer.currentHost);
}