import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, Cpu, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { useCloning } from '../providers/CloningProvider';

interface CloningStep {
  id: string;
  label: string;
  icon: any;
  duration: number; // in seconds
  status: 'pending' | 'processing' | 'complete';
}

export default function CloningProcess() {
  const navigate = useNavigate();
  const { sessionData, updateResults } = useCloning();
  
  const [steps, setSteps] = useState<CloningStep[]>([
    { id: 'data', label: 'Processing Assessment Data', icon: Database, duration: 3, status: 'pending' },
    { id: 'analysis', label: 'Analyzing Learning Patterns', icon: Brain, duration: 4, status: 'pending' },
    { id: 'clone', label: 'Cloning Base AI Model', icon: Cpu, duration: 5, status: 'pending' },
    { id: 'personalize', label: 'Personalizing Neural Networks', icon: Sparkles, duration: 4, status: 'pending' },
    { id: 'validate', label: 'Validating Model Accuracy', icon: CheckCircle2, duration: 3, status: 'pending' },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      // All steps complete - generate results and navigate
      const results = {
        modelId: `model_${sessionData.childId}_${Date.now()}`,
        accuracy: 94.5,
        personalizedFeatures: 127,
        neuralConnections: 15432,
        completedAt: new Date().toISOString(),
      };
      
      updateResults(results);
      setTimeout(() => navigate('/clone/validation'), 1000);
      return;
    }

    // Mark current step as processing
    setSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === currentStepIndex ? 'processing' : 
              idx < currentStepIndex ? 'complete' : 'pending'
    })));

    const currentStep = steps[currentStepIndex];
    const duration = currentStep.duration * 1000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const stepProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(stepProgress);

      if (stepProgress >= 100) {
        clearInterval(interval);
        setSteps(prev => prev.map((step, idx) => ({
          ...step,
          status: idx === currentStepIndex ? 'complete' : step.status
        })));
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
          setProgress(0);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentStepIndex, steps.length, sessionData, updateResults, navigate]);

  const overallProgress = ((currentStepIndex + (progress / 100)) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Creating AI Model
          </h1>
          <p className="text-lg text-gray-600">
            Cloning and personalizing learning model for {sessionData.childName}
          </p>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Overall Progress</span>
            <span className="text-3xl font-bold text-purple-500">{Math.round(overallProgress)}%</span>
          </div>
          
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isComplete = step.status === 'complete';
              const isPending = step.status === 'pending';

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${
                    isActive ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isComplete
                          ? 'bg-green-500'
                          : isActive
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : 'bg-gray-200'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : isActive ? (
                        <Icon className="w-6 h-6 text-white animate-pulse" />
                      ) : (
                        <Icon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-semibold transition-colors ${
                          isActive || isComplete ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </h3>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2"
                        >
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {isActive && (
                      <Loader2 className="w-6 h-6 text-purple-500 animate-spin flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-200"
        >
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Did you know?
          </h3>
          <p className="text-gray-700">
            Your personalized AI model will continuously learn and adapt based on {sessionData.childName}'s
            interactions, making each learning experience more effective than the last!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
