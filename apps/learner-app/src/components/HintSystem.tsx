import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles } from 'lucide-react';

interface HintSystemProps {
  hints: string[];
  visibleIndex: number | null;
  onRevealNext: () => void;
  canReveal: boolean;
  adaptiveMessage?: string;
}

export const HintSystem: React.FC<HintSystemProps> = ({
  hints,
  visibleIndex,
  onRevealNext,
  canReveal,
  adaptiveMessage,
}) => {
  const hasHints = hints && hints.length > 0;

  if (!hasHints) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">Smart Hints</span>
        </div>
        <button
          type="button"
          onClick={onRevealNext}
          disabled={!canReveal}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            canReveal
              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Reveal next hint
        </button>
      </div>

      {adaptiveMessage && (
        <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
          <Sparkles className="w-4 h-4" />
          {adaptiveMessage}
        </div>
      )}

      <AnimatePresence>
        {visibleIndex !== null && (
          <motion.div
            key={visibleIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center font-semibold text-yellow-600">
                {visibleIndex + 1}
              </div>
              <div className="text-gray-800">
                {hints.slice(0, visibleIndex + 1).map((hint, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {hint}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
