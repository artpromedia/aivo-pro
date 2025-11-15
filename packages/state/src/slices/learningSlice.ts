import type { StateCreator } from 'zustand';
import type { GlobalState, LearningSession } from '../types';

export interface LearningSlice {
  startLearningSession: (session: LearningSession) => void;
  updateLearningSession: (updates: Partial<LearningSession>) => void;
  endLearningSession: () => void;
  addActivity: (activity: unknown) => void;
  updateProgress: (studentId: string, progress: Record<string, unknown>) => void;
}

export const createLearningSlice: StateCreator<
  GlobalState & LearningSlice,
  [['zustand/immer', never]],
  [],
  LearningSlice
> = (set, _get, _store) => ({
  startLearningSession: (session: LearningSession) =>
    set((state) => {
      state.learning.currentSession = session;
    }),

  updateLearningSession: (updates: Partial<LearningSession>) =>
    set((state) => {
      if (state.learning.currentSession) {
        state.learning.currentSession = {
          ...state.learning.currentSession,
          ...updates,
          lastActivityAt: new Date().toISOString()
        };
      }
    }),

  endLearningSession: () =>
    set((state) => {
      if (state.learning.currentSession) {
        // Archive the session to recent activities
        state.learning.recentActivities.unshift({
          ...state.learning.currentSession,
          endedAt: new Date().toISOString()
        });
        
        // Keep only last 50 activities
        if (state.learning.recentActivities.length > 50) {
          state.learning.recentActivities = state.learning.recentActivities.slice(0, 50);
        }
        
        state.learning.currentSession = null;
      }
    }),

  addActivity: (activity: unknown) =>
    set((state) => {
      state.learning.recentActivities.unshift({
        ...(activity as Record<string, unknown>),
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 100 activities
      if (state.learning.recentActivities.length > 100) {
        state.learning.recentActivities = state.learning.recentActivities.slice(0, 100);
      }
    }),

  updateProgress: (studentId: string, progress: Record<string, unknown>) =>
    set((state) => {
      if (state.students.profiles[studentId]) {
        state.students.profiles[studentId].learningProgress = {
          ...state.students.profiles[studentId].learningProgress,
          ...progress,
          lastActivityAt: new Date().toISOString()
        };
      }
    })
});