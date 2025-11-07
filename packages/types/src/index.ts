// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// Learning Types
export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'K5' | 'MS' | 'HS';
  subject: string;
  lessonsCount: number;
  progress?: number;
  mentor?: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'video' | 'interactive' | 'assessment' | 'reading';
  duration: number; // in minutes
  completed: boolean;
  order: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'baseline' | 'quiz' | 'test' | 'project';
  questions: AssessmentQuestion[];
  timeLimit?: number; // in minutes
  attempts: number;
  maxAttempts: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

// Progress and Analytics Types
export interface LearningProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLesson: string;
  overallProgress: number; // percentage
  timeSpent: number; // in minutes
  lastActivity: Date;
}

export interface LearningStats {
  totalTimeSpent: number;
  lessonsCompleted: number;
  assessmentsCompleted: number;
  averageScore: number;
  streak: number; // days
  focusTime: number; // minutes today
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// IEP Types
export interface IEPGoal {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100 percentage
  targetDate: string;
  category: string;
}

export interface IEPMeeting {
  date: string;
  type: string;
  participants: string[];
}

export interface IEPData {
  childName: string;
  grade: string;
  studentId: string;
  schoolYear: string;
  activeGoals: IEPGoal[];
  upcomingMeetings: IEPMeeting[];
  accommodations: string[];
  services: string[];
}

// Theme and UI Types
export type Theme = 'K5' | 'MS' | 'HS';
export type ColorMode = 'light' | 'dark';

export interface UIConfig {
  theme: Theme;
  colorMode: ColorMode;
  enableAnimations: boolean;
  enableFocusMode: boolean;
}