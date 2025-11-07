import React from 'react';
import { motion } from 'framer-motion';
import { PenSquare, Edit3 } from 'lucide-react';

type GradeTheme = 'K5' | 'MS' | 'HS';

interface WritingTaskProps {
  task: any;
  onAnswer: (answer: any) => void;
  userAnswer: any;
  isDisabled: boolean;
  theme: GradeTheme;
  onOpenWritingPad?: () => void;
}

export const WritingTask: React.FC<WritingTaskProps> = ({
  task,
  onAnswer,
  userAnswer,
  isDisabled,
  theme,
  onOpenWritingPad,
}) => {
  if (!task) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-md ${
            theme === 'K5'
              ? 'bg-gradient-to-br from-orange-400 to-pink-400 text-white'
              : theme === 'MS'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                : 'bg-gray-900 text-white'
          }`}
        >
          <PenSquare className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {task?.content?.prompt}
          </h3>
          {task?.content?.guidelines && (
            <ul className="space-y-2 bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-orange-800">
              {task.content.guidelines.map((guide: string, index: number) => (
                <li key={index}>• {guide}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <textarea
        value={userAnswer ?? ''}
        onChange={(event) => onAnswer(event.target.value)}
        disabled={isDisabled}
        placeholder="Write your response here..."
        className="w-full min-h-[200px] px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-400 text-gray-800 resize-y"
      />

      {onOpenWritingPad && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => !isDisabled && onOpenWritingPad()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-xl shadow-md"
        >
          <Edit3 className="w-4 h-4" />
          Open Drawing Pad
        </motion.button>
      )}
    </div>
  );
};
