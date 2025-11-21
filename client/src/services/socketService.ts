import io from 'socket.io-client';

class SocketService {
  private socket: any = null;

  connect(token?: string): any {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        token: token || localStorage.getItem('token')
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): any {
    return this.socket;
  }

  // Add the missing methods that are being used
  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Specific method that's being called
  emitEmergencyActivated(data: any) {
    this.emit('emergency:activated', data);
  }
}

export const socketService = new SocketService();
export default socketService;
