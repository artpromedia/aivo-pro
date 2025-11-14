/**
 * Model Cloning Manager
 * Handles student-specific AI model cloning and status tracking
 */

import { aiBrainService, CloneRequest, CloneStatus } from '@aivo/ui';

interface StudentProfile {
  id: string;
  name: string;
  age: number;
  grade: number;
  learningStyle?: string;
  disabilities?: string[];
  specialNeeds?: string[];
  interests?: string[];
  baselineResults?: any;
}

interface CloneInfo {
  cloneId: string;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
  progress: number;
  createdAt: Date;
}

const CLONE_STORAGE_KEY = 'aivo_student_clone';

export class ModelCloningManager {
  /**
   * Check if student has a cloned model
   */
  static hasClonedModel(studentId: string): boolean {
    const stored = localStorage.getItem(`${CLONE_STORAGE_KEY}_${studentId}`);
    if (!stored) return false;

    try {
      const cloneInfo: CloneInfo = JSON.parse(stored);
      return cloneInfo.status === 'complete';
    } catch {
      return false;
    }
  }

  /**
   * Get clone status for student
   */
  static getCloneInfo(studentId: string): CloneInfo | null {
    const stored = localStorage.getItem(`${CLONE_STORAGE_KEY}_${studentId}`);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  /**
   * Start cloning process for student
   */
  static async startCloning(
    profile: StudentProfile,
    onProgress?: (status: CloneStatus) => void
  ): Promise<CloneInfo> {
    // Check if already cloned
    const existing = this.getCloneInfo(profile.id);
    if (existing && existing.status === 'complete') {
      console.log('Student already has cloned model:', existing.cloneId);
      return existing;
    }

    try {
      // Prepare cloning request
      const cloneRequest: CloneRequest = {
        student_id: profile.id,
        student_profile: {
          name: profile.name,
          age: profile.age,
          grade: profile.grade,
          learning_style: profile.learningStyle || 'visual',
          disabilities: profile.disabilities || [],
          special_needs: profile.specialNeeds || [],
          interests: profile.interests || [],
        },
        baseline_data: profile.baselineResults || {},
      };

      console.log('Starting model cloning for student:', profile.id);

      // Start cloning
      const cloneResponse = await aiBrainService.startCloning(cloneRequest);

      // Store initial status
      const cloneInfo: CloneInfo = {
        cloneId: cloneResponse.clone_id,
        status: 'in-progress',
        progress: 0,
        createdAt: new Date(),
      };
      localStorage.setItem(`${CLONE_STORAGE_KEY}_${profile.id}`, JSON.stringify(cloneInfo));

      // Wait for completion
      console.log('Waiting for clone completion:', cloneResponse.clone_id);
      const finalStatus = await aiBrainService.waitForCloning(
        cloneResponse.clone_id,
        (status) => {
          // Update progress
          const updatedInfo: CloneInfo = {
            cloneId: cloneResponse.clone_id,
            status: 'in-progress',
            progress: status.progress,
            createdAt: cloneInfo.createdAt,
          };
          localStorage.setItem(`${CLONE_STORAGE_KEY}_${profile.id}`, JSON.stringify(updatedInfo));
          
          if (onProgress) {
            onProgress(status);
          }
        }
      );

      // Update to complete
      const completedInfo: CloneInfo = {
        cloneId: cloneResponse.clone_id,
        status: 'complete',
        progress: 100,
        createdAt: cloneInfo.createdAt,
      };
      localStorage.setItem(`${CLONE_STORAGE_KEY}_${profile.id}`, JSON.stringify(completedInfo));

      console.log('Model cloning completed:', cloneResponse.clone_id);
      return completedInfo;
    } catch (error) {
      console.error('Model cloning failed:', error);
      
      // Store error status
      const errorInfo: CloneInfo = {
        cloneId: '',
        status: 'error',
        progress: 0,
        createdAt: new Date(),
      };
      localStorage.setItem(`${CLONE_STORAGE_KEY}_${profile.id}`, JSON.stringify(errorInfo));
      
      throw error;
    }
  }

  /**
   * Check clone status
   */
  static async checkCloneStatus(
    studentId: string,
    cloneId: string
  ): Promise<CloneStatus | null> {
    try {
      return await aiBrainService.getCloneStatus(cloneId);
    } catch (error) {
      console.error('Failed to check clone status:', error);
      return null;
    }
  }

  /**
   * Clear clone data (for testing/reset)
   */
  static clearCloneData(studentId: string): void {
    localStorage.removeItem(`${CLONE_STORAGE_KEY}_${studentId}`);
  }

  /**
   * Initialize cloning for student if needed
   */
  static async initializeForStudent(
    profile: StudentProfile,
    onProgress?: (status: CloneStatus) => void
  ): Promise<boolean> {
    // Check if already has model
    if (this.hasClonedModel(profile.id)) {
      console.log('Student already has cloned model');
      return true;
    }

    // Check if baseline assessment is complete
    if (!profile.baselineResults) {
      console.log('Baseline assessment not complete, skipping cloning');
      return false;
    }

    try {
      await this.startCloning(profile, onProgress);
      return true;
    } catch (error) {
      console.error('Failed to initialize cloning:', error);
      return false;
    }
  }
}

/**
 * React hook for model cloning
 */
export const useModelCloning = (studentId: string) => {
  const [cloneInfo, setCloneInfo] = React.useState<CloneInfo | null>(null);
  const [isCloning, setIsCloning] = React.useState(false);

  React.useEffect(() => {
    const info = ModelCloningManager.getCloneInfo(studentId);
    setCloneInfo(info);
  }, [studentId]);

  const startCloning = async (
    profile: StudentProfile,
    onProgress?: (status: CloneStatus) => void
  ) => {
    setIsCloning(true);
    try {
      const info = await ModelCloningManager.startCloning(profile, (status) => {
        setCloneInfo({
          cloneId: info?.cloneId || '',
          status: 'in-progress',
          progress: status.progress,
          createdAt: info?.createdAt || new Date(),
        });
        onProgress?.(status);
      });
      setCloneInfo(info);
      return info;
    } finally {
      setIsCloning(false);
    }
  };

  const hasClonedModel = ModelCloningManager.hasClonedModel(studentId);

  return {
    cloneInfo,
    hasClonedModel,
    isCloning,
    startCloning,
  };
};

// Re-export for convenience
import React from 'react';
