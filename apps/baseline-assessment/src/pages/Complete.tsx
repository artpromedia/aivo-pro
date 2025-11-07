import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Brain, ArrowRight, CheckCircle } from 'lucide-react';
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
    
    // Prepare assessment data to pass to model cloning
    const assessmentData = {
      totalQuestions: assessmentResults?.totalQuestions || 15,
      answers: assessmentResults?.answers || {},
      duration: assessmentResults?.duration || '25',
      completedAt: new Date().toISOString(),
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
              <h3 className="font-semibold text-gray-900 mb-4">Assessment Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Questions Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {assessmentResults?.totalQuestions || 20}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Taken</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {assessmentResults?.duration || '25'} min
                  </p>
                </div>
              </div>
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
