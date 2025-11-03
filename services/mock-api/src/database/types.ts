// Database types and interfaces
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'parent' | 'teacher' | 'admin' | 'learner';
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    timezone?: string;
    preferences?: any;
  };
  mfa?: {
    secret: string;
    enabled: boolean;
    backupCodes: string[];
  };
  children?: string[]; // For parents
  students?: string[]; // For teachers
  createdAt: string;
  lastActive: string;
}

export interface Child {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  avatar?: string;
  learningProfile: {
    interests: string[];
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    focusLevel: number; // 1-10
    motivation: string[];
  };
  currentAssessment?: {
    id: string;
    progress: number;
    skillVector: Record<string, number>;
    recommendations: string[];
  };
  iepGoals?: IEPGoal[];
  progressHistory: ProgressEntry[];
}

export interface IEPGoal {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'behavioral' | 'communication' | 'social' | 'motor';
  targetDate: string;
  progress: number;
  milestones: {
    id: string;
    description: string;
    completed: boolean;
    completedDate?: string;
  }[];
}

export interface Assessment {
  id: string;
  childId: string;
  type: 'baseline' | 'progress' | 'diagnostic';
  subject: string;
  questions: AssessmentQuestion[];
  responses: AssessmentResponse[];
  skillVector: Record<string, number>;
  adaptivePath: string[];
  startedAt: string;
  completedAt?: string;
  estimatedAbility: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'drag-drop' | 'drawing' | 'audio-response';
  content: string;
  options?: string[];
  correctAnswer: string | number;
  skillAreas: string[];
  difficulty: number; // 0-1
  metadata: {
    estimatedTime: number;
    accessibility: string[];
  };
}

export interface AssessmentResponse {
  questionId: string;
  answer: any;
  timeSpent: number;
  correct: boolean;
  confidence: number;
  focusMetrics: {
    mouseMovements: number;
    keystrokes: number;
    tabSwitches: number;
  };
}

export interface ProgressEntry {
  date: string;
  subject: string;
  skillsImproved: string[];
  timeSpent: number;
  activitiesCompleted: number;
  focusScore: number;
}

export interface LearningSession {
  id: string;
  childId: string;
  activityType: 'lesson' | 'game' | 'assessment' | 'practice';
  subject: string;
  startTime: string;
  endTime?: string;
  focusMetrics: {
    averageFocus: number;
    distractionEvents: number;
    engagementScore: number;
  };
  learningOutcomes: string[];
}

export interface LearningActivity {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'game' | 'assessment' | 'practice';
  subject: string;
  skillAreas: string[];
  difficulty: number;
  estimatedTime: number;
  interactiveElements: {
    type: 'video' | 'animation' | 'game' | 'quiz' | 'drawing';
    content: any;
  }[];
  adaptiveFeatures: {
    difficultyAdjustment: boolean;
    personalizedFeedback: boolean;
    realTimeSupport: boolean;
  };
}