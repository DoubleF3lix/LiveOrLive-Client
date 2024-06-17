import { createContext } from 'react';
import WebSocketConnection from './WebSocketConnection';

export const ServerConnectionContext = createContext<WebSocketConnection | null>(null);
