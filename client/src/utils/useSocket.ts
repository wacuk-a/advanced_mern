import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket, getSocket, disconnectSocket } from './socket';

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const anonymousSessionId = localStorage.getItem('anonymousSessionId');
    
    const socketInstance = initSocket(token || undefined, anonymousSessionId || undefined);
    setSocket(socketInstance);

    return () => {
      // Don't disconnect on unmount, keep connection alive
      // disconnectSocket();
    };
  }, []);

  return socket;
}

