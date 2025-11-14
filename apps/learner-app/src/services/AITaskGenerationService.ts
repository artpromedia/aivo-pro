/**
 * AI Task Generation Service
 * 
 * Replaces static templates with ACTUAL AI-powered content generation
 * Integrates with curriculum-content-svc and aivo-brain-svc
 */

import { aiBrainService, StudentContext } from '@aivo/ui';
import { ModelCloningManager } from './ModelCloningManager';

const CURRICULUM_CONTENT_URL = import.meta.env.VITE_CURRICULUM_CONTENT_URL || 'http://localhost:8006';

export interface TaskGenerationRequest {
  subject: string;
  skill?: string;
  gradeLevel: string;
  difficulty: number; // 0.0 to 1.0
  count?: number;
  studentId: string;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  disabilities?: string[];
  useClonedModel?: boolean;
}

export interface GeneratedTask {
  id: string;
  subject: string;
  skill: string;
  gradeLevel: string;
  difficulty: number;
  question: string;
  answer: string;
  hint?: string;
  explanation?: string;
  visual?: string;
  metadata?: Record<string, any>;
}

export interface LessonContent {
  id: string;
  type: 'introduction' | 'concept' | 'example' | 'interactive' | 'summary';
  title: string;
  content: string;
  visual?: string;
  duration: number;
  interactive?: {
    type: 'multiple-choice' | 'type' | 'drag-drop' | 'draw';
    instruction: string;
    answer: string;
    options?: string[];
  };
}

