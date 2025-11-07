import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ current, total }) => {
  const safeTotal = Math.max(total, 1);
  const progress = Math.min(Math.max(current / safeTotal, 0), 1);

  return (
    <div className="flex items-center gap-3">
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700">
        {current}/{safeTotal}
      </span>
    </div>
  );
};
