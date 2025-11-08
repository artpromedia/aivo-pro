import React from 'react';

// Core D3 Visualization Types
export interface DataPoint {
  id: string;
  label: string;
  value: number;
  timestamp?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface VisualizationConfig {
  responsive?: boolean;
  animated?: boolean;
  interactive?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  colorScheme?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
}

// Learning Progress Types
export interface LearningProgressData {
  subject: string;
  level: number;
  xp: number;
  timeSpent: number; // in minutes
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  streakDays: number;
  lastActivity: string;
  weeklyProgress: ProgressPoint[];
  skillsProgress: SkillProgress[];
}

export interface ProgressPoint {
  date: string;
  value: number;
  type: 'xp' | 'time' | 'lessons' | 'score';
}

export interface SkillProgress {
  skill: string;
  level: number;
  maxLevel: number;
  masteryPercentage: number;
  prerequisites: string[];
  isUnlocked: boolean;
  completedAt?: string;
}

// Skill Tree Types
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: number;
  isCompleted: boolean;
  isAvailable: boolean;
  prerequisites: string[];
  children: string[];
  position?: { x: number; y: number };
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  xpReward: number;
  icon?: string;
  color?: string;
  progress: number; // 0-100
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

export interface SkillTreeData {
  id: string;
  name: string;
  description?: string;
  level: number;
  isCompleted: boolean;
  isAvailable: boolean;
  prerequisites: string[];
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  xpReward: number;
  icon?: string;
  color?: string;
  progress: number; // 0-100
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  children?: SkillTreeData[];
  x?: number;
  y?: number;
}

export interface SkillConnection {
  source: string;
  target: string;
  type: 'prerequisite' | 'progression' | 'optional';
  isActive: boolean;
}

// Analytics Dashboard Types
export interface AnalyticsData {
  overview: OverviewMetrics;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
  timeAnalysis: TimeAnalysisData;
  subjectBreakdown: SubjectMetrics[];
  comparativeData: ComparativeMetrics;
}

export interface OverviewMetrics {
  totalStudents: number;
  totalLessons: number;
  averageProgress: number;
  completionRate: number;
  activeUsers: number;
  retentionRate: number;
  satisfactionScore: number;
}

export interface EngagementMetrics {
  dailyActiveUsers: TimeSeriesPoint[];
  sessionDuration: TimeSeriesPoint[];
  lessonCompletions: TimeSeriesPoint[];
  interactionRate: number;
  bounceRate: number;
  returnVisitors: number;
}

export interface PerformanceMetrics {
  averageScores: SubjectScores[];
  improvementRate: number;
  strugglingAreas: string[];
  topPerformers: StudentMetric[];
  learningVelocity: TimeSeriesPoint[];
  adaptationEffectiveness: number;
}

export interface TimeAnalysisData {
  peakUsageHours: HourlyUsage[];
  weeklyPatterns: DayUsage[];
  sessionLengths: SessionData[];
  timeToCompletion: CompletionTime[];
}

export interface SubjectMetrics {
  subject: string;
  totalTime: number;
  averageScore: number;
  completionRate: number;
  difficulty: number;
  engagement: number;
  studentCount: number;
  trendsData: TimeSeriesPoint[];
}

export interface ComparativeMetrics {
  gradeComparison: GradeComparison[];
  schoolComparison: SchoolComparison[];
  nationalBenchmarks: BenchmarkData[];
  historicalTrends: TrendData[];
}

// Supporting Types
export interface TimeSeriesPoint {
  date: string;
  value: number;
  category?: string;
}

export interface SubjectScores {
  subject: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface StudentMetric {
  id: string;
  name: string;
  score: number;
  improvement: number;
  subject: string;
}

export interface HourlyUsage {
  hour: number;
  usage: number;
  engagement: number;
}

export interface DayUsage {
  day: string;
  usage: number;
  completion: number;
}

export interface SessionData {
  duration: number;
  frequency: number;
  completion: number;
}

export interface CompletionTime {
  lesson: string;
  averageTime: number;
  fastestTime: number;
  slowestTime: number;
}

export interface GradeComparison {
  grade: string;
  performance: number;
  engagement: number;
  completion: number;
}

export interface SchoolComparison {
  school: string;
  performance: number;
  studentCount: number;
  rank: number;
}

export interface BenchmarkData {
  metric: string;
  current: number;
  benchmark: number;
  percentile: number;
}

export interface TrendData {
  period: string;
  value: number;
  growth: number;
}

// Chart Component Props
export interface BaseChartProps {
  data: any[];
  dimensions?: Partial<ChartDimensions>;
  config?: Partial<VisualizationConfig>;
  className?: string;
  onDataPointClick?: (data: any) => void;
  onDataPointHover?: (data: any) => void;
}

// Specific Chart Types
export interface ProgressChartProps extends BaseChartProps {
  data: LearningProgressData[];
  timeRange?: '7d' | '30d' | '90d' | '1y';
  showTrendLine?: boolean;
  compareSubjects?: boolean;
}

export interface SkillTreeProps {
  data: SkillTreeData;
  dimensions?: Partial<ChartDimensions>;
  config?: Partial<VisualizationConfig>;
  className?: string;
  layout?: 'tree' | 'force' | 'radial';
  showProgress?: boolean;
  interactive?: boolean;
  onSkillClick?: (skill: SkillTreeData) => void;
  onNodeClick?: (node: SkillNode) => void;
  onNodeHover?: (node: SkillNode) => void;
}

export interface AnalyticsDashboardProps {
  data: AnalyticsData;
  viewMode?: 'student' | 'teacher' | 'admin';
  timeRange?: string;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  className?: string;
}

// Animation and Interaction Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  stagger?: number;
}

export interface TooltipData {
  title: string;
  content: string | React.ReactNode;
  position: { x: number; y: number };
  visible: boolean;
}

export interface LegendItem {
  label: string;
  color: string;
  value?: number;
  isActive: boolean;
}

// Export utility types
export type ColorScale = (value: number) => string;
export type Scale = (value: number) => number;
export type Accessor<T, R = number> = (d: T) => R;