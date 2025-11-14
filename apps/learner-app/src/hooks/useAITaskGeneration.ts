/**
 * Hook for AI-powered task generation
 * Replaces the old template-based useTaskGeneration
 */

import { useState, useCallback } from 'react';
import { aiTaskGenerator, GeneratedTask } from '../services/AITaskGenerationService';

export interface AITaskOptions {
  subject: string;
  skill?: string;
  difficulty: number;
  count?: number;
  useClonedModel?: boolean;
}

export interface Task {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'written' | 'drawing' | 'matching';
  subject: string;
  difficulty: number;
  content: {
    question: string;
    answer: string;
    hint?: string;
    options?: string[];
  };
  hints: string[];
  correctAnswer: string;
  explanation: string;
  skillTags: string[];
}

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade: number;
  learningStyle?: string;
  disabilities?: string[];
  specialNeeds?: string[];
  baselineResults?: {
    actualGrade?: string;
    mathLevel?: number;
    readingLevel?: number;
    scienceLevel?: number;
  };
}

const getCurrentProfile = (): ChildProfile | null => {
  const saved = localStorage.getItem('aivoChildProfile');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const useAITaskGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate tasks using AI
   */
  const generateTasks = useCallback(
    async (options: AITaskOptions): Promise<Task[]> => {
      const currentProfile = getCurrentProfile();
      
      if (!currentProfile) {
        console.error('No profile available for task generation');
        return [];
      }

      setIsGenerating(true);
      setError(null);

      try {
        const gradeLevel = currentProfile.baselineResults?.actualGrade || 
                          currentProfile.grade.toString();
        
        const disabilities = [
          ...(currentProfile.disabilities || []),
          ...(currentProfile.specialNeeds || []),
        ];

        const generatedTasks = await aiTaskGenerator.generateTasks({
          subject: options.subject,
          skill: options.skill,
          gradeLevel,
          difficulty: options.difficulty / 5, // Convert 0-5 scale to 0-1
          count: options.count || 5,
          studentId: currentProfile.id,
          learningStyle: currentProfile.learningStyle as any,
          disabilities,
          useClonedModel: options.useClonedModel,
        });

        // Convert to Task format
        const tasks: Task[] = generatedTasks.map((gt) => ({
          id: gt.id,
          type: 'multiple-choice', // Can be enhanced based on content type
          subject: gt.subject,
          difficulty: Math.round(gt.difficulty * 5), // Convert back to 0-5 scale
          content: {
            question: gt.question,
            answer: gt.answer,
            hint: gt.hint,
          },
          hints: gt.hint ? [gt.hint] : ['Think about what you learned'],
          correctAnswer: gt.answer,
          explanation: gt.explanation || '',
          skillTags: [gt.skill],
        }));

        setIsGenerating(false);
        return tasks;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to generate tasks';
        setError(errorMsg);
        setIsGenerating(false);
        console.error('Task generation error:', err);
        return [];
      }
    },
    []
  );

  /**
   * Generate a lesson using AI
   */
  const generateLesson = useCallback(
    async (subject: string, skill: string) => {
      const currentProfile = getCurrentProfile();
      
      console.log('🎓 Generate lesson called:', { subject, skill, hasProfile: !!currentProfile });
      
      if (!currentProfile) {
        console.error('❌ No profile available for lesson generation');
        console.log('💡 Tip: Complete baseline assessment or create a profile first');
        return null;
      }

      try {
        const gradeLevel = currentProfile.baselineResults?.actualGrade || 
                          currentProfile.grade.toString();
        
        const disabilities = [
          ...(currentProfile.disabilities || []),
          ...(currentProfile.specialNeeds || []),
        ];

        console.log('📚 Calling AI lesson generator with:', {
          subject,
          skill,
          gradeLevel,
          studentId: currentProfile.id,
          learningStyle: currentProfile.learningStyle,
          disabilities: disabilities.length
        });

        const lesson = await aiTaskGenerator.generateLesson(
          subject,
          skill,
          gradeLevel,
          currentProfile.id,
          currentProfile.learningStyle,
          disabilities
        );

        if (lesson) {
          console.log('✅ Generated lesson with', lesson.length, 'steps');
        } else {
          console.warn('⚠️ AI returned null lesson');
        }

        return lesson;
      } catch (err) {
        console.error('❌ Lesson generation error:', err);
        if (err instanceof Error) {
          console.error('Error details:', err.message, err.stack);
        }
        return null;
      }
    },
    []
  );

  /**
   * Assess student response using AI
   */
  const assessResponse = useCallback(
    async (studentResponse: string, task: GeneratedTask) => {
      const currentProfile = getCurrentProfile();
      
      if (!currentProfile) {
        return null;
      }

      try {
        const assessment = await aiTaskGenerator.assessResponse(
          studentResponse,
          task,
          currentProfile.id
        );

        return assessment;
      } catch (err) {
        console.error('Assessment error:', err);
        return null;
      }
    },
    []
  );

  return {
    generateTasks,
    generateLesson,
    assessResponse,
    isGenerating,
    error,
  };
};
