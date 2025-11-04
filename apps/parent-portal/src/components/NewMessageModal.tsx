import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  User,
  GraduationCap,
  Users,
  Heart,
  MessageCircle,
  Send,
  UserPlus
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: 'teacher' | 'caregiver' | 'parent' | 'support';
  avatar: string;
  subject?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (contactId: string, message: string) => void;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Ms. Sarah Wilson',
    role: 'teacher',
    avatar: '👩‍🏫',
    subject: 'Mathematics',
    isOnline: true
  },
  {
    id: '2',
    name: 'Mr. David Chen',
    role: 'teacher',
    avatar: '👨‍🏫',
    subject: 'Science',
    isOnline: false,
    lastSeen: '2 hours ago'
  },
  {
    id: '3',
    name: 'Mrs. Emily Rodriguez',
    role: 'teacher',
    avatar: '👩‍🏫',
    subject: 'English Literature',
    isOnline: true
  },
  {
    id: '4',
    name: 'Grandma Rose',
    role: 'caregiver',
    avatar: '👵',
    isOnline: false,
    lastSeen: '1 day ago'
  },
  {
    id: '5',
    name: 'Uncle Mike',
    role: 'caregiver',
    avatar: '👨',
    isOnline: true
  },
  {
    id: '6',
    name: 'AIVO Support',
    role: 'support',
    avatar: '🤖',
    isOnline: true
  }
];

export const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isOpen,
  onClose,
  onSendMessage
}) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'teacher' | 'caregiver'>('caregiver');

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.subject && contact.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSend = () => {
    if (selectedContact && message.trim()) {
      onSendMessage(selectedContact.id, message.trim());
      setMessage('');
      setSelectedContact(null);
      onClose();
    }
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      // Send invitation
      alert(`Invitation sent to ${inviteEmail} as ${inviteRole}!`);
      setInviteEmail('');
      setShowInviteForm(false);
    }
  };

  const getRoleIcon = (role: Contact['role']) => {
    switch (role) {
      case 'teacher': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'caregiver': return <Heart className="w-4 h-4 text-pink-600" />;
      case 'parent': return <User className="w-4 h-4 text-green-600" />;
      case 'support': return <MessageCircle className="w-4 h-4 text-purple-600" />;
    }
  };

  const getRoleColor = (role: Contact['role']) => {
    switch (role) {
      case 'teacher': return 'text-blue-700 bg-blue-100';
      case 'caregiver': return 'text-pink-700 bg-pink-100';
      case 'parent': return 'text-green-700 bg-green-100';
      case 'support': return 'text-purple-700 bg-purple-100';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-coral-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">New Message</h2>
                  <p className="text-white/90 mt-1">
                    Send a message to teachers, family, or caregivers
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex h-[600px]">
              {/* Contacts List */}
              <div className="w-1/2 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className="w-full flex items-center gap-2 bg-gradient-to-r from-coral-100 to-purple-100 text-coral-700 px-4 py-3 rounded-xl font-medium hover:from-coral-200 hover:to-purple-200 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Invite New Contact
                  </button>
                </div>

                {showInviteForm && (
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Invite Contact</h4>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'teacher' | 'caregiver')}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="caregiver">Family/Caregiver</option>
                        <option value="teacher">Teacher</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={handleInvite}
                          className="flex-1 bg-coral-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-coral-600 transition-colors"
                        >
                          Send Invite
                        </button>
                        <button
                          onClick={() => setShowInviteForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-coral-50 border-coral-200' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-aivo-gradient rounded-xl flex items-center justify-center text-white text-xl">
                            {contact.avatar}
                          </div>
                          {contact.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                            {getRoleIcon(contact.role)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(contact.role)}`}>
                              {contact.role}
                            </span>
                            {contact.subject && (
                              <span className="text-xs text-gray-500">• {contact.subject}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {contact.isOnline ? 'Online' : `Last seen ${contact.lastSeen}`}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Compose */}
              <div className="w-1/2 flex flex-col">
                {selectedContact ? (
                  <>
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-aivo-gradient rounded-xl flex items-center justify-center text-white text-lg">
                          {selectedContact.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedContact.name}</h4>
                          <p className="text-sm text-gray-600">
                            {selectedContact.subject || selectedContact.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-4">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Send a message to ${selectedContact.name}...`}
                        className="w-full h-full resize-none border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                      />
                    </div>

                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {message.length}/500 characters
                        </div>
                        <button
                          onClick={handleSend}
                          disabled={!message.trim()}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div>
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="font-medium text-gray-900 mb-2">Select a Contact</h4>
                      <p className="text-gray-600">
                        Choose someone from your contacts list to send a message
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};