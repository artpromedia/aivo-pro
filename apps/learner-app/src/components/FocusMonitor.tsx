import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Brain, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { useFocusTracking } from '../hooks/useFocusTracking';
import { useTheme } from '../providers/ThemeProvider';

interface FocusMonitorProps {
  onGameBreakNeeded: () => void;
  isVisible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const FocusMonitor: React.FC<FocusMonitorProps> = ({
  onGameBreakNeeded,
  isVisible = true,
  position = 'top-right'
}) => {
  const { colors } = useTheme();
  const { metrics, acknowledgeBreak } = useFocusTracking({
    inactivityThreshold: 45000, // 45 seconds for kids
    lowFocusThreshold: 35, // Lower threshold for young learners
    breakInterval: 900000, // 15 minutes for children
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);

  // Monitor for low focus or break needed
  useEffect(() => {
    if ((metrics.focusScore < 35 || metrics.needsBreak) && !alertTriggered) {
      setShowAlert(true);
      setAlertTriggered(true);
      
      // Auto-trigger game break after 5 seconds if not dismissed
      const timeout = setTimeout(() => {
        onGameBreakNeeded();
        acknowledgeBreak();
        setShowAlert(false);
        setAlertTriggered(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [metrics.focusScore, metrics.needsBreak, alertTriggered, onGameBreakNeeded, acknowledgeBreak]);

  // Reset alert trigger when focus improves
  useEffect(() => {
    if (metrics.focusScore > 60 && !metrics.needsBreak) {
      setAlertTriggered(false);
    }
  }, [metrics.focusScore, metrics.needsBreak]);

  const getFocusColor = (score: number) => {
    if (score >= 80) return colors.secondary;
    if (score >= 60) return colors.primary;
    if (score >= 40) return colors.accent;
    return '#EF4444';
  };

  const getFocusEmoji = (score: number) => {
    if (score >= 80) return '🎯';
    if (score >= 60) return '👀';
    if (score >= 40) return '😐';
    return '😴';
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Focus Monitor Widget */}
      <motion.div
        className={`fixed ${positionClasses[position]} z-40 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-4 min-w-[280px]`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Eye className="w-6 h-6" style={{ color: getFocusColor(metrics.focusScore) }} />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ backgroundColor: getFocusColor(metrics.focusScore) }}
              animate={{ scale: metrics.isActive ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: metrics.isActive ? Infinity : 0 }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Focus Monitor</h3>
            <p className="text-xs text-gray-600">
              {getFocusEmoji(metrics.focusScore)} {metrics.isActive ? 'Focused' : 'Distracted'}
            </p>
          </div>
        </div>

        {/* Focus Score Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Focus Score</span>
            <span className="text-xs font-semibold" style={{ color: getFocusColor(metrics.focusScore) }}>
              {Math.round(metrics.focusScore)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full"
              style={{ backgroundColor: getFocusColor(metrics.focusScore) }}
              animate={{ width: `${metrics.focusScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600">
              {Math.floor(metrics.timeSpentFocused / 60)}m focused
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600">
              {metrics.distractionCount} distractions
            </span>
          </div>
        </div>

        {/* Break Timer */}
        {metrics.totalTimeSpent > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <Brain className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-gray-600">
                Next break in {Math.max(0, 15 - Math.floor(metrics.totalTimeSpent / 60))} minutes
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Focus Alert Modal */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="text-6xl mb-4">
                {metrics.needsBreak ? '🧠' : '😴'}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {metrics.needsBreak ? 'Time for a Brain Break!' : 'Let\'s Refocus!'}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {metrics.needsBreak 
                  ? 'You\'ve been learning great! Let\'s play a quick game to refresh your mind.'
                  : 'I noticed you might be getting distracted. How about a fun game to help you focus?'
                }
              </p>

              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={() => {
                    onGameBreakNeeded();
                    acknowledgeBreak();
                    setShowAlert(false);
                    setAlertTriggered(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Let's Play!
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    acknowledgeBreak();
                    setShowAlert(false);
                    setAlertTriggered(false);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue Learning
                </motion.button>
              </div>

              {/* Auto-play countdown */}
              <div className="mt-4 text-xs text-gray-500">
                Game will start automatically in 5 seconds...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};