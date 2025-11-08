import { useGlobalStore, type StoreActions } from '../store';
import { type GlobalState } from '../types';

// Selector type for type safety
type Selector<T> = (state: GlobalState & StoreActions) => T;

// Generic hook to use store with selectors
export function useStore<T>(selector?: Selector<T>): T {
  return useGlobalStore(selector as any);
}

// Auth hooks
export function useAuth() {
  return useGlobalStore((state) => ({
    user: state.auth.currentUser,
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    sessionExpiry: state.auth.sessionExpiry,
    setUser: state.setUser,
    setToken: state.setToken,
    logout: state.logout,
    updateUserPreferences: state.updateUserPreferences
  }));
}

// Students hooks
export function useStudents() {
  return useGlobalStore((state) => ({
    students: state.students.profiles,
    activeStudentId: state.students.activeStudentId,
    loadingStates: state.students.loadingStates,
    setStudents: state.setStudents,
    addStudent: state.addStudent,
    updateStudent: state.updateStudent,
    setActiveStudent: state.setActiveStudent,
    removeStudent: state.removeStudent
  }));
}

export function useActiveStudent() {
  return useGlobalStore((state) => {
    const activeId = state.students.activeStudentId;
    const student = activeId ? state.students.profiles[activeId] : null;
    return {
      activeStudent: student,
      activeStudentId: activeId,
      setActiveStudent: state.setActiveStudent
    };
  });
}

// Learning hooks
export function useLearning() {
  return useGlobalStore((state) => ({
    currentSession: state.learning.currentSession,
    recentActivities: state.learning.recentActivities,
    focusMetrics: state.learning.focusMetrics,
    gamificationData: state.learning.gamificationData,
    startLearningSession: state.startLearningSession,
    updateLearningSession: state.updateLearningSession,
    endLearningSession: state.endLearningSession,
    addActivity: state.addActivity,
    updateProgress: state.updateProgress
  }));
}

// Sync hooks
export function useSync() {
  return useGlobalStore((state) => ({
    syncStatus: state.sync.status,
    offlineActions: state.sync.offlineActions,
    conflicts: state.sync.conflicts,
    addOfflineAction: state.addOfflineAction,
    removeOfflineAction: state.removeOfflineAction,
    updateSyncStatus: state.updateSyncStatus,
    syncWithServer: state.syncWithServer
  }));
}

export function useOnlineStatus() {
  return useGlobalStore((state) => state.sync.status.isOnline);
}

// UI hooks
export function useUI() {
  return useGlobalStore((state) => ({
    theme: state.ui.theme,
    sidebarOpen: state.ui.sidebarOpen,
    notifications: state.ui.notifications,
    modals: state.ui.modals,
    setTheme: state.setTheme,
    toggleSidebar: state.toggleSidebar,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    openModal: state.openModal,
    closeModal: state.closeModal
  }));
}

export function useNotifications() {
  return useGlobalStore((state) => ({
    notifications: state.ui.notifications,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification
  }));
}

export function useTheme() {
  return useGlobalStore((state) => ({
    theme: state.ui.theme,
    setTheme: state.setTheme
  }));
}

// Cross-portal hooks
export function useCrossPortal() {
  return useGlobalStore((state) => ({
    portals: state.portals,
    broadcastMessage: state.broadcastMessage,
    syncWithPortal: state.syncWithPortal
  }));
}

// Utility hooks
export function useStateManagement() {
  return useGlobalStore((state) => ({
    resetState: state.resetState,
    exportState: state.exportState,
    importState: state.importState
  }));
}