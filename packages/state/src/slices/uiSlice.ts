import type { StateCreator } from 'zustand';
import type { GlobalState } from '../types';

export interface UISlice {
  setTheme: (theme: string) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Record<string, unknown>) => void;
  removeNotification: (id: string) => void;
  openModal: (id: string, data?: unknown) => void;
  closeModal: (id: string) => void;
}

export const createUISlice: StateCreator<
  GlobalState & UISlice,
  [['zustand/immer', never]],
  [],
  UISlice
> = (set, _get, _store) => ({
  setTheme: (theme: string) =>
    set((state) => {
      state.ui.theme = theme;
      
      // Update user preferences if logged in
      if (state.auth.currentUser) {
        state.auth.currentUser.preferences.theme = theme as typeof state.auth.currentUser.preferences.theme;
      }
    }),

  toggleSidebar: () =>
    set((state) => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen;
    }),

  addNotification: (notification: Record<string, unknown>) =>
    set((state) => {
      const newNotification = {
        id: `notification-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...notification
      };
      
      state.ui.notifications.unshift(newNotification);
      
      // Keep only last 20 notifications
      if (state.ui.notifications.length > 20) {
        state.ui.notifications = state.ui.notifications.slice(0, 20);
      }
    }),

  removeNotification: (id: string) =>
    set((state) => {
      state.ui.notifications = state.ui.notifications.filter(
        (notification) =>
          typeof notification === 'object' &&
          notification !== null &&
          'id' in notification &&
          notification.id !== id
      );
    }),

  openModal: (id: string, data?: unknown) =>
    set((state) => {
      state.ui.modals[id] = {
        isOpen: true,
        data: data || null,
        openedAt: new Date().toISOString()
      };
    }),

  closeModal: (id: string) =>
    set((state) => {
      const modalState = state.ui.modals[id];
      if (
        typeof modalState === 'object' &&
        modalState !== null &&
        'isOpen' in modalState
      ) {
        state.ui.modals[id] = {
          ...modalState,
          isOpen: false
        };
      }
    })
});