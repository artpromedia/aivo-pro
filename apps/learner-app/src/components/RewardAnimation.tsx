import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';

interface RewardAnimationProps {
  streak: number;
}

export const RewardAnimation: React.FC<RewardAnimationProps> = ({ streak }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none flex items-start justify-center mt-16"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl border border-yellow-200 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
          {streak >= 3 ? <Trophy className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-yellow-700">Awesome streak!</p>
          <p className="text-lg font-bold text-yellow-600">{streak} in a row</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
