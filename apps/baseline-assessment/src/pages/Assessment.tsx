import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, Clock } from 'lucide-react';
import { useAssessment } from '../providers/AssessmentProvider';

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { sessionData, currentQuestion, setCurrentQuestion, answers, setAnswers, updateResults } = useAssessment();
  
  // Mock questions - replace with real questions from API
  const questions = [
    {
      id: 1,
      subject: 'Math',
      question: 'What is 5 + 3?',
      options: ['6', '7', '8', '9'],
      correctAnswer: '8',
    },
    {
      id: 2,
      subject: 'Reading',
      question: 'Which word is a synonym for "happy"?',
      options: ['Sad', 'Joyful', 'Angry', 'Tired'],
      correctAnswer: 'Joyful',
    },
    {
      id: 3,
      subject: 'Math',
      question: 'If you have 12 apples and eat 4, how many do you have left?',
      options: ['6', '7', '8', '9'],
      correctAnswer: '8',
    },
    {
      id: 4,
      subject: 'Science',
      question: 'What do plants need to grow?',
      options: ['Only water', 'Only sunlight', 'Water, sunlight, and air', 'Only soil'],
      correctAnswer: 'Water, sunlight, and air',
    },
    {
      id: 5,
      subject: 'Reading',
      question: 'What is the main idea of a story?',
      options: ['The first sentence', 'What the story is mostly about', 'The last word', 'The title'],
      correctAnswer: 'What the story is mostly about',
    },
    {
      id: 6,
      subject: 'Math',
      question: 'What is 7 × 3?',
      options: ['18', '21', '24', '27'],
      correctAnswer: '21',
    },
    {
      id: 7,
      subject: 'Science',
      question: 'Which of these is a mammal?',
      options: ['Eagle', 'Shark', 'Dolphin', 'Snake'],
      correctAnswer: 'Dolphin',
    },
    {
      id: 8,
      subject: 'Reading',
      question: 'What does the word "enormous" mean?',
      options: ['Very small', 'Very large', 'Very fast', 'Very slow'],
      correctAnswer: 'Very large',
    },
    {
      id: 9,
      subject: 'Math',
      question: 'What is the value of the 5 in the number 2,573?',
      options: ['5', '50', '500', '5,000'],
      correctAnswer: '500',
    },
    {
      id: 10,
      subject: 'Social Studies',
      question: 'Which of these is a continent?',
      options: ['Canada', 'Europe', 'New York', 'California'],
      correctAnswer: 'Europe',
    },
    {
      id: 11,
      subject: 'Math',
      question: 'What fraction is equal to one half?',
      options: ['1/4', '2/4', '3/5', '3/6'],
      correctAnswer: '2/4',
    },
    {
      id: 12,
      subject: 'Science',
      question: 'What causes day and night on Earth?',
      options: ['The moon', 'Earth rotating', 'The sun moving', 'Clouds'],
      correctAnswer: 'Earth rotating',
    },
    {
      id: 13,
      subject: 'Reading',
      question: 'What is a verb?',
      options: ['A person, place, or thing', 'An action word', 'A describing word', 'A connecting word'],
      correctAnswer: 'An action word',
    },
    {
      id: 14,
      subject: 'Math',
      question: 'If a rectangle has a length of 8 cm and width of 3 cm, what is its perimeter?',
      options: ['11 cm', '22 cm', '24 cm', '26 cm'],
      correctAnswer: '22 cm',
    },
    {
      id: 15,
      subject: 'Critical Thinking',
      question: 'If all roses are flowers, and some flowers are red, which statement must be true?',
      options: ['All roses are red', 'Some roses might be red', 'No roses are red', 'All flowers are roses'],
      correctAnswer: 'Some roses might be red',
    },
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    // Show break screen halfway through (after question 7)
    if (currentQuestion === 6) {
      setCurrentQuestion(7); // Save progress to resume after break
      navigate('/break');
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment complete
      updateResults({
        totalQuestions: questions.length,
        answers: newAnswers,
        duration: '25', // Calculate actual duration
      });
      navigate('/complete');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
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
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20"
        >
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              {questions[currentQuestion].subject}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              {questions[currentQuestion].question}
            </h2>
          </div>

          <div className="grid gap-4">
            {questions[currentQuestion].options.map((option, index) => (
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
