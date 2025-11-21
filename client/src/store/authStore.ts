import { create } from "zustand";
import { jsonrpc } from "../utils/jsonrpc";
import { initSocket, disconnectSocket } from "../utils/socket";

interface User {
  id: string;
  email?: string; // optional, no SMTP used
  role: string;
  isAnonymous: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  anonymousSessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  createAnonymousSession: () => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  anonymousSessionId: localStorage.getItem("anonymousSessionId"),
  isAuthenticated: false,
  isLoading: false,

  createAnonymousSession: async () => {
    try {
      set({ isLoading: true });

      const result = await jsonrpc.call("user.createAnonymous");

      jsonrpc.setToken(result.token);
      jsonrpc.setAnonymousSessionId(result.anonymousSessionId);

      set({
        user: result.user,
        token: result.token,
        anonymousSessionId: result.anonymousSessionId,
        isAuthenticated: true,
        isLoading: false,
      });

      initSocket(result.token);
    } catch (e) {
      console.error("Anonymous session error", e);
      set({ isLoading: false });
    }
  },

  loadUser: async () => {
    const { token, anonymousSessionId } = get();
    if (!token && !anonymousSessionId) return;

    try {
      set({ isLoading: true });

      const result = await jsonrpc.call("user.getProfile");

      set({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });

      initSocket(token || undefined);
    } catch {
      set({ isLoading: false, isAuthenticated: false });
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
      isAuthenticated: false,
    });
  },
}));
