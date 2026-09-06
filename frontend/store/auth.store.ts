import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginTimestamp: number | null; // Track login time
  setUser: (user: User) => void;
  clearAuth: () => void;
  checkExpiration: () => void;
}

const EXPIRED_TIME_MS = 23 * 60 * 60 * 1000; // 23 hours in milliseconds

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loginTimestamp: null,

      setUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
          loginTimestamp: Date.now(), // Save current timestamp on login
        }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          loginTimestamp: null,
        }),

      // Method to check and enforce expiration
      checkExpiration: () => {
        const { loginTimestamp, clearAuth } = get();
        if (loginTimestamp && Date.now() - loginTimestamp > EXPIRED_TIME_MS) {
          clearAuth();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),

      // Checks expiration automatically as soon as state is loaded from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkExpiration();
        }
      },
    }
  )
);