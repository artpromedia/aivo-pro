import type { StateCreator } from 'zustand';
import type { GlobalState, LearningSession } from '../types';

export interface LearningSlice {
  startLearningSession: (session: LearningSession) => void;
  updateLearningSession: (updates: Partial<LearningSession>) => void;
  endLearningSession: () => void;
  addActivity: (activity: any) => void;
  updateProgress: (studentId: string, progress: any) => void;
}

export const createLearningSlice: StateCreator<
  GlobalState & LearningSlice,
  [['zustand/immer', never]],
  [],
  LearningSlice
> = (set, get) => ({
  startLearningSession: (session: LearningSession) =>
    set((state: any) => {
      state.learning.currentSession = session;
    }),

  updateLearningSession: (updates: Partial<LearningSession>) =>
    set((state: any) => {
      if (state.learning.currentSession) {
        state.learning.currentSession = {
          ...state.learning.currentSession,
          ...updates,
          lastActivityAt: new Date().toISOString()
        };
      }
    }),

  endLearningSession: () =>
    set((state: any) => {
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

  addActivity: (activity: any) =>
    set((state: any) => {
      state.learning.recentActivities.unshift({
        ...activity,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 100 activities
      if (state.learning.recentActivities.length > 100) {
        state.learning.recentActivities = state.learning.recentActivities.slice(0, 100);
      }
    }),

  updateProgress: (studentId: string, progress: any) =>
    set((state: any) => {
      if (state.students.profiles[studentId]) {
        state.students.profiles[studentId].learningProgress = {
          ...state.students.profiles[studentId].learningProgress,
          ...progress,
          lastActivityAt: new Date().toISOString()
        };
      }
    })
});