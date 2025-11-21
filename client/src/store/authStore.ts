import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeStorage } from '../utils/storage';

interface AuthState {
  token: string | null;
  anonymousSessionId: string | null;
  isAnonymous: boolean;
  createAnonymousSession: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: safeStorage.getItem("token"),
      anonymousSessionId: safeStorage.getItem("anonymousSessionId"),
      isAnonymous: false,

      createAnonymousSession: async () => {
        const sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        safeStorage.setItem("anonymousSessionId", sessionId);
        set({ 
          anonymousSessionId: sessionId,
          isAnonymous: true 
        });
      },

      logout: () => {
        safeStorage.removeItem("token");
        safeStorage.removeItem("anonymousSessionId");
        set({ 
          token: null, 
          anonymousSessionId: null,
          isAnonymous: false 
        });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
