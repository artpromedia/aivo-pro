import type { StateCreator } from 'zustand';
import type { GlobalState, User } from '../types';

export interface AuthSlice {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
}

export const createAuthSlice: StateCreator<
  GlobalState & AuthSlice,
  [['zustand/immer', never]],
  [],
  AuthSlice
> = (set, _get, _store) => ({
  setUser: (user) =>
    set((state) => {
      state.auth.currentUser = user;
      state.auth.isAuthenticated = !!user;
    }),

  setToken: (token) =>
    set((state) => {
      state.auth.token = token;
      if (token) {
        // Set session expiry (e.g., 24 hours from now)
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        state.auth.sessionExpiry = expiry.toISOString();
      } else {
        state.auth.sessionExpiry = null;
      }
    }),

  logout: () =>
    set((state) => {
      state.auth.currentUser = null;
      state.auth.token = null;
      state.auth.isAuthenticated = false;
      state.auth.sessionExpiry = null;
      
      // Clear student data on logout
      state.students.profiles = {};
      state.students.activeStudentId = null;
      
      // Clear learning session
      state.learning.currentSession = null;
      state.learning.recentActivities = [];
      
      // Clear offline actions for this user
      state.sync.offlineActions = [];
    }),

  updateUserPreferences: (preferences) =>
    set((state) => {
      if (state.auth.currentUser) {
        state.auth.currentUser.preferences = {
          ...state.auth.currentUser.preferences,
          ...preferences
        };
      }
    })
});