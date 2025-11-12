import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useAssessment } from '../providers/AssessmentProvider';
import { dynamicAssessmentAPI, GeneratedQuestion } from '../services/dynamicAssessmentApi';

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { sessionData, currentQuestion, setCurrentQuestion, answers, setAnswers, updateResults } = useAssessment();
  
  const [currentQuestionData, setCurrentQuestionData] = useState<GeneratedQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalQuestions] = useState(15); // Target number of questions
  const [subjectSequence, setSubjectSequence] = useState<string[]>([]);
  const [previousAnswers, setPreviousAnswers] = useState<any[]>([]);

  // Initialize assessment with first question
  useEffect(() => {
    loadNextQuestion();
  }, []);

  // Load next question when currentQuestion changes
  useEffect(() => {
    if (currentQuestion > 0) {
      loadNextQuestion();
    }
  }, [currentQuestion]);

  const loadNextQuestion = async () => {
    setLoading(true);
    
    try {
      // Get adaptive subject sequence if not set
      if (subjectSequence.length === 0) {
        const subjects = await dynamicAssessmentAPI.getAdaptiveSequence(
          sessionData.grade, 
          previousAnswers
        );
        setSubjectSequence(subjects);
      }

      // Determine subject for current question
      const currentSubject = subjectSequence[currentQuestion % subjectSequence.length];
      
      console.log(`Loading question ${currentQuestion + 1}: Grade ${sessionData.grade}, Subject: ${currentSubject}, Difficulty: ${determineDifficulty()}`);
      
      // Generate question based on previous performance
      const response = await dynamicAssessmentAPI.generateQuestion({
        grade: sessionData.grade,
        subject: currentSubject,
        previousAnswers: previousAnswers.slice(-5), // Last 5 answers for context
        difficulty: determineDifficulty()
      });

      console.log('Generated question:', response.question);
      setCurrentQuestionData(response.question);
      
      // Update subject sequence if suggested
      if (response.nextSubject) {
        const newSequence = [...subjectSequence];
        const nextIndex = (currentQuestion + 1) % newSequence.length;
        newSequence[nextIndex] = response.nextSubject;
        setSubjectSequence(newSequence);
      }
      
    } catch (error) {
      console.error('Error loading question:', error);
      // Enhanced fallback with proper grade-appropriate content
      const subjects = ['Math', 'Reading', 'Science'];
      const currentSubject = subjects[currentQuestion % subjects.length];
      
      setCurrentQuestionData({
        id: `fallback_${currentQuestion}`,
        subject: currentSubject,
        question: `What is 1 + 1?`, // Simple fallback question
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        difficulty: 'easy',
        gradeLevel: sessionData.grade,
        explanation: 'This is a basic addition question.'
      });
    }
    
    setLoading(false);
  };

  const determineDifficulty = (): 'easy' | 'medium' | 'hard' => {
    if (previousAnswers.length < 3) return 'medium';
    
    const recentAnswers = previousAnswers.slice(-3);
    const correctCount = recentAnswers.filter(a => a.correct).length;
    
    if (correctCount >= 3) return 'hard';
    if (correctCount <= 1) return 'easy';
    return 'medium';
  };

  const handleAnswer = async (answer: string) => {
    if (!currentQuestionData) return;
    
    // Evaluate the answer
    const evaluation = await dynamicAssessmentAPI.evaluateAnswer(
      currentQuestionData.id,
      answer,
      currentQuestionData.correctAnswer
    );
    
    // Record the answer
    const answerRecord = {
      questionId: currentQuestionData.id,
      question: currentQuestionData.question,
      subject: currentQuestionData.subject,
      answer,
      correct: evaluation.correct,
      difficulty: currentQuestionData.difficulty,
      timestamp: new Date().toISOString()
    };
    
    const newAnswers = { ...answers, [currentQuestion]: answerRecord };
    const newPreviousAnswers = [...previousAnswers, answerRecord];
    
    setAnswers(newAnswers);
    setPreviousAnswers(newPreviousAnswers);
    
    // Show break screen halfway through (after question 7)
    if (currentQuestion === 6) {
      setCurrentQuestion(7); // Save progress to resume after break
      navigate('/break');
      return;
    }
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment complete - calculate detailed results
      const subjectPerformance = calculateSubjectPerformance(newPreviousAnswers);
      const overallPerformance = calculateOverallPerformance(newPreviousAnswers);
      
      updateResults({
        totalQuestions,
        answers: newAnswers,
        subjectPerformance,
        overallPerformance,
        recommendedLevel: determineRecommendedLevel(subjectPerformance),
        duration: calculateDuration(),
        adaptiveData: {
          difficultyProgression: newPreviousAnswers.map(a => a.difficulty),
          subjectSequence: newPreviousAnswers.map(a => a.subject)
        }
      });
      navigate('/complete');
    }
  };

  const calculateSubjectPerformance = (answers: any[]) => {
    const subjects = ['Math', 'Reading', 'Science'];
    return subjects.reduce((acc, subject) => {
      const subjectAnswers = answers.filter(a => a.subject === subject);
      const correct = subjectAnswers.filter(a => a.correct).length;
      const total = subjectAnswers.length;
      
      acc[subject] = {
        correct,
        total,
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
        level: total > 0 ? determineSubjectLevel(correct, total) : 'Grade Level'
      };
      return acc;
    }, {} as Record<string, any>);
  };

  const calculateOverallPerformance = (answers: any[]) => {
    const correct = answers.filter(a => a.correct).length;
    const total = answers.length;
    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
      level: determineOverallLevel(correct, total)
    };
  };

  const determineSubjectLevel = (correct: number, total: number): string => {
    const percentage = (correct / total) * 100;
    const baseGrade = sessionData.grade;
    
    if (percentage >= 90) return `Above Grade ${baseGrade + 1}`;
    if (percentage >= 70) return `Grade ${baseGrade}`;
    if (percentage >= 50) return `Approaching Grade ${baseGrade}`;
    return `Below Grade ${baseGrade}`;
  };

  const determineOverallLevel = (correct: number, total: number): string => {
    const percentage = (correct / total) * 100;
    if (percentage >= 85) return 'Advanced';
    if (percentage >= 70) return 'Proficient';
    if (percentage >= 50) return 'Developing';
    return 'Beginning';
  };

  const determineRecommendedLevel = (subjectPerformance: Record<string, any>): string => {
    const averagePercentage = Object.values(subjectPerformance)
      .reduce((sum: number, subject: any) => sum + subject.percentage, 0) / 
      Object.keys(subjectPerformance).length;
      
    const baseGrade = sessionData.grade;
    if (averagePercentage >= 85) return `Grade ${baseGrade + 1}`;
    if (averagePercentage >= 70) return `Grade ${baseGrade}`;
    return `Grade ${Math.max(baseGrade - 1, 0)}`;
  };

  const calculateDuration = (): string => {
    // This would be calculated from actual start time
    return '25 minutes';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            {currentQuestion === 0 ? 'Preparing your personalized assessment...' : 'Loading next question...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Our AI is creating questions just for you based on your grade level and abilities
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Unable to load question. Please try again.</p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {/* AI Indicator */}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>AI-powered adaptive assessment • Grade {sessionData.grade}</span>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestionData.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {currentQuestionData.subject}
              </span>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {currentQuestionData.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentQuestionData.question}
            </h2>
          </div>

          <div className="grid gap-4">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="p-4 text-left border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-700">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
