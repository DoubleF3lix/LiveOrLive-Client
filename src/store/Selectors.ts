import { PlayerType } from "~/types/PlayerType";
import { IRootState } from "./Store";


export function selectCurrentPlayer(state: IRootState): PlayerType | undefined {
    return state.gameDataReducer.players.find(player => player.username === state.gameDataReducer.clientUsername) 
}

export function selectNonSpectators(state: IRootState) {
    return state.gameDataReducer.players.filter(player => player.isSpectator === false && player.inGame === true);
}

export function selectHost(state: IRootState): PlayerType | undefined {
    return state.gameDataReducer.players.find(player => player.username === state.gameDataReducer.currentHost) 
}