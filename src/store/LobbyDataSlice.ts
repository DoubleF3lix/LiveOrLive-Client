import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS } from "~/lib/const";
import { checkClientIsPlayer, removeGameItemFromPlayer, removeItemFromArray } from "~/lib/utils";
import { Lobby } from "~/types/generated/liveorlive_server";
import { Item } from "~/types/generated/liveorlive_server.Enums";
import { ConnectedClient } from "~/types/generated/liveorlive_server.Models";
import { NewRoundResult } from "~/types/generated/liveorlive_server.Models.Results";


const initialLobbyDataSliceState: Lobby = {
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
    ammoLeftInChamber: 0
};

export const lobbyDataSlice = createSlice({
    name: "lobbyData",
    initialState: initialLobbyDataSliceState,
    reducers: {
        loadFromPacket: (_state, action: PayloadAction<Lobby>) => {
            return action.payload;
        },
        clientJoined: (state, action: PayloadAction<ConnectedClient>) => {
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
                    state.players[targetIndex].items = [...state.players[targetIndex].items, ...itemSet];
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
        playerShotAt: (state, action: PayloadAction<{ username: string, bulletType: number, damage: number }>) => {
            const targetIndex = state.players.findIndex(player => player.username === action.payload.username);
            if (targetIndex !== -1) {
                state.players[targetIndex].lives = Math.max(0, state.players[targetIndex].lives - action.payload.damage);
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
                // state.players[targetIndex].lives = Math.min(state.players[targetIndex].lives + 1, state.settings.maxLives);
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
            state.players = removeGameItemFromPlayer(state.players, action.payload.itemSourceUsername, Item.Ricochet);
        }
    }
});

export const {
    loadFromPacket, clientJoined, clientLeft, setHost, gameStarted, setTurnOrder, gameEnded,
    addItemsFromRoundStart, turnStarted, turnEnded, playerShotAt, reverseTurnOrderItemUsed,
    rackChamberItemUsed, extraLifeItemUsed, pickpocketItemUsed, lifeGambleItemUsed, invertItemUsed,
    chamberCheckItemUsed, doubleDamageItemUsed, skipItemUsed, ricochetItemUsed
} = lobbyDataSlice.actions;
export default lobbyDataSlice.reducer;
