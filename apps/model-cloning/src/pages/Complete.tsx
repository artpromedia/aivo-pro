import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Rocket, Sparkles, Trophy } from 'lucide-react';
import { useCloning } from '../providers/CloningProvider';

export default function Complete() {
  const { sessionData, cloningResults } = useCloning();

  useEffect(() => {
    // Trigger confetti celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF7B5C', '#FF636F', '#A855F7', '#EC4899'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF7B5C', '#FF636F', '#A855F7', '#EC4899'],
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleLaunchLearnerApp = () => {
    // Redirect to learner app with all necessary parameters
    const gradeString = sessionData.grade.toString();
    const params = new URLSearchParams({
      childId: sessionData.childId,
      childName: sessionData.childName,
      age: calculateAgeFromGrade(gradeString),
      grade: gradeString,
      modelId: cloningResults?.modelId || `model_${sessionData.childId}`,
      source: 'model-cloning',
      baselineComplete: 'true',
    });

    window.location.href = `http://localhost:5176?${params.toString()}`;
  };

  // Helper to calculate approximate age from grade
  const calculateAgeFromGrade = (grade: string): string => {
    const gradeMatch = grade.match(/\d+/);
    if (gradeMatch) {
      const gradeNumber = parseInt(gradeMatch[0]);
      // Typical age range: Kindergarten (5), Grade 1 (6), Grade 2 (7), etc.
      const age = gradeNumber <= 0 ? 5 : gradeNumber + 5;
      return age.toString();
    }
    return '8'; // Default fallback age
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8 shadow-2xl"
        >
          <Trophy className="w-16 h-16 text-white" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            All Set! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {sessionData.childName}'s personalized AI learning model is ready to go!
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-2 gap-6 mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Fully Personalized</h3>
            <p className="text-sm text-gray-600">
              Tailored to {sessionData.childName}'s unique learning style, pace, and interests
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl mb-4">
              <Rocket className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Ready to Launch</h3>
            <p className="text-sm text-gray-600">
              Start learning immediately with adaptive content and real-time feedback
            </p>
          </div>
        </motion.div>

        {/* Launch Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
        >
          <button
            onClick={handleLaunchLearnerApp}
            className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
          >
            <Rocket className="w-6 h-6" />
            Launch Learner App
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 p-6 bg-white rounded-2xl shadow-lg"
        >
          <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
          <div className="text-left space-y-2 text-sm text-gray-600">
            <p>✓ Access the learner app anytime from your portal</p>
            <p>✓ Track progress and insights in real-time</p>
            <p>✓ The AI model improves with every interaction</p>
            <p>✓ Parents and teachers can monitor growth together</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
