import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Globe, ArrowRight, Info } from 'lucide-react';
import { useCloning } from '../providers/CloningProvider';

export default function ModelConfiguration() {
  const navigate = useNavigate();
  const { sessionData } = useCloning();
  
  const [config, setConfig] = useState({
    learningStyle: 'adaptive', // adaptive, visual, kinesthetic, auditory
    difficultyProgression: 'moderate', // gentle, moderate, aggressive
    focusAreas: [] as string[],
    languageSupport: ['english'],
    gamificationLevel: 'medium', // low, medium, high
  });

  const focusAreaOptions = [
    { id: 'math', label: 'Mathematics', icon: '🔢' },
    { id: 'reading', label: 'Reading & Literacy', icon: '📚' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'social', label: 'Social Studies', icon: '🌍' },
    { id: 'critical', label: 'Critical Thinking', icon: '🧠' },
    { id: 'creativity', label: 'Creative Expression', icon: '🎨' },
  ];

  const toggleFocusArea = (areaId: string) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter(id => id !== areaId)
        : [...prev.focusAreas, areaId],
    }));
  };

  const handleStartCloning = () => {
    // Store configuration
    localStorage.setItem(`model-config-${sessionData.childId}`, JSON.stringify(config));
    navigate('/clone/process');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Configure Learning Model
          </h1>
          <p className="text-lg text-gray-600">
            Customize {sessionData.childName}'s AI learning model for optimal personalization
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Learning Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Learning Style</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { value: 'adaptive', label: 'Adaptive (Recommended)', desc: 'AI determines best approach' },
                { value: 'visual', label: 'Visual Learner', desc: 'Images, diagrams, videos' },
                { value: 'kinesthetic', label: 'Hands-On Learner', desc: 'Interactive activities' },
                { value: 'auditory', label: 'Auditory Learner', desc: 'Listening, discussion' },
              ].map(style => (
                <label
                  key={style.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    config.learningStyle === style.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="learningStyle"
                    value={style.value}
                    checked={config.learningStyle === style.value}
                    onChange={(e) => setConfig({ ...config, learningStyle: e.target.value })}
                    className="sr-only"
                  />
                  <div className="font-semibold text-gray-900 mb-1">{style.label}</div>
                  <div className="text-sm text-gray-600">{style.desc}</div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Difficulty Progression */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Difficulty Progression</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { value: 'gentle', label: 'Gentle', desc: 'Build confidence with gradual challenges' },
                { value: 'moderate', label: 'Moderate (Recommended)', desc: 'Balanced progression based on mastery' },
                { value: 'aggressive', label: 'Accelerated', desc: 'Rapid advancement for advanced learners' },
              ].map(level => (
                <label
                  key={level.value}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    config.difficultyProgression === level.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={level.value}
                    checked={config.difficultyProgression === level.value}
                    onChange={(e) => setConfig({ ...config, difficultyProgression: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Focus Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Learning Focus Areas</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {focusAreaOptions.map(area => (
                <label
                  key={area.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    config.focusAreas.includes(area.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={config.focusAreas.includes(area.id)}
                    onChange={() => toggleFocusArea(area.id)}
                    className="sr-only"
                  />
                  <div className="text-3xl mb-2">{area.icon}</div>
                  <div className="font-semibold text-gray-900">{area.label}</div>
                </label>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  Select all areas relevant to {sessionData.childName}'s current curriculum.
                  The AI will prioritize these subjects while maintaining a holistic approach.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Gamification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🎮</span>
              <h2 className="text-2xl font-bold text-gray-900">Gamification Level</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-4">
                <input
                  type="radio"
                  name="gamification"
                  value="low"
                  checked={config.gamificationLevel === 'low'}
                  onChange={(e) => setConfig({ ...config, gamificationLevel: e.target.value })}
                />
                <span className="font-semibold">Low - Focus on content with minimal game elements</span>
              </label>
              
              <label className="flex items-center gap-4">
                <input
                  type="radio"
                  name="gamification"
                  value="medium"
                  checked={config.gamificationLevel === 'medium'}
                  onChange={(e) => setConfig({ ...config, gamificationLevel: e.target.value })}
                />
                <span className="font-semibold">Medium - Balanced rewards and challenges</span>
              </label>
              
              <label className="flex items-center gap-4">
                <input
                  type="radio"
                  name="gamification"
                  value="high"
                  checked={config.gamificationLevel === 'high'}
                  onChange={(e) => setConfig({ ...config, gamificationLevel: e.target.value })}
                />
                <span className="font-semibold">High - Full game experience with quests and achievements</span>
              </label>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button
            onClick={() => navigate('/clone/consent')}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Consent
          </button>
          
          <button
            onClick={handleStartCloning}
            disabled={config.focusAreas.length === 0}
            className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              config.focusAreas.length > 0
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Model Cloning
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
