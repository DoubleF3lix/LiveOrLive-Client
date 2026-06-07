import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS } from "~/lib/const";
import { checkClientIsPlayer, removeGameItemFromPlayer, removeItemFromArray } from "~/lib/utils";
import { LobbyDto, ConnectedClientDto } from "~/types/generated/LiveOrLiveServer.Models.Dto";
import { Item } from "~/types/generated/LiveOrLiveServer.Enums";
import { NewRoundResult } from "~/types/generated/LiveOrLiveServer.Models.Results";


const initialLobbyDataSliceState: LobbyDto = {
    id: "",
    name: "",
    creationTime: 0,
    settings: DEFAULT_SETTINGS,
    players: [],
    spectators: [],
    host: undefined,
    gameStarted: false,
    turnOrder: [],
    currentTurn: undefined,
    ammoLeftInChamber: 0,
    suddenDeathActivated: false
};

export const lobbyDataSlice = createSlice({
    name: "lobbyData",
    initialState: initialLobbyDataSliceState,
    reducers: {
        loadFromPacket: (_state, action: PayloadAction<LobbyDto>) => {
            return action.payload;
        },
        clientJoined: (state, action: PayloadAction<ConnectedClientDto>) => {
            if (checkClientIsPlayer(action.payload)) {
                const existingPlayer = state.players.find(player => player.username === action.payload.username);
                if (existingPlayer) {
                    existingPlayer.inGame = true;
                } else {
                    state.players.push(action.payload);
                }
            } else {
                state.spectators.push(action.payload);
            }
        },
        clientLeft: (state, action: PayloadAction<string>) => {
            const clientToRemove = state.players.find(player => player.username === action.payload) ?? state.spectators.find(spectator => spectator.username === action.payload);
            if (clientToRemove) {
                if (checkClientIsPlayer(clientToRemove)) {
                    if (state.gameStarted) {
                        clientToRemove.inGame = false;
                    } else {
                        state.players = removeItemFromArray(state.players, clientToRemove);
                    }
                } else {
                    state.spectators = removeItemFromArray(state.spectators, clientToRemove);
                }
            }
        },
        setHost: (state, action: PayloadAction<string | undefined>) => {
            state.host = action.payload;
        },
        gameStarted: (state) => {
            state.gameStarted = true;
        },
        setTurnOrder: (state, action: PayloadAction<string[]>) => {
            state.turnOrder = action.payload;
        },
        gameEnded: (state) => {
            state.gameStarted = false;
        },
        addItemsFromRoundStart: (state, action: PayloadAction<NewRoundResult["dealtItems"]>) => {
            // Add the items to each player
            for (const [username, itemSet] of Object.entries(action.payload)) {
                if (itemSet) {
                    const targetIndex = state.players.findIndex(player => player.username === username);
                    if (targetIndex !== -1) {
                        state.players[targetIndex].items = [...(state.players[targetIndex].items ?? []), ...itemSet];
                    }
                }
            }
        },
        turnStarted: (state, action: PayloadAction<string>) => {
            state.currentTurn = action.payload;
            const playerIndex = state.players.findIndex(player => player.username === action.payload);
            if (playerIndex !== -1) {
                state.players[playerIndex].isSkipped = false;
            }
        },
        turnEnded: (state) => {
            state.currentTurn = undefined;
        },
        playerShotAt: (state, action: PayloadAction<{ username: string, bulletType: number, damage: number, ricochets: string[] }>) => {
            const targetIndex = state.players.findIndex(player => player.username === action.payload.username);
            if (targetIndex !== -1) {
                state.players[targetIndex].lives = Math.max(0, state.players[targetIndex].lives - action.payload.damage);
            }
            for (const ricochetUsername of action.payload.ricochets) {
                const ricochetIndex = state.players.findIndex(player => player.username === ricochetUsername);
                if (ricochetIndex !== -1) {
                    state.players[ricochetIndex].isRicochet = false;
                }
            }
        },
        suddenDeathActivated: (state) => {
            state.suddenDeathActivated = true;
            // Turn all existing extra life items into double damage
            state.players.forEach(player => {
                player.items = (player.items ?? []).map(item =>
                    item === Item.ExtraLife ? Item.DoubleDamage : item
                );
            });
        },
        playerEliminated: (state, action: PayloadAction<string>) => {
            const playerIndex = state.players.findIndex(player => player.username === action.payload);
            if (playerIndex !== -1) {
                state.players[playerIndex].eliminated = true;
            }
        },
        reverseTurnOrderItemUsed: (state, action: PayloadAction<{ itemSourceUsername: string }>) => {
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.ReverseTurnOrder);
        },
        rackChamberItemUsed: (state, action: PayloadAction<{ bulletType: number, itemSourceUsername: string }>) => {
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.RackChamber);
        },
        extraLifeItemUsed: (state, action: PayloadAction<{ target: string, itemSourceUsername: string }>) => {
            const targetIndex = state.players.findIndex(player => player.username === action.payload.target);
            if (targetIndex !== -1) {
                state.players[targetIndex].lives += 1;
            }
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.ExtraLife);
        },
        pickpocketItemUsed: (state, action: PayloadAction<{ target: string, item: Item, itemTarget: string | undefined, itemSourceUsername: string }>) => {
            // The itemSourceUsername is always currentTurn, but for consistency we pass it anyway
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.Pickpocket);
        },
        lifeGambleItemUsed: (state, action: PayloadAction<{ lifeChange: number, itemSourceUsername: string }>) => {
            const targetIndex = state.players.findIndex(player => player.username === state.currentTurn);
            if (targetIndex !== -1) {
                state.players[targetIndex].lives += action.payload.lifeChange;
            }

            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.LifeGamble);
        },
        invertItemUsed: (state, action: PayloadAction<{ itemSourceUsername: string }>) => {
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.Invert);
        },
        chamberCheckItemUsed: (state, action: PayloadAction<{ bulletType: number, itemSourceUsername: string }>) => {
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.ChamberCheck);
        },
        doubleDamageItemUsed: (state, action: PayloadAction<{ itemSourceUsername: string }>) => {
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.DoubleDamage);
        },
        skipItemUsed: (state, action: PayloadAction<{ target: string, itemSourceUsername: string }>) => {
            const targetIndex = state.players.findIndex(player => player.username === action.payload.target);
            if (targetIndex !== -1) {
                state.players[targetIndex].isSkipped = true;
            }
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.Skip);
        },
        ricochetItemUsed: (state, action: PayloadAction<{ target: string, itemSourceUsername: string }>) => {
            // Add the badge if we're told who to add it to
            if (action.payload.target !== null) { 
                const targetIndex = state.players.findIndex(player => player.username === action.payload.target);
                if (targetIndex !== -1) {
                    state.players[targetIndex].isRicochet = true;
                }
            }
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.Ricochet);
        }
    }
});

export const {
    loadFromPacket, clientJoined, clientLeft, setHost, gameStarted, setTurnOrder, gameEnded,
    addItemsFromRoundStart, turnStarted, turnEnded, playerShotAt, suddenDeathActivated, playerEliminated,
    reverseTurnOrderItemUsed, rackChamberItemUsed, extraLifeItemUsed, pickpocketItemUsed, lifeGambleItemUsed, 
    invertItemUsed, chamberCheckItemUsed, doubleDamageItemUsed, skipItemUsed, ricochetItemUsed
} = lobbyDataSlice.actions;
export default lobbyDataSlice.reducer;
