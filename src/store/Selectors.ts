import { PlayerType } from "~/types/PlayerType";
import { IRootState } from "./Store";


export function selectCurrentPlayer(state: IRootState): PlayerType {
    const player = state.gameDataReducer.players.find(player => player.username === state.gameDataReducer.clientUsername) 
    if (player === undefined) {
        throw new Error(`selectCurrentPlayer: Could not find player with username of "${state.gameDataReducer.clientUsername}"`);
    } else {
        return player;
    }
}

export function selectNonSpectators(state: IRootState) {
    return state.gameDataReducer.players.filter(player => player.isSpectator === false);
}

export function selectHost(state: IRootState): PlayerType {
    const player = state.gameDataReducer.players.find(player => player.username === state.gameDataReducer.currentHost) 
    if (player === undefined) {
        throw new Error(`selectHost: Could not find host with username of "${state.gameDataReducer.currentHost}"`);
    } else {
        return player;
    }
}