import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BroadcastChannel } from 'broadcast-channel';
import { GlobalState, PortalType } from './types';
import { createAuthSlice, type AuthSlice } from './slices/authSlice';
import { createStudentsSlice, type StudentsSlice } from './slices/studentsSlice';
import { createLearningSlice, type LearningSlice } from './slices/learningSlice';
import { createSyncSlice, type SyncSlice } from './slices/syncSlice';
import { createUISlice, type UISlice } from './slices/uiSlice';
import { storageAdapter } from './adapters/storageAdapter';

// Cross-portal communication channel
const crossPortalChannel = new BroadcastChannel('aivo-state-sync');

export interface StoreActions extends AuthSlice, StudentsSlice, LearningSlice, SyncSlice, UISlice {
  // Cross-portal actions
  broadcastMessage: (type: string, payload: unknown, targetPortal?: PortalType) => void;
  syncWithPortal: (portalType: PortalType, data: Record<string, unknown>) => void;

  // State management
  resetState: () => void;
  exportState: () => string;
  importState: (state: string) => void;
}

const initialState: GlobalState = {
  auth: {
    currentUser: null,
    token: null,
    isAuthenticated: false,
    sessionExpiry: null
  },
  students: {
    profiles: {},
    activeStudentId: null,
    loadingStates: {}
  },
  learning: {
    currentSession: null,
    recentActivities: [],
    focusMetrics: [],
    gamificationData: null
  },
  portals: {
    [PortalType.WEB]: {},
    [PortalType.PARENT_PORTAL]: {},
    [PortalType.TEACHER_PORTAL]: {},
    [PortalType.LEARNER_APP]: {},
    [PortalType.BASELINE_ASSESSMENT]: {},
    [PortalType.DISTRICT_PORTAL]: {},
    [PortalType.SUPER_ADMIN]: {},
    [PortalType.MODEL_CLONING]: {},
    [PortalType.MOBILE]: {}
  },
  sync: {
    status: {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      lastSyncAt: '',
      pendingActions: 0,
      conflictsCount: 0,
      isSyncing: false
    },
    offlineActions: [],
    conflicts: []
  },
  ui: {
    theme: 'light',
    sidebarOpen: true,
    notifications: [],
    modals: {}
  }
};

export const useGlobalStore = create<GlobalState & StoreActions>()(
  persist(
    immer((set, get, store) => ({
      ...initialState,
      
      // Combine all slice actions
      ...createAuthSlice(set, get, store),
      ...createStudentsSlice(set, get, store),
      ...createLearningSlice(set, get, store),
      ...createSyncSlice(set, get, store),
      ...createUISlice(set, get, store),

      // Cross-portal communication
      broadcastMessage: (type: string, payload: unknown, targetPortal?: PortalType) => {
        const message = {
          id: `msg-${Date.now()}`,
          type,
          payload,
          sourcePortal: getCurrentPortal(),
          targetPortal,
          timestamp: new Date().toISOString(),
          userId: get().auth.currentUser?.id || 'anonymous'
        };

        crossPortalChannel.postMessage(message);
      },

      syncWithPortal: (portalType: PortalType, data: Record<string, unknown>) => {
        set((state) => {
          state.portals[portalType] = { ...state.portals[portalType], ...data };
        });
      },

      // State management utilities
      resetState: () => {
        set(() => initialState);
      },

      exportState: () => {
        const state = get();
        return JSON.stringify(state, null, 2);
      },

      importState: (stateString: string) => {
        try {
          const parsedState = JSON.parse(stateString);
          set(() => parsedState);
        } catch (error) {
          console.error('Failed to import state:', error);
        }
      }
    })),
    {
      name: 'aivo-global-state',
      storage: createJSONStorage(() => storageAdapter),
      partialize: (state) => ({
        auth: {
          ...state.auth,
          // Don't persist token for security
          token: null
        },
        students: state.students,
        ui: {
          ...state.ui,
          // Don't persist temporary UI state
          notifications: [],
          modals: {}
        },
        // Persist offline actions for sync
        sync: {
          ...state.sync,
          offlineActions: state.sync.offlineActions
        }
      }),
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return initialState;
        }

        if (version === 0) {
          return {
            ...(persistedState as GlobalState)
          };
        }

        return persistedState as GlobalState;
      }
    }
  )
);

// Helper function to detect current portal
function getCurrentPortal(): PortalType {
  if (typeof window === 'undefined') return PortalType.WEB;
  
  const { hostname, port } = window.location;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    switch (port) {
      case '5173': return PortalType.WEB;
      case '5174': return PortalType.PARENT_PORTAL;
      case '5175': return PortalType.TEACHER_PORTAL;
      case '5176': return PortalType.LEARNER_APP;
      case '5179': return PortalType.BASELINE_ASSESSMENT;
      default: return PortalType.WEB;
    }
  }
  
  // Production domain detection
  if (hostname.includes('parent')) return PortalType.PARENT_PORTAL;
  if (hostname.includes('teacher')) return PortalType.TEACHER_PORTAL;
  if (hostname.includes('learn')) return PortalType.LEARNER_APP;
  if (hostname.includes('baseline')) return PortalType.BASELINE_ASSESSMENT;
  if (hostname.includes('district')) return PortalType.DISTRICT_PORTAL;
  if (hostname.includes('admin')) return PortalType.SUPER_ADMIN;
  
  return PortalType.WEB;
}

// Set up cross-portal message listener
if (typeof window !== 'undefined') {
  crossPortalChannel.addEventListener('message', (message) => {
    const store = useGlobalStore.getState();
    
    // Handle different message types
    switch (message.type) {
      case 'USER_UPDATED':
        if (message.payload.user) {
          store.setUser(message.payload.user);
        }
        break;
      case 'STUDENT_UPDATED':
        if (message.payload.student) {
          store.updateStudent(message.payload.student.id, message.payload.student);
        }
        break;
      case 'LOGOUT':
        store.logout();
        break;
      case 'SYNC_REQUEST':
        store.syncWithServer();
        break;
      default:
        // Handle portal-specific messages
        store.syncWithPortal(message.sourcePortal, message.payload);
    }
  });

  // Listen for online/offline events
  window.addEventListener('online', () => {
    useGlobalStore.getState().updateSyncStatus({ isOnline: true });
    useGlobalStore.getState().syncWithServer();
  });

  window.addEventListener('offline', () => {
    useGlobalStore.getState().updateSyncStatus({ isOnline: false });
  });
}