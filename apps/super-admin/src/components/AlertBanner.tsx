import { motion } from 'framer-motion';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SystemAlert } from '@/types';
import { usePlatformStore } from '@/stores/platformStore';

interface AlertBannerProps {
  alerts: SystemAlert[];
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const navigate = useNavigate();
  const { resolveAlert, setCriticalMode } = usePlatformStore();

  if (!alerts.length) return null;

  const primaryAlert = alerts[0];

  const handleDismiss = () => {
    setCriticalMode(false);
  };

  const handleResolve = (alertId: string) => {
    resolveAlert(alertId);
  };

  const handleAction = (action: SystemAlert['actions'][0]) => {
    if (action.url) {
      navigate(action.url);
    }
    if (action.type === 'acknowledge') {
      handleResolve(primaryAlert.id);
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-red-900/50 border-b border-red-500 backdrop-blur"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            <div>
              <span className="font-medium text-red-100">{primaryAlert.title}</span>
              <span className="mx-2 text-red-300">•</span>
              <span className="text-red-200">{primaryAlert.message}</span>
              {alerts.length > 1 && (
                <span className="ml-2 px-2 py-0.5 bg-red-600 rounded-full text-xs text-white">
                  +{alerts.length - 1} more
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Action Buttons */}
            {primaryAlert.actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white transition-colors"
              >
                {action.label}
                {action.url && <ArrowRight className="w-3 h-3" />}
              </button>
            ))}

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="p-1 text-red-300 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}