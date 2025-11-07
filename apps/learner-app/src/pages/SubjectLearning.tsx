import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  Lightbulb,
  Volume2,
  Check,
  X,
  Star,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { useTheme } from '../providers/ThemeProvider';
import { MathTask } from '../components/TaskDisplay/MathTask';
import { ReadingTask } from '../components/TaskDisplay/ReadingTask';
import { WritingTask } from '../components/TaskDisplay/WritingTask';
import { ScienceTask } from '../components/TaskDisplay/ScienceTask';
import { HintSystem } from '../components/HintSystem';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { RewardAnimation } from '../components/RewardAnimation';
import { WritingPad } from '../components/WritingPad';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { useTaskGeneration, GeneratedTask } from '../hooks/useTaskGeneration';

type Subject = 'math' | 'reading' | 'writing' | 'science';

interface Task {
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

interface LearningSession {
  id: string;
  tasks: Task[];
}

const LOADING_GRADIENT = 'min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50';

const getThemeFeatures = (gradeTheme: 'K5' | 'MS' | 'HS') => ({
  soundEffects: gradeTheme !== 'HS',
  adaptiveHints: true,
});

export const SubjectLearning: React.FC = () => {
  const params = useParams<{ subject: Subject }>();
  const subject = (params.subject || 'math') as Subject;
  const navigate = useNavigate();
  const { theme } = useTheme();
  const themeFeatures = useMemo(() => getThemeFeatures(theme), [theme]);

  console.log('SubjectLearning mounted - subject:', subject, 'params:', params);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showWritingPad, setShowWritingPad] = useState(false);
  const [startTime, setStartTime] = useState(() => Date.now());

  const adaptiveLearning = useAdaptiveLearning();
  const { generateTasks } = useTaskGeneration();

