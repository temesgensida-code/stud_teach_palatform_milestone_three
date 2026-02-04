import { io } from 'socket.io-client';

// In Vite, use import.meta.env instead of process.env
const SOCKET_URL = import.meta.env.VITE_SIGNALING_SERVER || 'http://localhost:3001';

export const socket = io(SOCKET_URL);