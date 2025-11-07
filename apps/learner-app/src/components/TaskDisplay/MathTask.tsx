import React from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

type GradeTheme = 'K5' | 'MS' | 'HS';

interface MathTaskProps {
  task: any;
  onAnswer: (answer: any) => void;
  userAnswer: any;
  isDisabled: boolean;
  theme: GradeTheme;
}

export const MathTask: React.FC<MathTaskProps> = ({
  task,
  onAnswer,
  userAnswer,
  isDisabled,
  theme,
}) => {
  const renderQuestion = () => {
    switch (task?.type) {
      case 'multiple-choice':
        return (
          <div>
            <div className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {task?.content?.question}
            </div>

            {task?.content?.visual && (
              <div className="flex justify-center mb-6">
                <img
                  src={task.content.visual}
                  alt="Math visual"
                  className="max-w-md rounded-xl shadow-md"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {task?.content?.options?.map((option: any, index: number) => (
                <motion.button
                  key={index}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  onClick={() => !isDisabled && onAnswer(option.value)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    userAnswer === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  <div className="text-xl font-bold text-gray-800">
                    {option.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'fill-blank':
        return (
          <div>
            <div className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
              <span>{task?.content?.questionParts?.[0]}</span>
              <input
                type="number"
                value={userAnswer ?? ''}
                onChange={(e) => onAnswer(e.target.value)}
                disabled={isDisabled}
                className="px-4 py-2 w-24 text-center text-2xl font-bold border-2 border-primary-300 rounded-xl focus:outline-none focus:border-primary-500"
                placeholder="?"
              />
              <span>{task?.content?.questionParts?.[1]}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="math-task">
      {theme === 'K5' && (
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center"
          >
            <Calculator className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      )}

      {renderQuestion()}
    </div>
  );
};
