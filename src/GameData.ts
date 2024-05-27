import Item from "./Item";
import { GetGameInfoResponsePacket } from "./Packet";

// Only represents players who are in the game, and only used for UI purposes
export type Player = {
    username: string, 
    lives: number, 
    items: Item[]
};

export type ChatMessage = {
    author: Player,
    message: string,
    timestamp: number
};

class Chat {
    // Dummy message to detect initialization 
    private _messages: ChatMessage[] = [{author: {username: "", items: [], lives: 0}, message: "", timestamp: 0}];

    // No addMessage without timestamp because it's server-authoritative
    addMessage(message: ChatMessage): void {
        this._messages.push(message);
    }

    get messages(): ChatMessage[] {
        return this._messages;
    }
    
    populateFromPacket(packet: GetGameInfoResponsePacket) {
        this._messages = packet.chatMessages;
    }
}

export default class GameData {
    players: Player[] = [];
    clientUsername: string = ""; // The username that represents this client
    currentHost: string = ""; // Just storing their username should be fine
    chat: Chat = new Chat();
    turnCount: number = -1;
}
