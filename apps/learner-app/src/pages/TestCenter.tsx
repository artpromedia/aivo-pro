import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Calculator, 
  Beaker, 
  Globe, 
  X,
  ArrowLeft,
  ArrowRight,
  Flag,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'matching' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

interface Test {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number; // in minutes
  totalPoints: number;
  questions: Question[];
  description: string;
  icon: any;
  bgGradient: string;
}

interface TestCenterProps {
  childName: string;
  childAge: number;
  childGrade: string;
  onClose: () => void;
}

export const TestCenter: React.FC<TestCenterProps> = ({ childName, childAge, childGrade, onClose }) => {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);

  // Generate grade-appropriate tests
  const generateTests = (): Test[] => {
    const gradeNum = childGrade === 'K' ? 0 : parseInt(childGrade);
    
    if (gradeNum <= 5) {
      // K-5 Tests
      return [
        {
          id: 'math-basic',
          title: 'Addition & Subtraction Quiz',
          subject: 'Math',
          grade: childGrade,
          duration: 15,
          totalPoints: 50,
          icon: Calculator,
          bgGradient: 'from-blue-400 to-blue-600',
          description: 'Test your addition and subtraction skills with fun problems!',
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'What is 7 + 5?',
              options: ['10', '11', '12', '13'],
              correctAnswer: 2,
              points: 10,
              difficulty: 'easy',
              explanation: '7 + 5 = 12. Count up from 7: 8, 9, 10, 11, 12!'
            },
            {
              id: '2',
              type: 'multiple-choice',
              question: 'What is 15 - 8?',
              options: ['6', '7', '8', '9'],
              correctAnswer: 1,
              points: 10,
              difficulty: 'medium',
              explanation: '15 - 8 = 7. You can think of it as: what plus 8 equals 15?'
            },
            {
              id: '3',
              type: 'multiple-choice',
              question: 'If you have 3 apples and get 4 more, how many do you have?',
              options: ['6', '7', '8', '9'],
              correctAnswer: 1,
              points: 10,
              difficulty: 'easy',
              explanation: '3 + 4 = 7 apples total!'
            },
            {
              id: '4',
              type: 'short-answer',
              question: 'Write the number that comes after 19.',
              correctAnswer: '20',
              points: 10,
              difficulty: 'medium',
              explanation: 'After 19 comes 20. This is when we move to the next "ten"!'
            },
            {
              id: '5',
              type: 'multiple-choice',
              question: 'Which is bigger: 25 or 23?',
              options: ['25', '23', 'They are the same'],
              correctAnswer: 0,
              points: 10,
              difficulty: 'easy',
              explanation: '25 is bigger than 23 because 25 has more ones!'
            }
          ]
        },
        {
          id: 'reading-basic',
          title: 'Reading Comprehension',
          subject: 'Reading',
          grade: childGrade,
          duration: 20,
          totalPoints: 60,
          icon: BookOpen,
          bgGradient: 'from-purple-400 to-purple-600',
          description: 'Read stories and answer questions about what you learned!',
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'Read this sentence: "The cat sat on the mat." Where did the cat sit?',
              options: ['On the hat', 'On the mat', 'On the bat', 'On the rat'],
              correctAnswer: 1,
              points: 12,
              difficulty: 'easy',
              explanation: 'The sentence says "The cat sat on the mat."'
            },
            {
              id: '2',
              type: 'multiple-choice',
              question: 'What sound does the letter "B" make?',
              options: ['/b/ like in "ball"', '/d/ like in "dog"', '/p/ like in "pig"'],
              correctAnswer: 0,
              points: 12,
              difficulty: 'easy',
              explanation: 'The letter B makes the /b/ sound, like in "ball" or "big"!'
            },
            {
              id: '3',
              type: 'short-answer',
              question: 'What is the opposite of "hot"?',
              correctAnswer: 'cold',
              points: 12,
              difficulty: 'medium',
              explanation: 'The opposite of hot is cold!'
            },
            {
              id: '4',
              type: 'multiple-choice',
              question: 'Which word rhymes with "cat"?',
              options: ['dog', 'hat', 'car', 'sun'],
              correctAnswer: 1,
              points: 12,
              difficulty: 'medium',
              explanation: '"Hat" rhymes with "cat" because they both end with the "-at" sound!'
            },
            {
              id: '5',
              type: 'short-answer',
              question: 'How many letters are in the word "dog"?',
              correctAnswer: '3',
              points: 12,
              difficulty: 'easy',
              explanation: 'The word "dog" has 3 letters: d-o-g!'
            }
          ]
        }
      ];
    } else if (gradeNum <= 8) {
      // 6-8 Tests (Middle School)
      return [
        {
          id: 'algebra-basics',
          title: 'Pre-Algebra Assessment',
          subject: 'Math',
          grade: childGrade,
          duration: 30,
          totalPoints: 100,
          icon: Calculator,
          bgGradient: 'from-blue-500 to-blue-700',
          description: 'Evaluate your understanding of algebraic concepts and problem-solving.',
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'Solve for x: 2x + 5 = 13',
              options: ['x = 3', 'x = 4', 'x = 6', 'x = 9'],
              correctAnswer: 1,
              points: 20,
              difficulty: 'medium',
              explanation: '2x + 5 = 13, so 2x = 8, therefore x = 4'
            },
            {
              id: '2',
              type: 'multiple-choice',
              question: 'What is the slope of the line y = 3x - 2?',
              options: ['3', '-2', '2', '5'],
              correctAnswer: 0,
              points: 20,
              difficulty: 'medium',
              explanation: 'In slope-intercept form y = mx + b, the slope is m = 3'
            },
            {
              id: '3',
              type: 'short-answer',
              question: 'Simplify: 3(x + 4) - 2x',
              correctAnswer: 'x + 12',
              points: 20,
              difficulty: 'medium',
              explanation: '3(x + 4) - 2x = 3x + 12 - 2x = x + 12'
            },
            {
              id: '4',
              type: 'multiple-choice',
              question: 'If f(x) = 2x + 1, what is f(3)?',
              options: ['5', '6', '7', '8'],
              correctAnswer: 2,
              points: 20,
              difficulty: 'hard',
              explanation: 'f(3) = 2(3) + 1 = 6 + 1 = 7'
            },
            {
              id: '5',
              type: 'multiple-choice',
              question: 'Which represents the distributive property?',
              options: ['a + b = b + a', 'a(b + c) = ab + ac', 'a × 1 = a'],
              correctAnswer: 1,
              points: 20,
              difficulty: 'medium',
              explanation: 'The distributive property states that a(b + c) = ab + ac'
            }
          ]
        },
        {
          id: 'science-earth',
          title: 'Earth Science Quiz',
          subject: 'Science',
          grade: childGrade,
          duration: 25,
          totalPoints: 80,
          icon: Globe,
          bgGradient: 'from-green-500 to-green-700',
          description: 'Test your knowledge of Earth systems, weather, and geology.',
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'What causes the seasons on Earth?',
              options: ['Distance from the Sun', 'Earth\'s tilt', 'Solar flares', 'Moon phases'],
              correctAnswer: 1,
              points: 16,
              difficulty: 'medium',
              explanation: 'Earth\'s tilt of 23.5° causes different parts to receive varying amounts of sunlight throughout the year.'
            },
            {
              id: '2',
              type: 'multiple-choice',
              question: 'Which layer of the atmosphere contains the ozone layer?',
              options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
              correctAnswer: 1,
              points: 16,
              difficulty: 'hard',
              explanation: 'The ozone layer is located in the stratosphere, about 10-30 km above Earth\'s surface.'
            },
            {
              id: '3',
              type: 'short-answer',
              question: 'What type of rock is formed from cooled magma?',
              correctAnswer: 'igneous',
              points: 16,
              difficulty: 'medium',
              explanation: 'Igneous rocks form when magma or lava cools and solidifies.'
            },
            {
              id: '4',
              type: 'multiple-choice',
              question: 'What drives the water cycle?',
              options: ['Wind', 'Gravity', 'Solar energy', 'Ocean currents'],
              correctAnswer: 2,
              points: 16,
              difficulty: 'medium',
              explanation: 'Solar energy drives evaporation and the entire water cycle.'
            },
            {
              id: '5',
              type: 'multiple-choice',
              question: 'Earthquakes are most commonly caused by:',
              options: ['Volcanic eruptions', 'Tectonic plate movement', 'Meteorite impacts', 'Ocean waves'],
              correctAnswer: 1,
              points: 16,
              difficulty: 'medium',
              explanation: 'Most earthquakes are caused by the movement of tectonic plates along fault lines.'
            }
          ]
        }
      ];
    } else {
      // 9-12 Tests (High School)
      return [
        {
          id: 'calculus-derivatives',
          title: 'AP Calculus: Derivatives',
          subject: 'Math',
          grade: childGrade,
          duration: 45,
          totalPoints: 120,
          icon: Calculator,
          bgGradient: 'from-slate-600 to-slate-800',
          description: 'Advanced calculus assessment covering derivative rules and applications.',
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'Find the derivative of f(x) = 3x⁴ - 2x² + 5x - 1',
              options: ['12x³ - 4x + 5', '12x³ - 4x² + 5', '3x³ - 2x + 5', '12x² - 4x + 5'],
              correctAnswer: 0,
              points: 24,
              difficulty: 'medium',
              explanation: 'Using the power rule: f\'(x) = 12x³ - 4x + 5'
            },
            {
              id: '2',
              type: 'short-answer',
              question: 'Find dy/dx if y = ln(x² + 1)',
              correctAnswer: '2x/(x² + 1)',
              points: 24,
              difficulty: 'hard',
              explanation: 'Using chain rule: dy/dx = 1/(x² + 1) × 2x = 2x/(x² + 1)'
            },
            {
              id: '3',
              type: 'multiple-choice',
              question: 'What is the derivative of sin(x)?',
              options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
              correctAnswer: 0,
              points: 24,
              difficulty: 'easy',
              explanation: 'The derivative of sin(x) is cos(x)'
            },
            {
              id: '4',
              type: 'multiple-choice',
              question: 'Find the critical points of f(x) = x³ - 3x² + 2',
              options: ['x = 0, 2', 'x = 1, 2', 'x = 0, 1', 'x = 2, 3'],
              correctAnswer: 0,
              points: 24,
              difficulty: 'hard',
              explanation: 'f\'(x) = 3x² - 6x = 3x(x - 2) = 0 when x = 0 or x = 2'
            },
            {
              id: '5',
              type: 'short-answer',
              question: 'If f(x) = e^(2x), find f\'(x)',
              correctAnswer: '2e^(2x)',
              points: 24,
              difficulty: 'medium',
              explanation: 'Using chain rule: f\'(x) = e^(2x) × 2 = 2e^(2x)'
            }
          ]
        },
        {
          id: 'chemistry-organic',
          title: 'Organic Chemistry Test',
          subject: 'Chemistry',
          grade: childGrade,
          duration: 40,
          totalPoints: 100,
          icon: Beaker,
          bgGradient: 'from-emerald-600 to-emerald-800',
          description: 'Comprehensive test on organic chemistry concepts and reactions.',
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'What is the general formula for alkanes?',
              options: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn'],
              correctAnswer: 1,
              points: 20,
              difficulty: 'medium',
              explanation: 'Alkanes are saturated hydrocarbons with formula CnH2n+2'
            },
            {
              id: '2',
              type: 'multiple-choice',
              question: 'Which functional group characterizes alcohols?',
              options: ['-COOH', '-OH', '-CHO', '-NH2'],
              correctAnswer: 1,
              points: 20,
              difficulty: 'easy',
              explanation: 'Alcohols contain the hydroxyl group (-OH)'
            },
            {
              id: '3',
              type: 'short-answer',
              question: 'Name the product of adding HBr to ethene (C2H4)',
              correctAnswer: 'bromoethane',
              points: 20,
              difficulty: 'medium',
              explanation: 'Ethene + HBr → bromoethane (CH3CH2Br) via addition reaction'
            },
            {
              id: '4',
              type: 'multiple-choice',
              question: 'What type of hybridization does carbon have in methane (CH4)?',
              options: ['sp', 'sp²', 'sp³', 'sp³d'],
              correctAnswer: 2,
              points: 20,
              difficulty: 'hard',
              explanation: 'Carbon in methane is sp³ hybridized, forming 4 equivalent bonds'
            },
            {
              id: '5',
              type: 'multiple-choice',
              question: 'Which reaction converts alkenes to alkanes?',
              options: ['Oxidation', 'Reduction', 'Substitution', 'Elimination'],
              correctAnswer: 1,
              points: 20,
              difficulty: 'medium',
              explanation: 'Hydrogenation (reduction) converts alkenes to alkanes by adding H2'
            }
          ]
        }
      ];
    }
  };

  const availableTests = generateTests();

  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testStarted) {
      handleSubmitTest();
    }
  }, [timeLeft, testStarted, testCompleted]);

  const startTest = (test: Test) => {
    setSelectedTest(test);
    setTimeLeft(test.duration * 60);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestStarted(true);
    setTestCompleted(false);
    setShowResults(false);
  };

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = (): number => {
    if (!selectedTest) return 0;
    
    let totalScore = 0;
    selectedTest.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined) {
        if (question.type === 'short-answer') {
          // Simple string comparison (in real app, would use more sophisticated matching)
          if (String(userAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim()) {
            totalScore += question.points;
          }
        } else if (question.type === 'multiple-choice') {
          if (userAnswer === question.correctAnswer) {
            totalScore += question.points;
          }
        }
      }
    });
    
    return totalScore;
  };

  const handleSubmitTest = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setTestCompleted(true);
    setShowResults(true);
    setTestStarted(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent work! 🌟';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  if (showResults && selectedTest) {
    const percentage = Math.round((score / selectedTest.totalPoints) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Award className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h2>
              <p className="text-gray-600">{selectedTest.title}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                  {percentage}%
                </div>
                <p className="text-xl text-gray-700 mb-2">{getScoreMessage(percentage)}</p>
                <p className="text-gray-600">
                  {score} out of {selectedTest.totalPoints} points
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Question Review</h3>
              
              {selectedTest.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = question.type === 'short-answer' 
                  ? String(userAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim()
                  : userAnswer === question.correctAnswer;

                return (
                  <div key={question.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {isCorrect ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="space-y-1 mb-2">
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex}
                                className={`text-sm px-3 py-1 rounded-lg ${
                                  optIndex === question.correctAnswer 
                                    ? 'bg-green-100 text-green-800' 
                                    : optIndex === userAnswer 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'text-gray-600'
                                }`}
                              >
                                {option} {optIndex === question.correctAnswer && '✓'}
                                {optIndex === userAnswer && optIndex !== question.correctAnswer && '✗'}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'short-answer' && (
                          <div className="space-y-1 mb-2">
                            <div className="text-sm">
                              <span className="text-gray-600">Your answer: </span>
                              <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {userAnswer || 'No answer'}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Correct answer: </span>
                              <span className="text-green-600">{question.correctAnswer}</span>
                            </div>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="bg-blue-50 rounded-lg p-3 mt-2">
                            <p className="text-sm text-blue-800">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedTest(null);
                  setShowResults(false);
                  setTestCompleted(false);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Take Another Test
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-coral-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Back to Dashboard
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (testStarted && selectedTest) {
    const currentQuestion = selectedTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedTest.questions.length) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Test Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedTest.title}</h2>
                <p className="text-gray-600">Question {currentQuestionIndex + 1} of {selectedTest.questions.length}</p>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  <Clock className="w-5 h-5 inline mr-2" />
                  {formatTime(timeLeft)}
                </div>
                <p className="text-sm text-gray-500">Time remaining</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Content */}
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentQuestion.question}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {currentQuestion.points} points
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <motion.label
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          answers[currentQuestion.id] === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={index}
                          checked={answers[currentQuestion.id] === index}
                          onChange={() => handleAnswer(currentQuestion.id, index)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-gray-900 font-medium">{option}</span>
                      </motion.label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'short-answer' && (
                  <div>
                    <textarea
                      value={answers[currentQuestion.id] as string || ''}
                      onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                      rows={4}
                    />
                  </div>
                )}

                {currentQuestion.type === 'true-false' && (
                  <div className="flex gap-4">
                    {['True', 'False'].map((option, index) => (
                      <motion.label
                        key={option}
                        whileHover={{ scale: 1.02 }}
                        className={`flex-1 flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          answers[currentQuestion.id] === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={index}
                          checked={answers[currentQuestion.id] === index}
                          onChange={() => handleAnswer(currentQuestion.id, index)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-gray-900 font-semibold text-lg">{option}</span>
                      </motion.label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {Object.keys(answers).length} of {selectedTest.questions.length} answered
                </span>
                
                {currentQuestionIndex === selectedTest.questions.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitTest}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Flag className="w-4 h-4" />
                    Submit Test
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentQuestionIndex(Math.min(selectedTest.questions.length - 1, currentQuestionIndex + 1))}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Test Center
              </h1>
              <p className="text-gray-600 text-lg">
                Take grade-appropriate assessments to measure your progress, {childName}!
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Tests Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {availableTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => startTest(test)}
              >
                <div className={`h-2 bg-gradient-to-r ${test.bgGradient}`} />
                
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${test.bgGradient} rounded-2xl flex items-center justify-center shadow-md`}>
                      <test.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{test.title}</h3>
                      <p className="text-gray-600 mb-2">{test.subject} • Grade {test.grade}</p>
                      <p className="text-sm text-gray-500">{test.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Duration</span>
                      </div>
                      <div className="font-bold text-gray-900">{test.duration} min</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs">Questions</span>
                      </div>
                      <div className="font-bold text-gray-900">{test.questions.length}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Target className="w-4 h-4" />
                        <span className="text-xs">Points</span>
                      </div>
                      <div className="font-bold text-gray-900">{test.totalPoints}</div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      startTest(test);
                    }}
                    className={`w-full py-3 bg-gradient-to-r ${test.bgGradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all`}
                  >
                    Start Test
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="mb-2">• Tests are automatically graded with instant feedback</p>
                    <p className="mb-2">• Each question includes detailed explanations</p>
                  </div>
                  <div>
                    <p className="mb-2">• Progress is tracked and saved to your profile</p>
                    <p className="mb-2">• Use results to identify areas for improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};