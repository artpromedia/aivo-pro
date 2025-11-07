import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Send,
  Paperclip,
  HelpCircle,
  BookOpen,
  Brain,
  MessageSquare,
  ChevronLeft,
  Trash2,
  CheckCircle,
  PenSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { WritingPad } from '../components/WritingPad';
import { useTheme } from '../providers/ThemeProvider';

type MessageType = 'text' | 'image' | 'math';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: MessageType;
  timestamp: Date;
  media?: string;
}

interface HomeworkApiResponse {
  response?: string;
}

interface HomeworkHelperProps {
  onClose?: () => void;
  childName?: string;
  childAge?: number;
}

const INTRO_MESSAGE: ChatMessage = {
  id: 'initial-assistant-message',
  role: 'assistant',
  content:
    "Hi! I'm your homework helper. Upload a photo of your homework or type your question, and I'll guide you through it step by step! 📚",
  type: 'text',
  timestamp: new Date(),
};

const gradientByTheme: Record<'K5' | 'MS' | 'HS', string> = {
  K5: 'from-purple-400 to-pink-400',
  MS: 'from-blue-500 to-indigo-500',
  HS: 'from-gray-900 to-slate-700',
};

export const HomeworkHelper: React.FC<HomeworkHelperProps> = ({
  onClose,
  childName = 'friend',
  childAge,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWritingPad, setShowWritingPad] = useState(false);

  const isModal = Boolean(onClose);
  const containerClasses = isModal
    ? 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6'
    : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50';

  const closeAction = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };

  const processHomework = useMutation<HomeworkApiResponse, Error, string>({
    mutationFn: async (imageData: string) => {
      const response = await fetch('/api/v1/homework/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      if (!response.ok) {
        throw new Error('Failed to process homework image');
      }
      const data: HomeworkApiResponse = await response.json();
      return data;
    },
    onMutate: () => setIsProcessing(true),
    onSettled: () => setIsProcessing(false),
    onSuccess: (data: HomeworkApiResponse) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response ?? 'Let me walk you through this step by step.',
          type: 'text',
          timestamp: new Date(),
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Hmm, I couldn't read that image. Could you try a clearer photo or describe the problem?",
          type: 'text',
          timestamp: new Date(),
        },
      ]);
    },
  });

    const sendMessage = useMutation<HomeworkApiResponse, Error, string>({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/v1/homework/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: messages.slice(-5).map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const data: HomeworkApiResponse = await response.json();
      return data;
    },
    onSuccess: (data: HomeworkApiResponse) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response ?? "Let's think this through together.",
          type: 'text',
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const imageData = readerEvent.target?.result as string;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          content: "Here's my homework:",
          type: 'image',
          timestamp: new Date(),
          media: imageData,
        },
      ]);
      processHomework.mutate(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const messageContent = inputMessage.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: messageContent,
        type: 'text',
        timestamp: new Date(),
      },
    ]);

    sendMessage.mutate(messageContent);
    setInputMessage('');
  };

  const handleWritingPadSave = (dataUrl: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: "Here's my work:",
        type: 'image',
        timestamp: new Date(),
        media: dataUrl,
      },
    ]);
    processHomework.mutate(dataUrl);
    setShowWritingPad(false);
  };

  const helperTips = useMemo(() => (
    <ul className="space-y-2 text-sm text-gray-700">
      <li>• Break problems into smaller steps</li>
      <li>• Show your work for better feedback</li>
      <li>• Ask “why” to understand concepts deeply</li>
      <li>• Practice a similar example after you try</li>
    </ul>
  ), []);

  const quickActions = useMemo(
    () => [
      { label: 'Math Problem', icon: HelpCircle, description: 'Step-by-step hints' },
      { label: 'Reading Help', icon: BookOpen, description: 'Key idea guidance' },
      { label: 'Essay Writing', icon: PenSquare, description: 'Plan your paragraphs' },
    ],
    []
  );

  const headerGradient = gradientByTheme[theme];

  return (
    <div className={containerClasses}>
      <div className={isModal ? 'max-w-6xl w-full' : ''}>
        <div className={`${isModal ? 'rounded-3xl overflow-hidden shadow-2xl' : ''}`}>
          <div className={`bg-white/90 ${isModal ? '' : 'sticky top-0 z-40'} border-b border-gray-200 backdrop-blur-sm`}>
            <div className="container mx-auto px-6 py-4 max-w-5xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={closeAction}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${headerGradient} rounded-xl flex items-center justify-center`}>
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Homework Helper</h1>
                      <p className="text-sm text-gray-500">
                        Let’s tackle this together, {childName}!{childAge ? ` Age ${childAge}.` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWritingPad(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-md"
                >
                  Open Writing Pad
                </motion.button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-6 max-w-5xl">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className={`bg-white rounded-3xl shadow-xl ${isModal ? 'h-[70vh]' : 'h-[calc(100vh-220px)]'} flex flex-col`}>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-4 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {message.media && (
                              <img
                                src={message.media}
                                alt="Homework"
                                className="rounded-xl mb-2 max-w-full"
                              />
                            )}
                            <p>{message.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 rounded-2xl p-4">
                          <div className="flex space-x-2">
                            {[0, 0.2, 0.4].map((delay) => (
                              <motion.div
                                key={delay}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay }}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-end gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <Camera className="w-5 h-5 text-gray-600" />
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <Paperclip className="w-5 h-5 text-gray-600" />
                      </button>

                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(event) => setInputMessage(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your question..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className={`p-3 rounded-xl transition-all ${
                          inputMessage.trim()
                            ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {quickActions.map(({ label, icon: Icon, description }) => (
                      <button
                        key={label}
                        className="w-full p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl text-left transition-all"
                        onClick={() => setInputMessage(label)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <div>
                            <span className="font-medium text-gray-800 block">{label}</span>
                            <span className="text-xs text-gray-500">{description}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-800 mb-3">💡 Study Tips</h3>
                  {helperTips}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Recent Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Fractions', 'Essay Structure', 'Science Lab', 'History Timeline'].map((topic) => (
                      <span key={topic} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    How I Help
                  </h3>
                  <p className="text-sm text-gray-600">
                    I’ll never hand over the answer. Instead, I’ll ask questions, offer hints, and help you build the solution step by step so you truly understand it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showWritingPad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Writing Pad</h2>
                <p className="text-gray-600">Sketch your work so I can see how you’re thinking.</p>
              </div>
              <WritingPad onSave={handleWritingPadSave} onClose={() => setShowWritingPad(false)} width={800} height={400} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};