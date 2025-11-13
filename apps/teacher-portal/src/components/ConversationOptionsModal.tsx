import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  BellOff,
  Archive,
  Trash2,
  Flag,
  UserMinus,
  Settings,
  Info,
  Users,
  Calendar,
  MessageCircle
} from 'lucide-react';

interface ConversationOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationName: string;
  isMuted: boolean;
  onMute: () => void;
  onArchive: () => void;
  onBlock: () => void;
  onReport: () => void;
  onDelete: () => void;
}

export const ConversationOptionsModal: React.FC<ConversationOptionsModalProps> = ({
  isOpen,
  onClose,
  conversationName,
  isMuted,
  onMute,
  onArchive,
  onBlock,
  onReport,
  onDelete
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const options = [
    {
      icon: isMuted ? Bell : BellOff,
      label: isMuted ? 'Unmute Conversation' : 'Mute Conversation',
      description: isMuted ? 'Receive notifications again' : 'Stop receiving notifications',
      action: onMute,
      color: 'text-blue-600 hover:bg-blue-50'
    },
    {
      icon: Info,
      label: 'Conversation Info',
      description: 'View conversation details and members',
      action: () => {
        setShowInfo(true);
      },
      color: 'text-gray-600 hover:bg-gray-50'
    },
    {
      icon: Archive,
      label: 'Archive Conversation',
      description: 'Hide from main conversation list',
      action: () => {
        onArchive();
        onClose();
      },
      color: 'text-purple-600 hover:bg-purple-50'
    },
    {
      icon: UserMinus,
      label: 'Block Contact',
      description: 'Block this person from messaging you',
      action: () => {
        if (confirm(`Are you sure you want to block ${conversationName}?`)) {
          onBlock();
          onClose();
        }
      },
      color: 'text-orange-600 hover:bg-orange-50',
      destructive: true
    },
    {
      icon: Flag,
      label: 'Report Conversation',
      description: 'Report inappropriate content',
      action: () => {
        if (confirm(`Report ${conversationName} for inappropriate content?`)) {
          onReport();
          onClose();
        }
      },
      color: 'text-red-600 hover:bg-red-50',
      destructive: true
    },
    {
      icon: Trash2,
      label: 'Delete Conversation',
      description: 'Permanently delete all messages',
      action: () => {
        if (confirm(`Are you sure you want to delete your conversation with ${conversationName}? This action cannot be undone.`)) {
          onDelete();
          onClose();
        }
      },
      color: 'text-red-700 hover:bg-red-50',
      destructive: true
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-coral-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Conversation Options</h2>
                  <p className="text-white/90 mt-1 truncate">
                    {conversationName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Options List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.action}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all ${option.color} ${
                      option.destructive ? 'border border-red-200' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <option.icon className="w-5 h-5 mt-0.5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium">{option.label}</h4>
                      <p className="text-sm opacity-70 mt-1">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4">
              <button
                onClick={onClose}
                className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Conversation Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Conversation Info</h2>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Conversation Name */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Conversation</h3>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-purple-100">
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-gray-800">{conversationName}</span>
                </div>
              </div>

              {/* Members */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Members</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {conversationName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{conversationName}</p>
                      <p className="text-sm text-gray-500">Contact</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      You
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">You</p>
                      <p className="text-sm text-gray-500">Teacher</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Created</p>
                      <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Notifications</p>
                      <p className="text-xs text-gray-500">{isMuted ? 'Muted' : 'Enabled'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4">
              <button
                onClick={() => setShowInfo(false)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};