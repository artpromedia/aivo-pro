import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen,
  Lightbulb,
  ArrowRight,
  Volume2,
  VolumeX,
  Loader2
} from 'lucide-react';
import { useAITaskGeneration } from '../hooks/useAITaskGeneration';
import type { LessonContent } from '../services/AITaskGenerationService';

interface AITeacherProps {
  subject: 'math' | 'reading' | 'writing' | 'science';
  topic: string;
  onLessonComplete: () => void;
  theme: 'K5' | 'MS' | 'HS';
}

const SUBJECT_AVATARS = {
  math: '🧮',
  reading: '📚',
  writing: '✍️',
  science: '🔬'
};

const GRADE_THEMES = {
  K5: {
    teacherName: 'Ms. Sparkle',
    personality: 'enthusiastic and encouraging',
    language: 'simple and fun'
  },
  MS: {
    teacherName: 'Professor Quest',
    personality: 'curious and engaging', 
    language: 'clear and interactive'
  },
  HS: {
    teacherName: 'Dr. Mentor',
    personality: 'professional and supportive',
    language: 'sophisticated and comprehensive'
  }
};

export const AITeacherDynamic: React.FC<AITeacherProps> = ({ subject, topic, onLessonComplete, theme }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hasAudio, setHasAudio] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [isLoadingLesson, setIsLoadingLesson] = useState(true);
  const [streamedContent, setStreamedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const { generateLesson } = useAITaskGeneration();
  const teacherInfo = GRADE_THEMES[theme];
  const avatar = SUBJECT_AVATARS[subject];

  // Load AI-generated lesson on mount
  useEffect(() => {
    const loadLesson = async () => {
      setIsLoadingLesson(true);
      console.log('🎓 Starting lesson generation for:', { subject, topic, theme });
      
      try {
        const generatedLesson = await generateLesson(subject, topic);
        console.log('📚 Generated lesson:', generatedLesson);
        
        if (generatedLesson && generatedLesson.length > 0) {
          console.log('✅ Using AI-generated lesson with', generatedLesson.length, 'steps');
          setLessons(generatedLesson);
        } else {
          console.warn('⚠️ No AI lesson generated, using enhanced fallback');
          // Enhanced fallback lesson with more content
          setLessons([
            {
              id: 'fallback-intro',
              type: 'introduction',
              title: `Welcome to ${topic}!`,
              content: theme === 'K5' 
                ? `Hi there! 👋 I'm so excited to explore ${topic} with you today! This is going to be fun!\n\n${subject} is all about discovering amazing things. Let's learn together!`
                : `Welcome! Today we're diving into ${topic}, a fascinating area of ${subject}.\n\nWe'll explore key concepts, see examples, and practice together. Let's get started!`,
              duration: 15,
            },
            {
              id: 'fallback-concept',
              type: 'concept',
              title: `Understanding ${topic}`,
              content: theme === 'K5'
                ? `${topic} is really cool! 🌟\n\nLet me explain it in a simple way:\n\nThink of ${topic} like... (imagine something fun!)\n\nIt helps us learn and understand ${subject} better!`
                : `Let's break down ${topic} into its key components:\n\n1. Core Concept: The fundamental idea\n2. Why It Matters: Real-world applications\n3. How It Works: The mechanism behind it\n\nUnderstanding these will help you master this topic.`,
              duration: 20,
            },
            {
              id: 'fallback-example',
              type: 'example',
              title: `${topic} in Action`,
              content: theme === 'K5'
                ? `Let me show you an example! 💡\n\nImagine you're using ${topic} to solve a problem...\n\nSee? That's how it works! Pretty neat, right?`
                : `Here's a practical example of ${topic}:\n\nScenario: [Real-world situation]\nApplication: [How the concept applies]\nOutcome: [Result achieved]\n\nThis demonstrates the power of understanding ${topic}.`,
              duration: 25,
            },
            {
              id: 'fallback-interactive',
              type: 'interactive',
              title: 'Try It Yourself!',
              content: theme === 'K5'
                ? `Now it's YOUR turn! 🎯\n\nCan you think of a time when you might use ${topic}?\n\nType your answer below!`
                : `Time to apply what you've learned!\n\nQuestion: How would you use ${topic} to solve a problem?\n\nShare your thoughts:`,
              duration: 30,
              interactive: {
                type: 'type',
                instruction: theme === 'K5' ? 'Type your answer here!' : 'Enter your response:',
                answer: 'any',
              },
            },
            {
              id: 'fallback-summary',
              type: 'summary',
              title: 'Great Work!',
              content: theme === 'K5'
                ? `You did amazing! 🎉\n\nToday we learned about ${topic}!\n\nRemember:\n✅ It's an important part of ${subject}\n✅ You can use it to solve problems\n✅ Practice makes perfect!\n\nI'm so proud of you!`
                : `Excellent work! Let's review what we covered:\n\n✅ Core concepts of ${topic}\n✅ Real-world applications\n✅ Practical examples\n✅ Hands-on practice\n\nYou're now ready to practice with exercises!`,
              duration: 15,
            },
          ]);
        }
      } catch (error) {
        console.error('❌ Failed to load AI lesson:', error);
        // Simple error fallback
        setLessons([{
          id: 'error-1',
          type: 'introduction',
          title: `${topic}`,
          content: `Let's explore ${topic} in ${subject}!`,
          duration: 10,
        }]);
      } finally {
        setIsLoadingLesson(false);
      }
    };

    loadLesson();
  }, [subject, topic, theme, generateLesson]);

  const currentLesson = lessons[currentStep];

  useEffect(() => {
    if (isPlaying && currentLesson) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (currentLesson.duration * 10));
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isPlaying, currentLesson]);

  const speakText = (text: string) => {
    if (!hasAudio || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = theme === 'K5' ? 1.2 : 1;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!isPlaying && currentLesson) {
      speakText(currentLesson.content);
    } else {
      window.speechSynthesis?.cancel();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentStep < lessons.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setProgress(0);
      setUserInput('');
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    } else {
      onLessonComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setProgress(0);
      setUserInput('');
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setProgress(0);
    setUserInput('');
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    setHasAudio(!hasAudio);
    if (hasAudio) {
      window.speechSynthesis?.cancel();
    }
  };

  const checkInteractiveAnswer = () => {
    if (!currentLesson?.interactive) return false;
    return userInput.toLowerCase().trim() === currentLesson.interactive.answer?.toLowerCase().trim();
  };

  if (isLoadingLesson) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 shadow-lg"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-lg font-medium text-gray-700">
            {teacherInfo.teacherName} is preparing your lesson...
          </p>
          <p className="text-sm text-gray-500">Using AI to personalize content just for you!</p>
        </div>
      </motion.div>
    );
  }

  if (!currentLesson) {
    return null;
  }

  const isInteractive = currentLesson.type === 'interactive';
  const canProceed = !isInteractive || checkInteractiveAnswer();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{avatar}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{teacherInfo.teacherName}</h3>
            <p className="text-sm text-gray-600">Your AI {subject} teacher</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            title={hasAudio ? 'Mute' : 'Unmute'}
          >
            {hasAudio ? <Volume2 className="w-5 h-5 text-purple-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Step {currentStep + 1} of {lessons.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Lesson Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg p-6 mb-6"
        >
          {/* Type Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              currentLesson.type === 'introduction' ? 'bg-blue-100 text-blue-700' :
              currentLesson.type === 'concept' ? 'bg-purple-100 text-purple-700' :
              currentLesson.type === 'example' ? 'bg-green-100 text-green-700' :
              currentLesson.type === 'interactive' ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {currentLesson.type === 'introduction' && <BookOpen className="w-3 h-3 mr-1" />}
              {currentLesson.type === 'concept' && <Brain className="w-3 h-3 mr-1" />}
              {currentLesson.type === 'example' && <Lightbulb className="w-3 h-3 mr-1" />}
              {currentLesson.type === 'interactive' && <MessageCircle className="w-3 h-3 mr-1" />}
              {currentLesson.type.charAt(0).toUpperCase() + currentLesson.type.slice(1)}
            </span>
            
            <button
              onClick={handlePlay}
              className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-purple-600" /> : <Play className="w-4 h-4 text-purple-600" />}
            </button>
          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-4">{currentLesson.title}</h4>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {currentLesson.content}
            </p>
          </div>

          {currentLesson.visual && (
            <div className="mt-4 text-center text-3xl">
              {currentLesson.visual}
            </div>
          )}

          {/* Interactive Component */}
          {isInteractive && currentLesson.interactive && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {currentLesson.interactive.instruction}
              </p>
              
              {currentLesson.interactive.type === 'type' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                  {userInput && (
                    <p className={`text-sm font-medium ${
                      checkInteractiveAnswer() ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {checkInteractiveAnswer() ? '✓ Correct! Great job!' : 'Try again!'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            title="Restart lesson"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={isInteractive && !canProceed}
          className={`px-6 py-2 font-medium rounded-lg transition-all ${
            currentStep === lessons.length - 1
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
        >
          <span>{currentStep === lessons.length - 1 ? 'Complete Lesson' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Badge */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
        <Brain className="w-3 h-3" />
        <span>Powered by AI • Personalized for you</span>
      </div>
    </motion.div>
  );
};
