import { create } from 'zustand';
import { jsonrpc } from '../utils/jsonrpc';
import { initSocket, disconnectSocket } from '../utils/socket';

interface User {
  id: string;
  email?: string;
  role: string;
  isAnonymous: boolean;
  safeModeEnabled: boolean;
  quickExitEnabled: boolean;
  locationSharingEnabled: boolean;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    email?: string;
    relationship: string;
    priority: number;
  }>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  anonymousSessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  createAnonymousSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  anonymousSessionId: localStorage.getItem('anonymousSessionId'),
  isAuthenticated: false,
  isLoading: false,

  createAnonymousSession: async () => {
    try {
      set({ isLoading: true });
      const result = await jsonrpc.call('user.createAnonymous');
      
      jsonrpc.setToken(result.token);
      jsonrpc.setAnonymousSessionId(result.anonymousSessionId);
      
      set({
        user: result.user,
        token: result.token,
        anonymousSessionId: result.anonymousSessionId,
        isAuthenticated: true,
        isLoading: false
      });

      // Initialize socket connection
      initSocket(result.token, result.anonymousSessionId);
    } catch (error) {
      console.error('Failed to create anonymous session:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    // This would typically call a login endpoint
    // For now, we'll use the JSON-RPC API
    try {
      set({ isLoading: true });
      // Note: You'll need to add a login method to the backend
      // For now, this is a placeholder
      throw new Error('Login not implemented yet');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    jsonrpc.setToken(null);
    jsonrpc.setAnonymousSessionId(null);
    disconnectSocket();
    
    set({
      user: null,
      token: null,
      anonymousSessionId: null,
      isAuthenticated: false
    });
  },

  updateProfile: async (updates: Partial<User>) => {
    try {
      const result = await jsonrpc.call('user.updateProfile', updates);
      set({ user: result.user });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  loadUser: async () => {
    try {
      const { token, anonymousSessionId } = get();
      if (!token && !anonymousSessionId) {
        return;
      }

      set({ isLoading: true });
      const result = await jsonrpc.call('user.getProfile');
      
      set({
        user: result.user,
        isAuthenticated: true,
        isLoading: false
      });

      // Initialize socket if not already connected
      if (token || anonymousSessionId) {
        initSocket(token || undefined, anonymousSessionId || undefined);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      set({ isLoading: false, isAuthenticated: false });
    }
  }
}));

