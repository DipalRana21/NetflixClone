import { io } from "socket.io-client";

// The URL of your backend server
const SOCKET_SERVER = "http://localhost:5000";

// Create and export a single socket instance
// We use autoConnect: false so we can manually connect when needed.
export const socket = io(SOCKET_SERVER, { 
    autoConnect: false,
    transports: ["websocket"] 
});