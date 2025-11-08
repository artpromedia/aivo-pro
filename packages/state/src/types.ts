// Portal identifiers
export enum PortalType {
  WEB = 'web',
  PARENT_PORTAL = 'parent-portal',
  TEACHER_PORTAL = 'teacher-portal',
  LEARNER_APP = 'learner-app',
  BASELINE_ASSESSMENT = 'baseline-assessment',
  DISTRICT_PORTAL = 'district-portal',
  SUPER_ADMIN = 'super-admin',
  MODEL_CLONING = 'model-cloning',
  MOBILE = 'mobile'
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt: string;
}

export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  DISTRICT_ADMIN = 'district_admin'
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  digest: 'none' | 'daily' | 'weekly';
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

// Student profiles
export interface StudentProfile {
  id: string;
  userId: string;
  parentId: string;
  name: string;
  age: number;
  grade: string;
  baselineResults?: BaselineResults;
  aiModelCloned: boolean;
  personalizedContent?: PersonalizedContent;
  learningProgress: LearningProgress;
  currentSession?: LearningSession;
}

export interface BaselineResults {
  mathLevel: number;
  readingLevel: number;
  scienceLevel: number;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  interests: string[];
  strengths: string[];
  needsImprovement: string[];
  completedAt: string;
}

export interface PersonalizedContent {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preferredActivities: string[];
  customCurriculum: CurriculumItem[];
}

export interface CurriculumItem {
  id: string;
  subject: string;
  topic: string;
  difficulty: number;
  estimatedDuration: number;
  prerequisiteIds: string[];
}

export interface LearningProgress {
  totalTimeSpent: number;
  subjectsProgress: Record<string, SubjectProgress>;
  streakDays: number;
  lastActivityAt: string;
  achievements: Achievement[];
}

export interface SubjectProgress {
  subject: string;
  level: number;
  xp: number;
  timeSpent: number;
  completedLessons: string[];
  currentLesson?: string;
  masteredSkills: string[];
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LearningSession {
  id: string;
  studentId: string;
  startedAt: string;
  lastActivityAt: string;
  currentSubject?: string;
  currentActivity?: string;
  focusScore: number;
  breaks: number;
}

// State management types
export interface StateSlice {
  name: string;
  version: number;
  lastUpdated: string;
  portalId: string;
}

export interface ConflictResolution {
  strategy: 'server' | 'local' | 'merge' | 'manual';
  resolvedAt: string;
  resolvedBy: string;
}

export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
  portalId: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncAt: string;
  pendingActions: number;
  conflictsCount: number;
  isSyncing: boolean;
}

// Cross-portal communication
export interface CrossPortalMessage {
  id: string;
  type: string;
  payload: any;
  sourcePortal: PortalType;
  targetPortal?: PortalType;
  timestamp: string;
  userId: string;
}

// State store structure
export interface GlobalState {
  // Authentication
  auth: {
    currentUser: User | null;
    token: string | null;
    isAuthenticated: boolean;
    sessionExpiry: string | null;
  };

  // Students data
  students: {
    profiles: Record<string, StudentProfile>;
    activeStudentId: string | null;
    loadingStates: Record<string, boolean>;
  };

  // Learning data
  learning: {
    currentSession: LearningSession | null;
    recentActivities: any[];
    focusMetrics: any[];
    gamificationData: any;
  };

  // Portal-specific data
  portals: Record<PortalType, any>;

  // Sync and offline support
  sync: {
    status: SyncStatus;
    offlineActions: OfflineAction[];
    conflicts: any[];
  };

  // UI state
  ui: {
    theme: string;
    sidebarOpen: boolean;
    notifications: any[];
    modals: Record<string, any>;
  };
}