export class AITaskGenerationService {
  /**
   * Generate tasks dynamically using AI
   */
  async generateTasks(request: TaskGenerationRequest): Promise<GeneratedTask[]> {
    try {
      // Check if student has cloned model
      const hasClonedModel = request.useClonedModel !== false && 
                            ModelCloningManager.hasClonedModel(request.studentId);
      
      if (hasClonedModel) {
        console.log('Using cloned model for student:', request.studentId);
      }

      // Build student context for personalization
      const studentContext: StudentContext = {
        student_id: request.studentId,
        grade: request.gradeLevel,
        subject: request.subject,
        learning_style: request.learningStyle,
        skill_level: this._mapDifficultyToSkillLevel(request.difficulty),
        disability: request.disabilities?.join(', '),
        accommodations: this._getAccommodations(request.disabilities),
      };

      // Call curriculum content service for base content generation
      const contentResponse = await fetch(`${CURRICULUM_CONTENT_URL}/v1/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: request.subject,
          grade_level: request.gradeLevel,
          skill_code: request.skill,
          difficulty: request.difficulty,
          content_type: 'problem',
          count: request.count || 5,
        }),
      });

      if (!contentResponse.ok) {
        throw new Error(`Content generation failed: ${contentResponse.statusText}`);
      }

      const contentData = await contentResponse.json();

      // Enhance each piece of content with AI personalization
      const tasks: GeneratedTask[] = [];
      for (const item of contentData.contents) {
        const enhancedTask = await this._enhanceWithAI(item, studentContext, request.useClonedModel);
        tasks.push(enhancedTask);
      }

      return tasks;
    } catch (error) {
      console.error('AI task generation failed:', error);
      // Fallback to basic generation if AI fails
      return this._fallbackGeneration(request);
    }
  }

  /**
   * Generate a complete lesson using AI
   */
  async generateLesson(
    subject: string,
    skill: string,
    gradeLevel: string,
    studentId: string,
    learningStyle?: string,
    disabilities?: string[]
  ): Promise<LessonContent[]> {
    const studentContext: StudentContext = {
      student_id: studentId,
      grade: gradeLevel,
      subject: subject,
      learning_style: learningStyle as any,
      disability: disabilities?.join(', '),
      accommodations: this._getAccommodations(disabilities),
    };

    try {
      // Generate lesson content using AI Brain
      const lessonPrompt = this._buildLessonPrompt(subject, skill, gradeLevel, learningStyle);
      
      const response = await aiBrainService.generateResponse({
        prompt: lessonPrompt,
        context: studentContext,
        max_tokens: 2000,
        temperature: 0.7,
      });

      // Parse AI response into lesson structure
      return this._parseAILessonResponse(response.response, subject, skill);
    } catch (error) {
      console.error('AI lesson generation failed:', error);
      // Return minimal fallback lesson
      return this._fallbackLesson(subject, skill, gradeLevel);
    }
  }

  /**
   * Generate a streaming lesson with real-time AI
   */
  async *streamLesson(
    subject: string,
    skill: string,
    gradeLevel: string,
    studentId: string,
    learningStyle?: string,
    disabilities?: string[]
  ): AsyncGenerator<string> {
    const studentContext: StudentContext = {
      student_id: studentId,
      grade: gradeLevel,
      subject: subject,
      learning_style: learningStyle as any,
      disability: disabilities?.join(', '),
      accommodations: this._getAccommodations(disabilities),
    };

    const lessonPrompt = this._buildLessonPrompt(subject, skill, gradeLevel, learningStyle);

    try {
      for await (const chunk of aiBrainService.streamResponse({
        prompt: lessonPrompt,
        context: studentContext,
        stream: true,
        temperature: 0.7,
      })) {
        yield chunk;
      }
    } catch (error) {
      console.error('Streaming lesson failed:', error);
      yield 'I apologize, but I encountered an error. Let me try to help you in a different way...';
    }
  }

  /**
   * Assess student response using AI
   */
  async assessResponse(
    studentResponse: string,
    task: GeneratedTask,
    studentId: string
  ): Promise<{
    correct: boolean;
    score: number;
    feedback: string;
    nextDifficulty: number;
  }> {
    try {
      const assessment = await aiBrainService.assessResponse(
        studentResponse,
        {
          subject: task.subject,
          grade: task.gradeLevel,
          learning_objective: task.skill,
        },
        task.answer
      );

      // Calculate next difficulty based on performance
      const currentDifficulty = task.difficulty;
      let nextDifficulty = currentDifficulty;

      if (assessment.correctness > 0.8) {
        // Excellent - increase difficulty
        nextDifficulty = Math.min(1.0, currentDifficulty + 0.1);
      } else if (assessment.correctness < 0.5) {
        // Struggling - decrease difficulty
        nextDifficulty = Math.max(0.0, currentDifficulty - 0.15);
      }

      return {
        correct: assessment.correctness > 0.7,
        score: assessment.correctness * 100,
        feedback: assessment.feedback,
        nextDifficulty,
      };
    } catch (error) {
      console.error('AI assessment failed:', error);
      // Simple fallback assessment
      const isCorrect = studentResponse.trim().toLowerCase() === task.answer.trim().toLowerCase();
      return {
        correct: isCorrect,
        score: isCorrect ? 100 : 0,
        feedback: isCorrect ? 'Great job!' : 'Not quite right. Try again!',
        nextDifficulty: task.difficulty,
      };
    }
  }

  /**
   * Enhance content with AI personalization
   */
  private async _enhanceWithAI(
    baseContent: any,
    studentContext: StudentContext,
    useClonedModel?: boolean
  ): Promise<GeneratedTask> {
    try {
      const enhancementPrompt = `
Enhance this learning task for a student:
Task: ${JSON.stringify(baseContent.content)}
Student Context: Grade ${studentContext.grade}, ${studentContext.learning_style} learner
${studentContext.disability ? `Accommodations needed: ${studentContext.disability}` : ''}

Provide:
1. A clear, engaging question appropriate for their level
2. The correct answer
3. A helpful hint if they get stuck
4. A brief explanation of the concept

Format as JSON: {"question": "...", "answer": "...", "hint": "...", "explanation": "..."}
`;

      const response = await aiBrainService.generateResponse({
        prompt: enhancementPrompt,
        context: studentContext,
        max_tokens: 500,
        temperature: 0.7,
      });

      // Parse AI response
      let enhanced;
      try {
        enhanced = JSON.parse(response.response);
      } catch {
        // If parsing fails, use base content with AI text as question
        enhanced = {
          question: response.response,
          answer: baseContent.content.answer || 'Check your work',
          hint: 'Think about what you learned',
          explanation: '',
        };
      }

      return {
        id: baseContent.id,
        subject: baseContent.subject,
        skill: baseContent.content.skill || 'general',
        gradeLevel: baseContent.grade_level,
        difficulty: baseContent.difficulty,
        question: enhanced.question,
        answer: enhanced.answer,
        hint: enhanced.hint,
        explanation: enhanced.explanation,
        metadata: {
          enhanced_with_ai: true,
          cloned_model_used: useClonedModel,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Enhancement failed, using base content:', error);
      return {
        id: baseContent.id,
        subject: baseContent.subject,
        skill: baseContent.content.skill || 'general',
        gradeLevel: baseContent.grade_level,
        difficulty: baseContent.difficulty,
        question: baseContent.content.question || baseContent.content.problem || 'Practice problem',
        answer: baseContent.content.answer || 'answer',
        hint: baseContent.content.hint,
        explanation: baseContent.content.explanation,
      };
    }
  }

  /**
   * Build lesson generation prompt
   */
  private _buildLessonPrompt(
    subject: string,
    skill: string,
    gradeLevel: string,
    learningStyle?: string
  ): string {
    const styleHint = learningStyle
      ? `This student learns best through ${learningStyle} methods.`
      : '';

    return `
Create an engaging lesson on ${skill} for ${subject} at grade ${gradeLevel} level.
${styleHint}

Structure the lesson with:
1. INTRODUCTION: Welcome and hook (make it exciting!)
2. CONCEPT: Explain the core concept clearly
3. EXAMPLE: Show a concrete example
4. PRACTICE: Interactive question they can try
5. SUMMARY: Key takeaways

Use age-appropriate language, include emojis for younger students (K-5), and be encouraging!
Keep each section concise (2-3 paragraphs max).
`;
  }

  /**
   * Parse AI lesson response into structured format
   */
  private _parseAILessonResponse(
    aiResponse: string,
    subject: string,
    skill: string
  ): LessonContent[] {
    const lessons: LessonContent[] = [];
    
    // Try to parse structured sections
    const sections = aiResponse.split(/\n(?=\d\.|INTRODUCTION|CONCEPT|EXAMPLE|PRACTICE|SUMMARY)/i);
    
    const typeMap: Record<string, LessonContent['type']> = {
      introduction: 'introduction',
      concept: 'concept',
      example: 'example',
      practice: 'interactive',
      summary: 'summary',
    };

    sections.forEach((section, index) => {
      const type = Object.keys(typeMap).find(key => 
        section.toLowerCase().includes(key)
      ) || 'concept';

      const content = section
        .replace(/^\d+\.\s*/g, '')
        .replace(/^(INTRODUCTION|CONCEPT|EXAMPLE|PRACTICE|SUMMARY):?\s*/i, '')
        .trim();

      if (content) {
        lessons.push({
          id: `lesson-${index}`,
          type: typeMap[type],
          title: this._generateTitle(type, skill),
          content,
          duration: type === 'interactive' ? 30 : 15,
          ...(type === 'interactive' && {
            interactive: {
              type: 'type',
              instruction: 'Try solving this problem!',
              answer: '',
            },
          }),
        });
      }
    });

    return lessons.length > 0 ? lessons : this._fallbackLesson(subject, skill, '5');
  }

  /**
   * Generate appropriate title for lesson section
   */
  private _generateTitle(type: string, skill: string): string {
    const titles: Record<string, string> = {
      introduction: `Welcome to ${skill}!`,
      concept: `Understanding ${skill}`,
      example: `${skill} in Action`,
      interactive: 'Try It Yourself!',
      summary: 'What We Learned',
    };
    return titles[type] || skill;
  }

  /**
   * Map difficulty (0-1) to skill level
   */
  private _mapDifficultyToSkillLevel(difficulty: number): 'below_grade' | 'grade_level' | 'above_grade' {
    if (difficulty < 0.4) return 'below_grade';
    if (difficulty < 0.7) return 'grade_level';
    return 'above_grade';
  }

  /**
   * Get accommodations based on disabilities
   */
  private _getAccommodations(disabilities?: string[]): string[] {
    if (!disabilities || disabilities.length === 0) return [];

    const accommodations: string[] = [];
    disabilities.forEach(disability => {
      const lower = disability.toLowerCase();
      if (lower.includes('adhd')) {
        accommodations.push('shorter_tasks', 'frequent_breaks', 'clear_structure');
      }
      if (lower.includes('dyslexia')) {
        accommodations.push('simplified_text', 'visual_aids', 'audio_support');
      }
      if (lower.includes('autism')) {
        accommodations.push('predictable_routine', 'concrete_examples', 'visual_schedules');
      }
    });

    return accommodations;
  }

  /**
   * Fallback generation if AI fails
   */
  private _fallbackGeneration(request: TaskGenerationRequest): GeneratedTask[] {
    const tasks: GeneratedTask[] = [];
    const count = request.count || 5;

    for (let i = 0; i < count; i++) {
      tasks.push({
        id: `fallback-${Date.now()}-${i}`,
        subject: request.subject,
        skill: request.skill || 'general',
        gradeLevel: request.gradeLevel,
        difficulty: request.difficulty,
        question: `Practice problem ${i + 1} for ${request.subject}`,
        answer: 'answer',
        hint: 'Think carefully about what you learned',
        explanation: 'This is a practice problem',
      });
    }

    return tasks;
  }

  /**
   * Fallback lesson if AI fails
   */
  private _fallbackLesson(subject: string, skill: string, gradeLevel: string): LessonContent[] {
    return [
      {
        id: 'fallback-intro',
        type: 'introduction',
        title: `Welcome to ${skill}!`,
        content: `Let's learn about ${skill} together!`,
        duration: 10,
      },
      {
        id: 'fallback-concept',
        type: 'concept',
        title: `Understanding ${skill}`,
        content: `${skill} is an important concept in ${subject}.`,
        duration: 15,
      },
    ];
  }
}

// Singleton instance
export const aiTaskGenerator = new AITaskGenerationService();
