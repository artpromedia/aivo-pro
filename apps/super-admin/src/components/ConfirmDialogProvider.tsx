import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';

export interface ConfirmDialogOptions {
  title: string;
  description: string;
  type?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  details?: string[];
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  id: string;
  isOpen: boolean;
  isLoading?: boolean;
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  alert: (title: string, description: string, type?: ConfirmDialogOptions['type']) => Promise<void>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
};

interface ConfirmDialogProviderProps {
  children: ReactNode;
}

export const ConfirmDialogProvider: React.FC<ConfirmDialogProviderProps> = ({ children }) => {
  const [dialog, setDialog] = useState<ConfirmDialogState | null>(null);

  const confirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substring(2, 9);
      
      setDialog({
        ...options,
        id,
        isOpen: true,
        onConfirm: async () => {
          setDialog(prev => prev ? { ...prev, isLoading: true } : null);
          
          try {
            await options.onConfirm?.();
            resolve(true);
          } catch (error) {
            console.error('Confirm action failed:', error);
            resolve(false);
          } finally {
            setDialog(null);
          }
        },
        onCancel: () => {
          options.onCancel?.();
          setDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  const alert = useCallback((
    title: string, 
    description: string, 
    type: ConfirmDialogOptions['type'] = 'info'
  ): Promise<void> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substring(2, 9);
      
      setDialog({
        title,
        description,
        type,
        id,
        isOpen: true,
        confirmText: 'OK',
        onConfirm: () => {
          setDialog(null);
          resolve();
        }
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (dialog && !dialog.isLoading) {
      dialog.onCancel?.();
    }
  }, [dialog]);

  return (
    <ConfirmDialogContext.Provider value={{ confirm, alert }}>
      {children}
      <AnimatePresence>
        {dialog?.isOpen && (
          <ConfirmDialogComponent dialog={dialog} onClose={handleClose} />
        )}
      </AnimatePresence>
    </ConfirmDialogContext.Provider>
  );
};

interface ConfirmDialogComponentProps {
  dialog: ConfirmDialogState;
  onClose: () => void;
}

const ConfirmDialogComponent: React.FC<ConfirmDialogComponentProps> = ({ dialog, onClose }) => {
  const getIcon = () => {
    if (dialog.icon) return dialog.icon;
    
    switch (dialog.type) {
      case 'danger':
        return <XCircle className="h-8 w-8 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'info':
        return <Info className="h-8 w-8 text-blue-600" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-gray-600" />;
    }
  };

  const getButtonStyles = () => {
    switch (dialog.type) {
      case 'danger':
        return {
          confirm: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          cancel: 'bg-gray-300 hover:bg-gray-400 text-gray-900'
        };
      case 'warning':
        return {
          confirm: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          cancel: 'bg-gray-300 hover:bg-gray-400 text-gray-900'
        };
      case 'success':
        return {
          confirm: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          cancel: 'bg-gray-300 hover:bg-gray-400 text-gray-900'
        };
      default:
        return {
          confirm: 'bg-coral-600 hover:bg-coral-700 focus:ring-coral-500',
          cancel: 'bg-gray-300 hover:bg-gray-400 text-gray-900'
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {getIcon()}
            <h2 className="text-xl font-semibold text-gray-900">{dialog.title}</h2>
          </div>
          
          {!dialog.isLoading && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">{dialog.description}</p>
          
          {dialog.details && dialog.details.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Details:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {dialog.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
          {dialog.onCancel && (
            <button
              onClick={dialog.onCancel}
              disabled={dialog.isLoading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonStyles.cancel} ${
                dialog.isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {dialog.cancelText || 'Cancel'}
            </button>
          )}
          
          <button
            onClick={dialog.onConfirm}
            disabled={dialog.isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonStyles.confirm} ${
              dialog.isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {dialog.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              dialog.confirmText || 'Confirm'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmDialogProvider;