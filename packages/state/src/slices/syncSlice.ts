import type { StateCreator } from 'zustand';
import type { GlobalState, OfflineAction } from '../types';

export interface SyncSlice {
  addOfflineAction: (action: OfflineAction) => void;
  removeOfflineAction: (id: string) => void;
  updateSyncStatus: (status: Partial<GlobalState['sync']['status']>) => void;
  syncWithServer: () => Promise<void>;
}

export const createSyncSlice: StateCreator<
  GlobalState & SyncSlice,
  [['zustand/immer', never]],
  [],
  SyncSlice
> = (set, get, _store) => ({
  addOfflineAction: (action: OfflineAction) =>
    set((state) => {
      state.sync.offlineActions.push(action);
      state.sync.status.pendingActions = state.sync.offlineActions.length;
    }),

  removeOfflineAction: (id: string) =>
    set((state) => {
      state.sync.offlineActions = state.sync.offlineActions.filter(
        (action: OfflineAction) => action.id !== id
      );
      state.sync.status.pendingActions = state.sync.offlineActions.length;
    }),

  updateSyncStatus: (status: Partial<GlobalState['sync']['status']>) =>
    set((state) => {
      state.sync.status = { ...state.sync.status, ...status };
    }),

  syncWithServer: async () => {
    const state = get();
    
    if (!state.sync.status.isOnline || state.sync.status.isSyncing) {
      return;
    }

    set((state) => {
      state.sync.status.isSyncing = true;
    });

    try {
      // Process offline actions
      const actionsToSync = [...state.sync.offlineActions];
      
      for (const action of actionsToSync) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Remove successful action
          set((state) => {
            state.sync.offlineActions = state.sync.offlineActions.filter(
              (a: OfflineAction) => a.id !== action.id
            );
          });
  } catch {
          // Increment retry count
          set((state) => {
            const actionIndex = state.sync.offlineActions.findIndex(
              (a: OfflineAction) => a.id === action.id
            );
            if (actionIndex !== -1) {
              state.sync.offlineActions[actionIndex].retryCount++;
              
              // Remove if max retries reached
              if (state.sync.offlineActions[actionIndex].retryCount >= action.maxRetries) {
                state.sync.offlineActions.splice(actionIndex, 1);
              }
            }
          });
        }
      }

      set((state) => {
        state.sync.status.lastSyncAt = new Date().toISOString();
        state.sync.status.pendingActions = state.sync.offlineActions.length;
        state.sync.status.isSyncing = false;
      });

    } catch (error) {
      console.error('Sync failed:', error);
      set((state) => {
        state.sync.status.isSyncing = false;
      });
    }
  }
});