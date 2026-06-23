import { Settings } from "~/types/generated/LiveOrLiveServer.Models";

export const BASE_URL = import.meta.env.DEV ? "http://localhost:8080" : "https://liveorlive-server.fly.dev";
export const SERVER_TIMEOUT = import.meta.env.DEV ? 3600000 : 30000; // 1h on debug, 30s otherwise
export const PLAYER_CARD_BADGE_ICONS = true;

export const DEFAULT_SETTINGS: Settings = {
    private: false,
    maxPlayers: 0,
    minBlankRounds: 0,
    minLiveRounds: 0,
    maxBlankRounds: 0,
    maxLiveRounds: 0,
    defaultLives: 0,
    maxLives: 0,
    randomItemsPerRound: false,
    minItemsPerRound: 0,
    maxItemsPerRound: 0,
    maxItems: 0,
    enableReverseTurnOrderItem: false,
    enableRackChamberItem: false,
    enableExtraLifeItem: false,
    enablePickpocketItem: false,
    enableLifeGambleItem: false,
    enableInvertItem: false,
    enableChamberCheckItem: false,
    enableDoubleDamageItem: false,
    enableSkipItem: false,
    enableRicochetItem: false,
    enablePocketPistolItem: false,
    announceChamberCheckResults: false,
    allowLifeDonation: false,
    maxPlayerRevives: -1,
    allowDoubleDamageStacking: false,
    allowSequentialSkips: false,
    allowExtraLifeWhenFull: false,
    allowLifeGambleExceedMax: false,
    allowSelfSkip: false,
    loseSkipAfterRound: false,
    copySkipOnKill: false,
    showRicochets: false,
    showRicochetsCounter: false,
    suddenDeathActivationPoint: 0,
    secondWind: false,
    lifeGambleWeights: { 2: 1, [-1]: 1 }
};