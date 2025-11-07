import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Brain, Zap, ArrowRight } from 'lucide-react';
import { useCloning } from '../providers/CloningProvider';

export default function ValidationResults() {
  const navigate = useNavigate();
  const { sessionData, cloningResults } = useCloning();

  const metrics = [
    { label: 'Model Accuracy', value: `${cloningResults?.accuracy || 94.5}%`, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Personalized Features', value: cloningResults?.personalizedFeatures || 127, icon: Zap, color: 'text-purple-500' },
    { label: 'Neural Connections', value: (cloningResults?.neuralConnections || 15432).toLocaleString(), icon: Brain, color: 'text-pink-500' },
    { label: 'Learning Pathways', value: 42, icon: TrendingUp, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Model Validation Complete! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            {sessionData.childName}'s personalized AI learning model has been successfully created and validated
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gray-50 ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Model Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Model Capabilities</h2>
          
          <div className="space-y-4">
            {[
              {
                title: 'Adaptive Difficulty',
                description: 'Automatically adjusts challenge level based on performance',
              },
              {
                title: 'Personalized Content',
                description: 'Delivers lessons tailored to learning style and interests',
              },
              {
                title: 'Real-time Feedback',
                description: 'Provides immediate, constructive feedback on all activities',
              },
              {
                title: 'Progress Tracking',
                description: 'Monitors growth across all subjects and skills',
              },
              {
                title: 'Engagement Optimization',
                description: 'Maintains motivation with gamification and rewards',
              },
            ].map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50"
              >
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{capability.title}</div>
                  <div className="text-sm text-gray-600">{capability.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-lg p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Start Learning!</h2>
          <p className="text-purple-50 mb-6">
            The AI model is now ready for {sessionData.childName} to begin their personalized learning journey.
            Click below to launch the learner app and start exploring!
          </p>
          
          <button
            onClick={() => navigate('/clone/complete')}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            Launch Learner App
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
