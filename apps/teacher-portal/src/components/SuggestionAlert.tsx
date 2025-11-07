import React from 'react';
import { AlertCircle, X, ArrowRight } from 'lucide-react';

interface SuggestionAlertProps {
  count: number;
  onViewAll: () => void;
  onDismiss?: () => void;
}

export const SuggestionAlert: React.FC<SuggestionAlertProps> = ({ 
  count, 
  onViewAll, 
  onDismiss 
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-amber-900">
              {count} New Suggestions Available
            </h3>
            <p className="text-sm text-amber-800 mt-1">
              AI has created personalized learning recommendations for your children
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};