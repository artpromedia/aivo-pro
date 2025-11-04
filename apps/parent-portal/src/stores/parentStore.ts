import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  grade: number;
  zipCode: string;
  disabilities?: string[];
  hasIEP: boolean;
  avatar?: string;
  progress: {
    overall: number;
    subjects: {
      math: number;
      reading: number;
      science: number;
      socialStudies: number;
    };
  };
  currentActivity?: {
    subject: string;
    lesson: string;
    timeSpent: number;
  };
  weeklyStats: {
    hoursLearned: number;
    skillsMastered: number;
    avgScore: number;
  };
}

export interface Suggestion {
  id: string;
  childId: string;
  type: 'homework_help' | 'skill_practice' | 'enrichment' | 'intervention';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  estimatedTime: number;
  subject: string;
}

export interface Activity {
  id: string;
  childId: string;
  childName: string;
  type: 'lesson_completed' | 'skill_mastered' | 'achievement_unlocked' | 'homework_submitted';
  title: string;
  description: string;
  timestamp: string;
  subject?: string;
  score?: number;
  icon: string;
}

export interface DashboardStats {
  avgProgress: number;
  totalHours: number;
  skillsMastered: number;
  activeChildren: number;
}

interface ParentStore {
  // State
  children: Child[];
  suggestions: Suggestion[];
  activities: Activity[];
  stats: DashboardStats | null;
  selectedChild: Child | null;
  
  // Actions
  setChildren: (children: Child[]) => void;
  addChild: (child: Child) => void;
  updateChild: (childId: string, updates: Partial<Child>) => void;
  removeChild: (childId: string) => void;
  
  setSuggestions: (suggestions: Suggestion[]) => void;
  updateSuggestion: (suggestionId: string, status: 'approved' | 'rejected') => void;
  
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Activity) => void;
  
  setStats: (stats: DashboardStats) => void;
  setSelectedChild: (child: Child | null) => void;
}

export const useParentStore = create<ParentStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      children: [],
      suggestions: [],
      activities: [],
      stats: null,
      selectedChild: null,
      
      // Actions
      setChildren: (children) => set({ children }, false, 'setChildren'),
      
      addChild: (child) =>
        set(
          (state) => ({ children: [...state.children, child] }),
          false,
          'addChild'
        ),
      
      updateChild: (childId, updates) =>
        set(
          (state) => ({
            children: state.children.map((child) =>
              child.id === childId ? { ...child, ...updates } : child
            ),
          }),
          false,
          'updateChild'
        ),
      
      removeChild: (childId) =>
        set(
          (state) => ({
            children: state.children.filter((child) => child.id !== childId),
          }),
          false,
          'removeChild'
        ),
      
      setSuggestions: (suggestions) =>
        set({ suggestions }, false, 'setSuggestions'),
      
      updateSuggestion: (suggestionId, status) =>
        set(
          (state) => ({
            suggestions: state.suggestions.map((suggestion) =>
              suggestion.id === suggestionId
                ? { ...suggestion, status }
                : suggestion
            ),
          }),
          false,
          'updateSuggestion'
        ),
      
      setActivities: (activities) => set({ activities }, false, 'setActivities'),
      
      addActivity: (activity) =>
        set(
          (state) => ({ activities: [activity, ...state.activities] }),
          false,
          'addActivity'
        ),
      
      setStats: (stats) => set({ stats }, false, 'setStats'),
      
      setSelectedChild: (selectedChild) =>
        set({ selectedChild }, false, 'setSelectedChild'),
    }),
    {
      name: 'parent-store',
    }
  )
);