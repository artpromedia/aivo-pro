import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

type GradeTheme = 'K5' | 'MS' | 'HS';

interface ReadingTaskProps {
  task: any;
  onAnswer: (answer: any) => void;
  userAnswer: any;
  isDisabled: boolean;
  theme: GradeTheme;
}

export const ReadingTask: React.FC<ReadingTaskProps> = ({
  task,
  onAnswer,
  userAnswer,
  isDisabled,
  theme,
}) => {
  if (!task) return null;

  const renderOptions = () => (
    <div className="space-y-3">
      {task?.content?.options?.map((option: any, index: number) => (
        <motion.button
          key={option.value ?? index}
          whileHover={!isDisabled ? { scale: 1.02 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
          onClick={() => !isDisabled && onAnswer(option.value)}
          className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
            userAnswer === option.value
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          } ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <div className="flex items-start gap-3">
            <span className="font-semibold text-purple-500">{String.fromCharCode(65 + index)}.</span>
            <span className="text-gray-800">{option.label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );

  const renderFillBlank = () => (
    <div className="space-y-4">
      <p className="text-lg text-gray-700 leading-relaxed">
        {task?.content?.sentenceParts?.map((part: string, index: number) => (
          <React.Fragment key={index}>
            {part}
            {index === 0 && (
              <input
                type="text"
                value={userAnswer ?? ''}
                onChange={(e) => onAnswer(e.target.value)}
                disabled={isDisabled}
                className="mx-2 px-3 py-2 border-b-2 border-purple-400 bg-transparent text-lg focus:outline-none focus:border-purple-600"
                placeholder="..."
              />
            )}
          </React.Fragment>
        ))}
      </p>
    </div>
  );

  const renderMatching = () => (
    <div className="grid md:grid-cols-2 gap-4">
      {task?.content?.pairs?.map((pair: any) => (
        <div
          key={pair.id}
          className={`p-4 rounded-2xl border-2 ${
            userAnswer?.[pair.id]
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="font-semibold text-gray-800 mb-2">{pair.prompt}</div>
          <select
            value={userAnswer?.[pair.id] ?? ''}
            onChange={(event) =>
              !isDisabled &&
              onAnswer({
                ...(userAnswer ?? {}),
                [pair.id]: event.target.value,
              })
            }
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
          >
            <option value="" disabled>
              Choose answer
            </option>
            {pair.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );

  const renderTaskBody = () => {
    switch (task?.type) {
      case 'multiple-choice':
        return renderOptions();
      case 'fill-blank':
        return renderFillBlank();
      case 'matching':
        return renderMatching();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-md ${
            theme === 'K5'
              ? 'bg-gradient-to-br from-pink-400 to-purple-400 text-white'
              : theme === 'MS'
                ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                : 'bg-gray-900 text-white'
          }`}
        >
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-3">
          {task?.content?.passage && (
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-gray-700 leading-relaxed">
              {task.content.passage}
            </div>
          )}
          <h3 className="text-xl font-semibold text-gray-800">
            {task?.content?.question}
          </h3>
        </div>
      </div>

      {renderTaskBody()}
    </div>
  );
};
