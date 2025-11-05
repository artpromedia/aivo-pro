import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  MoreHorizontal,
  Paperclip,
  Image,
  Smile,

  Star,
  Archive,
  Trash2,
  Users,
  User,
  Clock,
  CheckCheck,
  Check,
  Circle,
  Bell,
  BellOff,
  Pin,
  PinOff,
  FileText,
  Download,
  Eye,
  ArrowLeft,
  UserPlus,
  Shield,
  Zap,
  Globe,
  Settings,
  Hash
} from 'lucide-react';
import { Button } from '@aivo/ui';
import { NewMessageModal } from '../components/NewMessageModal';
import { ConversationOptionsModal } from '../components/ConversationOptionsModal';

interface Message {
  id: string;
  sender: 'parent' | 'teacher' | 'system' | 'caregiver';
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'file';
    name: string;
    url: string;
    size?: string;
  }[];
  replyTo?: string;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: 'teacher' | 'admin' | 'support' | 'caregiver' | 'parent';
  subject: string;
  childName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  status: 'active' | 'archived';
  avatar?: string;
  isOnline: boolean;
  isTyping?: boolean;
  messages: Message[];
  type: 'direct' | 'group' | 'emergency';
  groupMembers?: string[];
  encryptionLevel: 'standard' | 'enhanced';
}

