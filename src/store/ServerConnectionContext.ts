import { createContext } from 'react';
import { ServerConnection } from '~/lib/ServerConnection';


export const ServerConnectionContext = createContext<ServerConnection | null>(null);
