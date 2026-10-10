import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";

// Single shared socket for the whole app.
// Before: every component called io() itself (PrivateComponent + ChatPage /
// DirectChat / CounselorMessages / StudentDashboard + StrictMode double-mount),
// so one user opened N concurrent connections -> backend logged
// "User connected: <same id>" N times. Now all components share one connection.

let socket = null;
let currentToken = null;

export function getSocket(token) {
  if (!token) return null;
  // Token rotated (re-login) -> drop old connection
  if (socket && currentToken !== token) {
    socket.disconnect();
    socket = null;
  }
  if (!socket) {
    currentToken = token;
    socket = io(SOCKET_URL, {
      auth: { token },
      // Avoid aggressive reconnect storms; one connection is enough
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  } else if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
}

export default getSocket;
