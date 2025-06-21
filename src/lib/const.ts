export const BASE_URL = import.meta.env.DEV ? "http://localhost:8080" : "https://liveorlive-server.fly.dev";
export const SERVER_TIMEOUT = import.meta.env.DEV ? 3600000 : 30000; // 1h on debug, 30s otherwise
export const PLAYER_CARD_BADGE_ICONS = true;