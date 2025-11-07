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
  VolumeX
} from 'lucide-react';

interface AITeacherProps {
  subject: 'math' | 'reading' | 'writing' | 'science';
  topic: string;
  onLessonComplete: () => void;
  theme: 'K5' | 'MS' | 'HS';
}

interface LessonStep {
  id: string;
  type: 'introduction' | 'concept' | 'example' | 'interactive' | 'summary';
  title: string;
  content: string;
  visual?: string;
  interactive?: {
    type: 'click' | 'drag' | 'type';
    instruction: string;
    answer?: string;
  };
  duration: number; // seconds to read/process
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

export const AITeacher: React.FC<AITeacherProps> = ({ subject, topic, onLessonComplete, theme }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hasAudio, setHasAudio] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);

  const teacherInfo = GRADE_THEMES[theme];
  const avatar = SUBJECT_AVATARS[subject];

  // Generate lesson content based on subject and topic
  const lessons = generateLessonContent(subject, topic, theme);
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
    setIsPlaying(true);
    setProgress(0);
    if (hasAudio) {
      speakText(currentLesson.content);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleNext = () => {
    if (currentStep < lessons.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
      setIsPlaying(false);
      setUserInput('');
    } else {
      onLessonComplete();
    }
  };

  const handleInteractive = () => {
    if (currentLesson.interactive) {
      // Handle interactive elements based on type
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center text-2xl">
                {avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {teacherInfo.teacherName}
                </h1>
                <p className="text-gray-600 capitalize">
                  {subject} • {topic}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setHasAudio(!hasAudio)}
                className={`p-3 rounded-lg transition-colors ${
                  hasAudio ? 'bg-coral-100 text-coral-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {hasAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Lesson Progress</span>
              <span>{currentStep + 1} of {lessons.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-coral-500 to-coral-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + progress/100) / lessons.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Lesson Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            {/* Lesson Type Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentLesson.type === 'introduction' ? 'bg-blue-100 text-blue-700' :
                currentLesson.type === 'concept' ? 'bg-green-100 text-green-700' :
                currentLesson.type === 'example' ? 'bg-yellow-100 text-yellow-700' :
                currentLesson.type === 'interactive' ? 'bg-purple-100 text-purple-700' :
                'bg-coral-100 text-coral-700'
              }`}>
                {currentLesson.type === 'introduction' && '👋 Introduction'}
                {currentLesson.type === 'concept' && '💡 Core Concept'}
                {currentLesson.type === 'example' && '📝 Example'}
                {currentLesson.type === 'interactive' && '🎯 Try It!'}
                {currentLesson.type === 'summary' && '✅ Summary'}
              </div>
            </div>

            {/* Lesson Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {currentLesson.title}
            </h2>

            {/* Lesson Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {currentLesson.content}
              </div>
            </div>

            {/* Visual Content */}
            {currentLesson.visual && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="text-center text-6xl">
                  {currentLesson.visual}
                </div>
              </div>
            )}

            {/* Interactive Content */}
            {currentLesson.interactive && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 Your Turn!
                </h3>
                <p className="text-gray-700 mb-4">
                  {currentLesson.interactive.instruction}
                </p>
                
                {currentLesson.interactive.type === 'type' && (
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-coral-500 focus:border-coral-500"
                    placeholder="Type your answer here..."
                  />
                )}
                
                {currentLesson.interactive.type === 'click' && (
                  <button
                    onClick={handleInteractive}
                    className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                  >
                    Click to Continue
                  </button>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!isPlaying ? (
                  <button
                    onClick={handlePlay}
                    className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    {hasAudio ? 'Play Lesson' : 'Start Timer'}
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={progress < 100 && !currentLesson.interactive}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-lg hover:from-coral-600 hover:to-coral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === lessons.length - 1 ? 'Start Practice' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Indicator */}
            {progress > 0 && progress < 100 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-coral-500 h-1 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Generate lesson content based on subject, topic, and grade level
function generateLessonContent(subject: string, topic: string, theme: 'K5' | 'MS' | 'HS'): LessonStep[] {
  const baseLessons = {
    math: {
      addition: [
        {
          id: 'intro-addition',
          type: 'introduction' as const,
          title: 'Welcome to Addition!',
          content: theme === 'K5' 
            ? `Hi there! I'm so excited to learn about addition with you today! 🎉\n\nAddition is like putting things together. When we add, we combine groups to make a bigger group!\n\nThink of it like collecting toys - if you have 2 toy cars and your friend gives you 3 more, how many toy cars do you have altogether?`
            : `Welcome to our addition lesson! Addition is one of the fundamental operations in mathematics.\n\nAddition combines quantities to find a total sum. Today we'll explore different strategies and understand the properties that make addition such a powerful tool.\n\nLet's start with the basic concept and build up to more complex applications.`,
          visual: theme === 'K5' ? '🚗🚗 + 🚗🚗🚗 = ?' : '2 + 3 = ?',
          duration: 15
        },
        {
          id: 'concept-addition',
          type: 'concept' as const,
          title: 'Understanding Addition',
          content: theme === 'K5'
            ? `Addition means "putting together" or "combining"!\n\nWhen we see the + sign, it means "plus" or "add".\nThe = sign means "equals" or "the same as".\n\nSo 2 + 3 = 5 means: 2 plus 3 equals 5!`
            : `Addition is the mathematical operation of combining quantities.\n\nKey components:\n• Addends: The numbers being added (2 and 3)\n• Plus sign (+): Indicates addition\n• Sum: The result (5)\n• Equals sign (=): Shows the relationship\n\nAddition is commutative (2+3 = 3+2) and associative ((1+2)+3 = 1+(2+3)).`,
          visual: '2️⃣ ➕ 3️⃣ = 5️⃣',
          duration: 20
        },
        {
          id: 'example-addition',
          type: 'example' as const,
          title: 'Let\'s See Addition in Action!',
          content: theme === 'K5'
            ? `Let's count together! 🎯\n\nIf I have 4 apples: 🍎🍎🍎🍎\nAnd you give me 2 more: 🍎🍎\n\nNow I count all my apples: 🍎🍎🍎🍎🍎🍎\nThat's 6 apples total!\n\nSo 4 + 2 = 6! Great job!`
            : `Example: Solving 15 + 27\n\nMethod 1 - Column Addition:\n  15\n+ 27\n----\n  42\n\nMethod 2 - Mental Math:\n15 + 27 = 15 + 20 + 7 = 35 + 7 = 42\n\nBoth methods give us the same answer: 42`,
          visual: theme === 'K5' ? '🍎🍎🍎🍎 + 🍎🍎 = 🍎🍎🍎🍎🍎🍎' : '15 + 27 = 42',
          duration: 25
        },
        {
          id: 'interactive-addition',
          type: 'interactive' as const,
          title: 'Try It Yourself!',
          content: theme === 'K5'
            ? `Now it's your turn to be the math detective! 🕵️‍♀️\n\nI have 3 balloons: 🎈🎈🎈\nMy friend brings 4 more: 🎈🎈🎈🎈\n\nHow many balloons do we have altogether?`
            : `Your turn to practice!\n\nSolve this addition problem:\n28 + 35 = ?\n\nTry using either the column method or mental math strategies we just learned.`,
          interactive: {
            type: 'type',
            instruction: theme === 'K5' ? 'Count all the balloons and type your answer!' : 'Type your answer:',
            answer: theme === 'K5' ? '7' : '63'
          },
          duration: 30
        },
        {
          id: 'summary-addition',
          type: 'summary' as const,
          title: 'Great Work! Let\'s Review',
          content: theme === 'K5'
            ? `You did amazing! Let's remember what we learned:\n\n✅ Addition means putting things together\n✅ The + sign means "plus"\n✅ We count all the items to find the answer\n✅ Addition helps us in everyday life!\n\nNow you're ready to practice with some fun questions!`
            : `Excellent work! Let's review the key concepts:\n\n✅ Addition combines quantities to find a sum\n✅ Addition is commutative and associative\n✅ Multiple strategies exist for solving addition problems\n✅ Mental math can make addition faster and more efficient\n\nYou're now ready to apply these concepts in practice problems!`,
          visual: '🌟',
          duration: 15
        }
      ],
      default: [
        {
          id: 'intro-math',
          type: 'introduction' as const,
          title: 'Welcome to Math!',
          content: `Let's explore mathematics together!`,
          duration: 10
        }
      ]
    },
    reading: {
      phonics: [
        {
          id: 'intro-phonics',
          type: 'introduction' as const,
          title: 'Welcome to Phonics Adventure!',
          content: theme === 'K5'
            ? `Hello, reading explorer! 📚✨\n\nToday we're going on a phonics adventure! Phonics helps us understand the sounds that letters make.\n\nEvery letter has a special sound, and when we put these sounds together, we can read words! It's like being a word detective!`
            : `Welcome to our phonics lesson! Phonics is the relationship between sounds and letters.\n\nUnderstanding phonics helps us decode unfamiliar words and improves our reading fluency. We'll explore letter-sound relationships and practice blending sounds to form words.`,
          visual: '🔤🔊',
          duration: 15
        }
      ],
      default: [
        {
          id: 'intro-reading',
          type: 'introduction' as const,
          title: 'Welcome to Reading!',
          content: `Let's explore the world of reading together!`,
          duration: 10
        }
      ]
    },
    science: {
      plants: [
        {
          id: 'intro-plants',
          type: 'introduction' as const,
          title: 'Amazing World of Plants!',
          content: theme === 'K5'
            ? `Welcome, young scientist! 🌱👩‍🔬\n\nToday we're going to explore the amazing world of plants! Plants are living things that grow all around us.\n\nLook outside - do you see trees, flowers, or grass? Those are all plants! Let's discover how plants live and grow.`
            : `Welcome to our botany lesson! Plants are fascinating organisms that form the foundation of most ecosystems.\n\nToday we'll explore plant structure, photosynthesis, and the vital role plants play in our environment. Let's begin this journey into the plant kingdom!`,
          visual: '🌱🌿🌻',
          duration: 15
        }
      ],
      default: [
        {
          id: 'intro-science',
          type: 'introduction' as const,
          title: 'Welcome to Science!',
          content: `Let's explore the wonders of science together!`,
          duration: 10
        }
      ]
    },
    writing: {
      storytelling: [
        {
          id: 'intro-storytelling',
          type: 'introduction' as const,
          title: 'Let\'s Tell Amazing Stories!',
          content: theme === 'K5'
            ? `Hello, future storyteller! ✍️📖\n\nEveryone loves a good story! Today we're going to learn how to create our own amazing stories.\n\nStories can be about anything - adventures, friendship, magical creatures, or even your pet! Are you ready to become a story wizard?`
            : `Welcome to creative writing! Storytelling is one of humanity's oldest and most powerful forms of communication.\n\nToday we'll explore the elements of compelling narratives, character development, and techniques to engage your readers. Let's unlock your storytelling potential!`,
          visual: '📚✨',
          duration: 15
        }
      ],
      default: [
        {
          id: 'intro-writing',
          type: 'introduction' as const,
          title: 'Welcome to Writing!',
          content: `Let's explore creative writing together!`,
          duration: 10
        }
      ]
    }
  };

  // Get subject lessons or fallback
  const subjectLessons = baseLessons[subject as keyof typeof baseLessons];
  if (!subjectLessons) {
    return [
      {
        id: 'intro',
        type: 'introduction' as const,
        title: `Welcome to ${subject}!`,
        content: `Let's explore ${topic} together!`,
        duration: 10
      }
    ];
  }

  // Get topic lessons or default
  const topicLessons = (subjectLessons as any)[topic] || (subjectLessons as any).default;
  return topicLessons || [
    {
      id: 'intro',
      type: 'introduction' as const,
      title: `Welcome to ${subject}!`,
      content: `Let's explore ${topic} together!`,
      duration: 10
    }
  ];
}