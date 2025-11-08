import type { StateCreator } from 'zustand';
import type { GlobalState } from '../types';

export interface UISlice {
  setTheme: (theme: string) => void;
  toggleSidebar: () => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  openModal: (id: string, data?: any) => void;
  closeModal: (id: string) => void;
}

export const createUISlice: StateCreator<
  GlobalState & UISlice,
  [['zustand/immer', never]],
  [],
  UISlice
> = (set, get) => ({
  setTheme: (theme: string) =>
    set((state: any) => {
      state.ui.theme = theme;
      
      // Update user preferences if logged in
      if (state.auth.currentUser) {
        state.auth.currentUser.preferences.theme = theme as any;
      }
    }),

  toggleSidebar: () =>
    set((state: any) => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen;
    }),

  addNotification: (notification: any) =>
    set((state: any) => {
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
    set((state: any) => {
      state.ui.notifications = state.ui.notifications.filter(
        (notification: any) => notification.id !== id
      );
    }),

  openModal: (id: string, data?: any) =>
    set((state: any) => {
      state.ui.modals[id] = {
        isOpen: true,
        data: data || null,
        openedAt: new Date().toISOString()
      };
    }),

  closeModal: (id: string) =>
    set((state: any) => {
      if (state.ui.modals[id]) {
        state.ui.modals[id].isOpen = false;
      }
    })
});