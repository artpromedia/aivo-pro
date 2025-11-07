import React from 'react';

type Subject = 'math' | 'reading' | 'writing' | 'science';

interface GenerateTaskOptions {
  subject: Subject;
  difficulty: number;
  skillTags?: string[];
}

export interface GeneratedTask {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'written' | 'drawing' | 'matching';
  subject: Subject;
  difficulty: number;
  content: any;
  hints: string[];
  correctAnswer: any;
  explanation: string;
  skillTags: string[];
}

interface TaskGenerationHook {
  generateTasks: (options: GenerateTaskOptions, count?: number) => GeneratedTask[];
}

const mathTemplates = [
  {
    type: 'multiple-choice' as const,
    question: (difficulty: number) => `What is ${difficulty + 4} + ${difficulty + 7}?`,
    options: (a: number, b: number) => {
      const answer = a + b;
      return [answer, answer - 2, answer + 3, answer + 5]
        .sort(() => Math.random() - 0.5)
        .map((value) => ({ label: value, value }));
    },
    hints: ['Try counting on using the larger number.', 'Break the numbers into tens and ones.'],
  },
];

const readingTemplates = [
  {
    type: 'multiple-choice' as const,
    question: () => 'What is the main idea of the paragraph?',
    hints: ['Look at the first and last sentences.', 'What do the details talk about?'],
  },
];

const writingTemplates = [
  {
    type: 'written' as const,
    prompt: () => 'Write three sentences about your favorite hobby.',
    hints: ['Start with “My favorite hobby is…”.', 'Describe how it makes you feel.'],
  },
];

const scienceTemplates = [
  {
    type: 'multiple-choice' as const,
    question: () => 'Which part of the plant makes food?',
    options: ['Roots', 'Stem', 'Leaves', 'Flower'],
    hints: ['Photosynthesis happens here.', 'It is usually green.'],
  },
];

const templates: Record<Subject, any[]> = {
  math: mathTemplates,
  reading: readingTemplates,
  writing: writingTemplates,
  science: scienceTemplates,
};

export const useTaskGeneration = (): TaskGenerationHook => {
  const generateTasks = React.useCallback(
    (options: GenerateTaskOptions, count = 1): GeneratedTask[] => {
      const subjectTemplates = templates[options.subject];
      if (!subjectTemplates) return [];

      return Array.from({ length: count }).map((_, index) => {
        const template = subjectTemplates[index % subjectTemplates.length];
        const difficulty = Math.max(1, Math.min(options.difficulty, 5));
        const id = `${options.subject}-${Date.now()}-${index}`;

        switch (options.subject) {
          case 'math': {
            const a = difficulty + 4;
            const b = difficulty + 7;
            const question = template.question(difficulty);
            const optionsList = template.options(a, b);
            const correct = a + b;
            return {
              id,
              subject: 'math',
              type: template.type,
              difficulty,
              content: {
                question,
                options: optionsList,
              },
              hints: template.hints,
              correctAnswer: correct,
              explanation: `${a} + ${b} = ${correct}. Add the ones first, then the tens.`,
              skillTags: options.skillTags ?? ['addition'],
            } satisfies GeneratedTask;
          }
          case 'reading':
            return {
              id,
              subject: 'reading',
              type: template.type,
              difficulty,
              content: {
                passage: 'The sun was shining brightly as Mia walked to school. She loved seeing her friends and learning new things.',
                question: template.question(),
                options: [
                  { label: 'Mia enjoys learning and seeing friends.', value: 'main' },
                  { label: 'The weather can change quickly.', value: 'weather' },
                  { label: 'Walking to school is difficult.', value: 'hard' },
                ],
              },
              hints: template.hints,
              correctAnswer: 'main',
              explanation: 'The paragraph explains how Mia feels about school—she loves it.',
              skillTags: options.skillTags ?? ['comprehension'],
            } satisfies GeneratedTask;
          case 'writing':
            return {
              id,
              subject: 'writing',
              type: template.type,
              difficulty,
              content: {
                prompt: template.prompt(),
                guidelines: [
                  'Sentence 1: Introduce your hobby.',
                  'Sentence 2: Describe why you enjoy it.',
                  'Sentence 3: Share how often you do it.',
                ],
              },
              hints: template.hints,
              correctAnswer: null,
              explanation: 'Focus on structure: introduction, details, and closing sentence.',
              skillTags: options.skillTags ?? ['writing'],
            } satisfies GeneratedTask;
          case 'science':
            return {
              id,
              subject: 'science',
              type: template.type,
              difficulty,
              content: {
                question: template.question(),
                options: template.options.map((label: string) => ({ label, value: label.toLowerCase() })),
                observation: 'Plants use sunlight to make their own food in a process called photosynthesis.',
              },
              hints: template.hints,
              correctAnswer: 'leaves',
              explanation: 'Leaves contain chlorophyll, which captures sunlight for photosynthesis.',
              skillTags: options.skillTags ?? ['life-science'],
            } satisfies GeneratedTask;
          default:
            return null as unknown as GeneratedTask;
        }
      });
    },
    []
  );

  return { generateTasks };
};
