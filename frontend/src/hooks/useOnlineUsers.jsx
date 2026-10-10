import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';

// Realtime online presence — socket se live online users ki list.
// Counselor online aaye/jaaye to turant update (initial list + live events).
export default function useOnlineUsers(token) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!token) return;
    // Shared singleton — do NOT disconnect on unmount, just remove listeners
    const socket = getSocket(token);
    if (!socket) return;

    const onList = ({ onlineUsers: list }) => {
      if (Array.isArray(list)) setOnlineUsers(list.map(String));
    };
    const onOnline = ({ userId: online }) =>
      setOnlineUsers((prev) => (prev.includes(String(online)) ? prev : [...prev, String(online)]));
    const onOffline = ({ userId: offline }) =>
      setOnlineUsers((prev) => prev.filter((id) => id !== String(offline)));

    socket.on('online_list', onList);
    socket.on('user_online', onOnline);
    socket.on('user_offline', onOffline);

    return () => {
      socket.off('online_list', onList);
      socket.off('user_online', onOnline);
      socket.off('user_offline', onOffline);
    };
  }, [token]);

  return onlineUsers;
}
