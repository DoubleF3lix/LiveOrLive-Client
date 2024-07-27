import { createContext } from 'react';

import WebSocketConnection from '~/lib/WebSocketConnection';


export const ServerConnectionContext = createContext<WebSocketConnection | null>(null);
