import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Brain, ArrowRight, CheckCircle, TrendingUp, Star, Target } from 'lucide-react';
import { useAssessment } from '../providers/AssessmentProvider';
import confetti from 'canvas-confetti';

export const Complete: React.FC = () => {
  const { sessionData, assessmentResults } = useAssessment();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const proceedToModelCloning = () => {
    setRedirecting(true);
    
    // Convert answers object to responses array for model cloning service
    const responsesArray = Object.values(assessmentResults?.answers || {}).map((answer: any) => ({
      question: answer.question,
      answer: answer.answer,
      correct: answer.correct,
      subject: answer.subject,
      difficulty: answer.difficulty,
      timestamp: answer.timestamp,
      correct_answer: answer.correct ? answer.answer : '' // Include correct answer when available
    }));
    
    console.log('📊 Sending baseline data to model cloning:', {
      totalResponses: responsesArray.length,
      subjects: [...new Set(responsesArray.map(r => r.subject))],
      correctCount: responsesArray.filter(r => r.correct).length
    });
    
    // Prepare enhanced assessment data to pass to model cloning
    const assessmentData = {
      totalQuestions: assessmentResults?.totalQuestions || 15,
      responses: responsesArray, // ✅ Model cloning expects 'responses' array, not 'answers' object
      answers: assessmentResults?.answers || {}, // Keep for backward compatibility
      subjectPerformance: assessmentResults?.subjectPerformance || {},
      overallPerformance: assessmentResults?.overallPerformance || {},
      recommendedLevel: assessmentResults?.recommendedLevel || `Grade ${sessionData.grade}`,
      adaptiveData: assessmentResults?.adaptiveData || {},
      duration: assessmentResults?.duration || '25 minutes',
      completedAt: new Date().toISOString(),
      aiGenerated: true, // Flag to indicate this was AI-powered assessment
    };
    
    // Build URL with all required parameters for model cloning
    const params = new URLSearchParams({
      childId: sessionData.childId,
      childName: sessionData.childName,
      grade: sessionData.grade.toString(),
      enrolledBy: sessionData.enrolledBy,
      source: 'baseline-assessment',
      assessmentData: encodeURIComponent(JSON.stringify(assessmentData)),
    });
    
    // Add optional parameters if available
    if (sessionData.parentEmail) {
      params.append('parentEmail', sessionData.parentEmail);
    }
    if (sessionData.districtLicense) {
      params.append('districtLicense', sessionData.districtLicense);
    }
    
    setTimeout(() => {
      // Redirect to model cloning app
      const modelCloningUrl = `http://localhost:5180?${params.toString()}`;
      window.location.href = modelCloningUrl;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 md:p-12 text-center border border-white/20">
            {/* Trophy Icon */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Completion Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Assessment Complete! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Great job, {sessionData.childName}! We've learned a lot about your learning style.
            </p>

            {/* Results Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI-Powered Assessment Results</h3>
              </div>
              
              {/* Overall Performance */}
              {assessmentResults?.overallPerformance && (
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Performance</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {assessmentResults.overallPerformance.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      {assessmentResults.overallPerformance.level}
                    </span>
                  </div>
                </div>
              )}

              {/* Subject Performance */}
              {assessmentResults?.subjectPerformance && (
                <div className="grid gap-3">
                  {Object.entries(assessmentResults.subjectPerformance).map(([subject, data]: [string, any]) => (
                    <div key={subject} className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{subject}</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{data.percentage}%</div>
                          <div className="text-xs text-gray-500">{data.correct}/{data.total} correct</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">{data.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommended Level */}
              {assessmentResults?.recommendedLevel && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Recommended Learning Level: {assessmentResults.recommendedLevel}
                    </span>
                  </div>
                </div>
              )}

              {/* Basic stats for fallback */}
              {!assessmentResults?.overallPerformance && (
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600">Questions Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assessmentResults?.totalQuestions || 15}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Taken</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assessmentResults?.duration || '25 minutes'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Skills Identified */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Skills Identified</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['Problem Solving', 'Critical Thinking', 'Pattern Recognition', 'Reading Comprehension'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Next Step: Creating Your AI Tutor</h3>
              <p className="text-sm text-gray-700">
                We'll now use these results to create a personalized AI learning model just for {sessionData.childName}.
                This requires additional consent from your {sessionData.enrolledBy === 'parent' ? 'parent' : 'teacher'}.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={proceedToModelCloning}
              disabled={redirecting}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all ${
                redirecting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-lg'
              }`}
            >
              {redirecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Continue to AI Model Creation
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Info for Parent/Teacher */}
            {sessionData.enrolledBy === 'teacher' && (
              <p className="text-sm text-gray-500 mt-4">
                Parent notification will be sent before model creation
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
