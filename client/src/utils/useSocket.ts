import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    socketRef.current = io(serverUrl, {
      auth: { token }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};
