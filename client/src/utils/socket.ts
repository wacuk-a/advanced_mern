import { socketService } from '../services/socketService';

export const initSocket = (token?: string) => {
  return socketService.connect(token);
};

export const disconnectSocket = () => {
  socketService.disconnect();
};

export const getSocket = () => {
  return socketService.getSocket();
};
