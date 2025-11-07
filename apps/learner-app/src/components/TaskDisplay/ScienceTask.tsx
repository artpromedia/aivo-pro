import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

type GradeTheme = 'K5' | 'MS' | 'HS';

interface ScienceTaskProps {
  task: any;
  onAnswer: (answer: any) => void;
  userAnswer: any;
  isDisabled: boolean;
  theme: GradeTheme;
}

export const ScienceTask: React.FC<ScienceTaskProps> = ({
  task,
  onAnswer,
  userAnswer,
  isDisabled,
  theme,
}) => {
  if (!task) return null;

  const renderInteractive = () => {
    switch (task?.type) {
      case 'multiple-choice':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {task?.content?.options?.map((option: any, index: number) => (
              <motion.button
                key={option.value ?? index}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => !isDisabled && onAnswer(option.value)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  userAnswer === option.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-emerald-500">{index + 1}.</span>
                  <div className="text-gray-800">{option.label}</div>
                </div>
              </motion.button>
            ))}
          </div>
        );
      case 'matching':
        return (
          <div className="space-y-3">
            {task?.content?.pairs?.map((pair: any) => (
              <div
                key={pair.id}
                className={`p-4 rounded-2xl border-2 ${
                  userAnswer?.[pair.id]
                    ? 'border-emerald-500 bg-emerald-50'
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400"
                >
                  <option value="" disabled>
                    Select answer
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
              ? 'bg-gradient-to-br from-green-400 to-teal-400 text-white'
              : theme === 'MS'
                ? 'bg-gradient-to-br from-sky-500 to-emerald-500 text-white'
                : 'bg-gray-900 text-white'
          }`}
        >
          <FlaskConical className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">
            {task?.content?.question}
          </h3>
          {task?.content?.diagram && (
            <img
              src={task.content.diagram}
              alt="Science diagram"
              className="w-full max-w-md rounded-2xl border border-emerald-100"
            />
          )}
          {task?.content?.observation && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-gray-700">
              {task.content.observation}
            </div>
          )}
        </div>
      </div>

      {renderInteractive()}
    </div>
  );
};