  const { data: session, isLoading, error } = useQuery<LearningSession | undefined>({
    queryKey: ['learning-session', subject],
    queryFn: async () => {
      try {
        const response = await fetch('/api/v1/learning/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject }),
        });

        if (!response.ok) {
          // Return undefined to use fallback
          return undefined;
        }

        const payload = await response.json();
        return payload as LearningSession;
      } catch (err) {
        // Network error or other issue - use fallback
        console.log('Using offline task generation');
        return undefined;
      }
    },
    staleTime: 1000 * 60,
    retry: false, // Don't retry on failure
  });

  const tasks: Task[] = useMemo(() => {
    console.log('Generating tasks - session:', session, 'subject:', subject);
    
    if (session?.tasks?.length) {
      console.log('Using session tasks:', session.tasks.length);
      return session.tasks;
    }

    console.log('Generating fallback tasks for subject:', subject);
    const generated = generateTasks({
      subject: subject as Subject,
      difficulty: adaptiveLearning.state.lastDifficulty === 'hard' ? 4 : 2,
    }, 5) as GeneratedTask[];

    console.log('Generated tasks:', generated);
    
    return generated.map((task) => ({
      ...task,
      id: `${task.subject}-${task.id}`,
    }));
  }, [adaptiveLearning.state.lastDifficulty, generateTasks, session, subject]);

  const submitAnswer = useMutation({
    mutationFn: async (payload: {
      taskId: string;
      answer: any;
      hintsUsed: number;
      timeSpent: number;
    }) => {
      if (!session?.id) {
        return {
          correct: payload.answer === tasks[currentTaskIndex]?.correctAnswer,
          points: payload.answer === tasks[currentTaskIndex]?.correctAnswer ? 10 : 0,
        };
      }

      const response = await fetch(`/api/v1/learning/session/${session.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: (data: { correct: boolean; points: number }) => {
      setIsCorrect(data.correct);
      setShowFeedback(true);

      const nextDifficulty = adaptiveLearning.registerResult(data.correct);

      if (data.correct) {
        setSessionScore((prev) => prev + data.points);
        setStreak((prev) => prev + 1);

        if (streak >= 2) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF7B5C', '#A855F7', '#10B981'],
          });
        }
      } else {
        setStreak(0);
      }

      setHintIndex(null);

      if (nextDifficulty === 'hard' && themeFeatures.adaptiveHints) {
        setHintIndex((prev) => (prev === null ? 0 : prev));
      }
    },
  });

  const currentTask = tasks[currentTaskIndex];
  
  console.log('Current state:', {
    isLoading,
    tasksLength: tasks.length,
    currentTaskIndex,
    currentTask,
    subject
  });

  const handleSubmit = () => {
    if (!currentTask || userAnswer === null || userAnswer === undefined) {
      return;
    }

    submitAnswer.mutate({
      taskId: currentTask.id,
      answer: userAnswer,
      hintsUsed: hintIndex === null ? 0 : hintIndex + 1,
      timeSpent: Date.now() - startTime,
    });
  };

  const handleNext = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
      setUserAnswer(null);
      setHintIndex(null);
      setShowFeedback(false);
      setStartTime(Date.now());
      submitAnswer.reset();
    } else if (session?.id) {
      navigate(`/session-complete/${session.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const revealHint = () => {
    if (!currentTask?.hints?.length) return;
    setHintIndex((prev) => {
      const next = prev === null ? 0 : prev + 1;
      return next >= currentTask.hints.length ? prev : next;
    });
  };

  const renderTask = () => {
    if (!currentTask) return null;

    const taskProps = {
      task: currentTask,
      onAnswer: setUserAnswer,
      userAnswer,
      isDisabled: showFeedback,
      theme,
    };

    switch (currentTask.subject) {
      case 'math':
        return <MathTask {...taskProps} />;
      case 'reading':
        return <ReadingTask {...taskProps} />;
      case 'writing':
        return <WritingTask {...taskProps} onOpenWritingPad={() => setShowWritingPad(true)} />;
      case 'science':
        return <ScienceTask {...taskProps} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentTaskIndex]);

  // Don't show loading if we have tasks (from fallback)
  if (isLoading && tasks.length === 0) {
    return (
      <div className={LOADING_GRADIENT}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Show error if no tasks could be generated
  if (!currentTask) {
    return (
      <div className={LOADING_GRADIENT}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load tasks</h2>
          <p className="text-gray-600 mb-6">Please try again or return to the dashboard.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-6">
              <ProgressIndicator current={currentTaskIndex + 1} total={tasks.length} />

              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-gray-800">{sessionScore}</span>
              </div>

              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl"
                >
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-gray-800">{streak} streak!</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <motion.div
          key={currentTask?.id ?? currentTaskIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  currentTask?.subject === 'math' ? 'bg-blue-100' : ''
                } ${currentTask?.subject === 'reading' ? 'bg-green-100' : ''} ${
                  currentTask?.subject === 'writing' ? 'bg-purple-100' : ''
                } ${currentTask?.subject === 'science' ? 'bg-orange-100' : ''}`}
              >
                <Brain className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                  {currentTask?.subject} challenge
                </h2>
                <p className="text-sm text-gray-500">
                  Question {currentTaskIndex + 1} of {tasks.length}
                </p>
              </div>
            </div>

            {themeFeatures.adaptiveHints && currentTask?.hints?.length ? (
              <HintSystem
                hints={currentTask.hints}
                visibleIndex={hintIndex}
                onRevealNext={revealHint}
                canReveal={!showFeedback && (hintIndex ?? -1) < currentTask.hints.length - 1}
                adaptiveMessage={
                  adaptiveLearning.state.streak >= 2
                    ? 'You are on a roll! Try solving it before revealing another hint.'
                    : undefined
                }
              />
            ) : null}
          </div>

          <div className="mb-8">{renderTask()}</div>

          <AnimatePresence>
            {showFeedback && currentTask && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-6 rounded-xl mb-6 ${
                  isCorrect
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                    : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {isCorrect ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-bold mb-2 ${
                        isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {isCorrect ? 'Excellent work! 🎉' : 'Great try! Let’s review together.'}
                    </h3>
                    <p className="text-gray-700">{currentTask.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <div>
              {themeFeatures.soundEffects && (
                <button
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  onClick={() => {}}
                >
                  <Volume2 className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {!showFeedback ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={userAnswer === null || userAnswer === undefined}
                  className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all ${
                    userAnswer !== null && userAnswer !== undefined
                      ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                >
                  {currentTaskIndex < tasks.length - 1 ? (
                    <>
                      Next Question
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Complete Session
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {themeFeatures.adaptiveHints && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800">AI Study Buddy</h3>
            </div>
            <p className="text-gray-700">
              Need guidance? Ask follow-up questions and I will help you think through the solution.
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showWritingPad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full"
            >
              <WritingPad
                onSave={(dataUrl) => {
                  setUserAnswer(dataUrl);
                  setShowWritingPad(false);
                }}
                onClose={() => setShowWritingPad(false)}
                width={800}
                height={400}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFeedback && isCorrect && <RewardAnimation streak={streak} />}
    </div>
  );
};