export const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      participantName: 'Ms. Rodriguez',
      participantRole: 'teacher',
      subject: 'Emma\'s Math Progress',
      childName: 'Emma',
      lastMessage: 'Emma has shown remarkable improvement in algebra this week. Her problem-solving approach has become more systematic.',
      lastMessageTime: '2024-11-03T14:30:00Z',
      unreadCount: 2,
      isPinned: true,
      isMuted: false,
      status: 'active',
      isOnline: true,
      isTyping: false,
      type: 'direct',
      encryptionLevel: 'enhanced',
      messages: [
        {
          id: '1',
          sender: 'teacher',
          senderName: 'Ms. Rodriguez',
          content: 'Hello! I wanted to update you on Emma\'s progress in mathematics.',
          timestamp: '2024-11-03T09:00:00Z',
          type: 'text',
          status: 'read'
        },
        {
          id: '2',
          sender: 'parent',
          senderName: 'You',
          content: 'Thank you for reaching out. How has she been doing with the new concepts?',
          timestamp: '2024-11-03T09:15:00Z',
          type: 'text',
          status: 'read'
        },
        {
          id: '3',
          sender: 'teacher',
          senderName: 'Ms. Rodriguez',
          content: 'Emma has shown remarkable improvement in algebra this week. Her problem-solving approach has become more systematic.',
          timestamp: '2024-11-03T14:30:00Z',
          type: 'text',
          status: 'delivered'
        }
      ]
    },
    {
      id: '2',
      participantName: 'Mr. Thompson',
      participantRole: 'teacher',
      subject: 'Liam\'s Science Project',
      childName: 'Liam',
      lastMessage: 'The volcano experiment results were excellent! Liam showed great understanding of chemical reactions.',
      lastMessageTime: '2024-11-02T16:45:00Z',
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      status: 'active',
      isOnline: false,
      isTyping: false,
      type: 'direct',
      encryptionLevel: 'enhanced',
      messages: [
        {
          id: '4',
          sender: 'teacher',
          senderName: 'Mr. Thompson',
          content: 'The volcano experiment results were excellent! Liam showed great understanding of chemical reactions.',
          timestamp: '2024-11-02T16:45:00Z',
          type: 'text',
          status: 'read'
        }
      ]
    },
    {
      id: '3',
      participantName: 'Family Chat',
      participantRole: 'caregiver',
      subject: 'Emma & Liam Updates',
      lastMessage: 'Michael: Thanks for sharing the progress report, Sarah!',
      lastMessageTime: '2024-11-03T12:20:00Z',
      unreadCount: 1,
      isPinned: false,
      isMuted: false,
      status: 'active',
      isOnline: true,
      isTyping: false,
      type: 'group',
      groupMembers: ['Sarah Chen (You)', 'Michael Chen', 'Grace Chen'],
      encryptionLevel: 'standard',
      messages: [
        {
          id: '6',
          sender: 'parent',
          senderName: 'You',
          content: 'Hi everyone! Just wanted to share Emma\'s latest progress report. She\'s doing amazing in math!',
          timestamp: '2024-11-03T11:45:00Z',
          type: 'text',
          status: 'read'
        },
        {
          id: '7',
          sender: 'caregiver',
          senderName: 'Michael Chen',
          content: 'Thanks for sharing the progress report, Sarah!',
          timestamp: '2024-11-03T12:20:00Z',
          type: 'text',
          status: 'delivered'
        }
      ]
    },
    {
      id: '4',
      participantName: 'AIVO Support',
      participantRole: 'support',
      subject: 'Account Setup Complete',
      lastMessage: 'Your family account has been successfully set up! Here are some tips to get started...',
      lastMessageTime: '2024-11-01T10:00:00Z',
      unreadCount: 0,
      isPinned: false,
      isMuted: true,
      status: 'active',
      isOnline: true,
      isTyping: false,
      type: 'direct',
      encryptionLevel: 'standard',
      messages: [
        {
          id: '5',
          sender: 'system',
          senderName: 'AIVO Support',
          content: 'Your family account has been successfully set up! Here are some tips to get started...',
          timestamp: '2024-11-01T10:00:00Z',
          type: 'text',
          status: 'read'
        }
      ]
    },
    {
      id: '5',
      participantName: 'Emergency Contacts',
      participantRole: 'admin',
      subject: 'School Emergency Line',
      lastMessage: 'This is an emergency communication channel. Use only for urgent matters.',
      lastMessageTime: '2024-10-28T08:00:00Z',
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      status: 'active',
      isOnline: true,
      isTyping: false,
      type: 'emergency',
      encryptionLevel: 'enhanced',
      messages: [
        {
          id: '8',
          sender: 'system',
          senderName: 'AIVO Emergency',
          content: 'This is an emergency communication channel. Use only for urgent matters.',
          timestamp: '2024-10-28T08:00:00Z',
          type: 'system',
          status: 'read'
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversations[0]?.id || null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'conversation'>('list');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState<string[]>(['1', '3', '4', '5']);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedConversationForOptions, setSelectedConversationForOptions] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'parent',
      senderName: 'You',
      content: messageText,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation
        ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: messageText, lastMessageTime: new Date().toISOString() }
        : conv
    ));

    setMessageText('');
    setTimeout(scrollToBottom, 100);
  };

  const togglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
    ));
  };

  const toggleMute = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, isMuted: !conv.isMuted } : conv
    ));
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const handleNewMessage = (contactId: string, message: string) => {
    // Create new conversation or add to existing
    alert(`Message sent to contact ${contactId}: ${message}`);
  };

  const handleConversationOptions = (conversationId: string) => {
    setSelectedConversationForOptions(conversationId);
    setShowOptionsModal(true);
  };

  const handleMuteConversation = () => {
    if (selectedConversationForOptions) {
      toggleMute(selectedConversationForOptions);
    }
  };

  const handleArchiveConversation = () => {
    alert('Conversation archived!');
  };

  const handleBlockContact = () => {
    alert('Contact blocked!');
  };

  const handleReportConversation = () => {
    alert('Conversation reported!');
  };

  const handleDeleteConversation = () => {
    alert('Conversation deleted!');
  };

  const filteredConversations = conversations
    .filter(conv => 
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.childName && conv.childName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-coral-500" />;
      default:
        return <Circle className="w-3 h-3 text-gray-300" />;
    }
  };

  if (viewMode === 'conversation' && currentConversation) {
    return (
      <div className="h-full flex flex-col">
        {/* Conversation Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('list')}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-aivo-gradient rounded-xl flex items-center justify-center text-white font-bold">
                  {currentConversation.type === 'group' ? (
                    <Users className="w-6 h-6" />
                  ) : (
                    currentConversation.participantName.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                {currentConversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                {currentConversation.encryptionLevel === 'enhanced' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{currentConversation.participantName}</h3>
                  {currentConversation.type === 'group' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {currentConversation.groupMembers?.length} members
                    </span>
                  )}
                  {currentConversation.type === 'emergency' && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Emergency
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {currentConversation.type === 'group' ? (
                    currentConversation.groupMembers?.join(', ')
                  ) : (
                    <>
                      {currentConversation.childName && `${currentConversation.childName}'s ${currentConversation.participantRole}`}
                      {currentConversation.isTyping ? ' • typing...' : 
                       currentConversation.isOnline ? ' • Online' : ' • Last seen 2h ago'}
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => {
                  // Toggle search functionality
                  const searchInput = document.querySelector<HTMLInputElement>('input[placeholder="Search conversations..."]');
                  searchInput?.focus();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Search in conversation"
              >
                <Search className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={() => currentConversation && handleConversationOptions(currentConversation.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Conversation options"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {currentConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md ${
                message.sender === 'parent' 
                  ? 'bg-aivo-gradient text-white rounded-l-2xl rounded-tr-2xl' 
                  : 'bg-gray-100 text-gray-900 rounded-r-2xl rounded-tl-2xl'
              } p-4 shadow-sm`}>
                <p className="text-sm mb-1">{message.content}</p>
                <div className={`flex items-center gap-1 text-xs ${
                  message.sender === 'parent' ? 'text-white/70' : 'text-gray-500'
                } justify-end`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.sender === 'parent' && getMessageStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4">
          {/* Typing Indicator */}
          {currentConversation.isTyping && (
            <div className="mb-2 text-sm text-gray-500 italic">
              {currentConversation.type === 'group' ? 'Someone is typing...' : `${currentConversation.participantName} is typing...`}
            </div>
          )}
          
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <textarea
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  // Simulate typing indicator
                  if (e.target.value.length > 0 && !isTyping) {
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 3000);
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder={
                  currentConversation.type === 'emergency' 
                    ? 'Emergency message...' 
                    : currentConversation.type === 'group'
                    ? 'Message family...'
                    : 'Type your message...'
                }
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-24 sm:pr-32 border rounded-2xl resize-none focus:ring-2 focus:border-transparent max-h-32 text-sm sm:text-base ${
                  currentConversation.type === 'emergency'
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-gray-200 focus:ring-coral-500'
                }`}
                rows={1}
              />
              
              <div className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 flex items-center gap-0.5 sm:gap-1">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-coral-500 transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-coral-500 transition-colors"
                >
                  <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

              </div>
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!messageText.trim()}
              className={`p-3 rounded-2xl font-bold text-sm shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                currentConversation.type === 'emergency'
                  ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white hover:from-red-600 hover:to-orange-700 border border-white/20'
                  : 'bg-gradient-to-r from-coral-500 to-purple-600 text-white hover:from-coral-600 hover:to-purple-700 border border-white/20'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Reactions for Emergency */}
          {currentConversation.type === 'emergency' && (
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => {
                  setMessageText('🚨 This is an emergency situation that requires immediate attention.');
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
              >
                🚨 Emergency
              </button>
              <button 
                onClick={() => {
                  setMessageText('⚠️ This matter is urgent and needs prompt attention.');
                }}
                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors"
              >
                ⚠️ Urgent
              </button>
              <button 
                onClick={() => {
                  setMessageText('✅ Everything is all good here. Thank you for checking!');
                }}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
              >
                ✅ All Good
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.png,.gif,.mp4,.mov"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Messages
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Secure communication with teachers, family members, and caregivers
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNewGroupModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-coral-200 text-coral-600 px-4 sm:px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-coral-50 hover:border-coral-300 w-full sm:w-auto"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">New Group</span>
            <span className="sm:hidden">Group</span>
          </button>
          <button 
            onClick={() => setShowNewMessageModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20 w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Message</span>
            <span className="sm:hidden">Message</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Conversations List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex gap-2 mb-4"
              >
                <Button size="sm" variant="outline">All</Button>
                <Button size="sm" variant="outline">Teachers</Button>
                <Button size="sm" variant="outline">Unread</Button>
                <Button size="sm" variant="outline">Pinned</Button>
              </motion.div>
            )}
          </div>

          <div className="divide-y divide-gray-100 max-h-80 sm:max-h-96 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                onClick={() => {
                  setSelectedConversation(conversation.id);
                  setViewMode('conversation');
                  markAsRead(conversation.id);
                }}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedConversation === conversation.id ? 'bg-coral-50' : ''
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-aivo-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {conversation.participantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {conversation.participantName}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {conversation.isPinned && <Pin className="w-3 h-3 text-coral-500" />}
                        {conversation.isMuted && <BellOff className="w-3 h-3 text-gray-400" />}
                      </div>
                      <span className="text-xs text-gray-500 ml-auto flex-shrink-0">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
                      {conversation.subject}
                      {conversation.childName && (
                        <span className="text-coral-600"> • {conversation.childName}</span>
                      )}
                    </p>
                    
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
                    {conversation.unreadCount > 0 && (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-coral-500 text-white rounded-full flex items-center justify-center text-xs font-bold min-w-[16px] sm:min-w-[20px]">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(conversation.id);
                        }}
                        className="p-1 text-gray-400 hover:text-coral-500 transition-colors"
                      >
                        {conversation.isPinned ? 
                          <PinOff className="w-3 h-3" /> : 
                          <Pin className="w-3 h-3" />
                        }
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute(conversation.id);
                        }}
                        className="p-1 text-gray-400 hover:text-coral-500 transition-colors"
                      >
                        {conversation.isMuted ? 
                          <Bell className="w-3 h-3" /> : 
                          <BellOff className="w-3 h-3" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message Preview/Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          {selectedConversation && currentConversation ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-aivo-gradient rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {currentConversation.participantName.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{currentConversation.participantName}</h3>
                <p className="text-gray-600">{currentConversation.subject}</p>
                {currentConversation.childName && (
                  <p className="text-sm text-coral-600 font-medium mt-1">
                    {currentConversation.childName}'s {currentConversation.participantRole}
                  </p>
                )}
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setViewMode('conversation')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open Chat
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Recent Messages</h4>
                <div className="space-y-2">
                  {currentConversation.messages.slice(-3).map((message) => (
                    <div key={message.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-700">{message.senderName}:</span>
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      </div>
                      <p className="text-gray-600 truncate">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
              <p className="text-gray-600">Choose a conversation from the list to view messages and details</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSendMessage={handleNewMessage}
      />

      <ConversationOptionsModal
        isOpen={showOptionsModal}
        onClose={() => {
          setShowOptionsModal(false);
          setSelectedConversationForOptions(null);
        }}
        conversationName={
          selectedConversationForOptions
            ? conversations.find(c => c.id === selectedConversationForOptions)?.participantName || ''
            : ''
        }
        isMuted={
          selectedConversationForOptions
            ? conversations.find(c => c.id === selectedConversationForOptions)?.isMuted || false
            : false
        }
        onMute={handleMuteConversation}
        onArchive={handleArchiveConversation}
        onBlock={handleBlockContact}
        onReport={handleReportConversation}
        onDelete={handleDeleteConversation}
      />
    </div>
  );
};