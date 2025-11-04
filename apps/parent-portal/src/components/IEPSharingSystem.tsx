import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Shield,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Mail,
  Lock,
  Unlock,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Bell
} from 'lucide-react';
import { Button } from '@aivo/ui';
import { IEPDocument, IEPShare } from '../types/iep.types';

interface IEPSharingSystemProps {
  iepDocument: IEPDocument;
  existingShares: IEPShare[];
  onCreateShare: (shareData: Omit<IEPShare, 'id' | 'createdDate' | 'accessHistory'>) => void;
  onUpdateShare: (shareId: string, updates: Partial<IEPShare>) => void;
  onRevokeShare: (shareId: string) => void;
  onClose: () => void;
}

interface ShareModalProps {
  onSubmit: (shareData: Omit<IEPShare, 'id' | 'createdDate' | 'accessHistory'>) => void;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onSubmit, onClose }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState<'teacher' | 'school-admin' | 'specialist' | 'other'>('teacher');
  const [permissions, setPermissions] = useState({
    view: true,
    download: false,
    print: false,
    share: false
  });
  const [expirationDate, setExpirationDate] = useState('');
  const [accessLimitEnabled, setAccessLimitEnabled] = useState(false);
  const [accessLimit, setAccessLimit] = useState(5);
  const [requireLogin, setRequireLogin] = useState(true);
  const [notifyOnAccess, setNotifyOnAccess] = useState(true);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientEmail || !recipientName) {
      alert('Please provide recipient email and name');
      return;
    }

    onSubmit({
      recipientEmail,
      recipientName,
      recipientRole,
      permissions,
      expirationDate: expirationDate || undefined,
      accessLimit: accessLimitEnabled ? accessLimit : undefined,
      requireLogin,
      notifyOnAccess,
      message: message.trim() || undefined,
      status: 'active'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Share IEP Document</h2>
          <p className="text-white/90">Set up secure access for teachers or administrators</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Recipient Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="teacher@school.edu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ms. Johnson"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="teacher">Teacher</option>
                <option value="school-admin">School Administrator</option>
                <option value="specialist">Specialist</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Permissions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'view', label: 'View Document', icon: Eye, required: true },
                { key: 'download', label: 'Download PDF', icon: Download },
                { key: 'print', label: 'Print Document', icon: FileText },
                { key: 'share', label: 'Share with Others', icon: Share2 }
              ].map(({ key, label, icon: Icon, required }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions[key as keyof typeof permissions]}
                    onChange={(e) => setPermissions(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    disabled={required}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{label}</span>
                  {required && <span className="text-xs text-gray-400">(Required)</span>}
                </label>
              ))}
            </div>
          </div>

          {/* Access Control */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Access Control</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={accessLimitEnabled}
                onChange={(e) => setAccessLimitEnabled(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Limit number of access attempts</label>
            </div>

            {accessLimitEnabled && (
              <div className="ml-8">
                <input
                  type="number"
                  value={accessLimit}
                  onChange={(e) => setAccessLimit(parseInt(e.target.value) || 1)}
                  min="1"
                  max="100"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="ml-2 text-sm text-gray-600">maximum accesses</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={requireLogin}
                onChange={(e) => setRequireLogin(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Require login to access</label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifyOnAccess}
                onChange={(e) => setNotifyOnAccess(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Notify me when accessed</label>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Recipient (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a personal message..."
            />
          </div>
        </form>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSubmit}>
            Create Share Link
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const ShareCard: React.FC<{
  share: IEPShare;
  onUpdate: (updates: Partial<IEPShare>) => void;
  onRevoke: () => void;
}> = ({ share, onUpdate, onRevoke }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isExpired = share.expirationDate && new Date(share.expirationDate) < new Date();
  const isLimitReached = share.accessLimit && share.accessHistory.length >= share.accessLimit;
  const isActive = share.status === 'active' && !isExpired && !isLimitReached;

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/shared-iep/${share.shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const getStatusIcon = () => {
    if (share.status === 'revoked') return <XCircle className="w-5 h-5 text-red-500" />;
    if (isExpired) return <Clock className="w-5 h-5 text-gray-500" />;
    if (isLimitReached) return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (share.status === 'revoked') return 'Revoked';
    if (isExpired) return 'Expired';
    if (isLimitReached) return 'Limit Reached';
    return 'Active';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{share.recipientName}</h4>
            <p className="text-sm text-gray-600">{share.recipientEmail}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {share.recipientRole.replace('-', ' ').toUpperCase()}
              </span>
              <div className="flex items-center gap-1">
                {getStatusIcon()}
                <span className={`text-xs font-medium ${
                  isActive ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {getStatusText()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyShareLink}
            disabled={!isActive}
            className="flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
          </Button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{share.accessHistory.length}</p>
          <p className="text-xs text-gray-600">Accesses</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            {share.accessLimit || '∞'}
          </p>
          <p className="text-xs text-gray-600">Limit</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">
            {share.expirationDate 
              ? Math.max(0, Math.ceil((new Date(share.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
              : '∞'
            }
          </p>
          <p className="text-xs text-gray-600">Days Left</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyShareLink}
          disabled={!isActive}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Share2 className="w-3 h-3" />
          Share Link
        </Button>
        
        {isActive ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate({ status: 'paused' })}
            className="text-amber-600 border-amber-200 hover:bg-amber-50"
          >
            <Lock className="w-3 h-3" />
          </Button>
        ) : share.status === 'paused' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate({ status: 'active' })}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <Unlock className="w-3 h-3" />
          </Button>
        ) : null}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRevoke}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <XCircle className="w-3 h-3" />
        </Button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-100 space-y-3"
          >
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Permissions</h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(share.permissions).filter(([_, enabled]) => enabled).map(([permission]) => (
                  <span key={permission} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            {share.accessHistory.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Recent Access</h5>
                <div className="space-y-1">
                  {share.accessHistory.slice(0, 3).map((access, index) => (
                    <div key={index} className="flex items-center justify-between text-xs text-gray-600">
                      <span>{new Date(access.timestamp).toLocaleDateString()}</span>
                      <span>{access.ipAddress}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {share.message && (
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-1">Message</h5>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">{share.message}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const IEPSharingSystem: React.FC<IEPSharingSystemProps> = ({
  iepDocument,
  existingShares,
  onCreateShare,
  onUpdateShare,
  onRevokeShare,
  onClose
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'revoked'>('all');

  const filteredShares = existingShares.filter(share => {
    const matchesSearch = share.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         share.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const isExpired = share.expirationDate && new Date(share.expirationDate) < new Date();
    const isLimitReached = share.accessLimit && share.accessHistory.length >= share.accessLimit;
    
    if (filterStatus === 'active') return matchesSearch && share.status === 'active' && !isExpired && !isLimitReached;
    if (filterStatus === 'expired') return matchesSearch && (isExpired || isLimitReached);
    if (filterStatus === 'revoked') return matchesSearch && share.status === 'revoked';
    
    return matchesSearch;
  });

  const activeShares = existingShares.filter(share => {
    const isExpired = share.expirationDate && new Date(share.expirationDate) < new Date();
    const isLimitReached = share.accessLimit && share.accessHistory.length >= share.accessLimit;
    return share.status === 'active' && !isExpired && !isLimitReached;
  }).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">IEP Document Sharing</h2>
              <p className="text-white/90">Securely share IEP documents with teachers and staff</p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{existingShares.length}</p>
              <p className="text-sm text-blue-800">Total Shares</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{activeShares}</p>
              <p className="text-sm text-green-800">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {existingShares.reduce((sum, share) => sum + share.accessHistory.length, 0)}
              </p>
              <p className="text-sm text-gray-800">Total Access</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {existingShares.filter(s => s.expirationDate && new Date(s.expirationDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-amber-800">Expiring Soon</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="gradient"
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Create New Share
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Shares</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>

        {/* Shares List */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {filteredShares.length === 0 ? (
            <div className="text-center py-12">
              <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shares found</h3>
              <p className="text-gray-600 mb-4">
                {existingShares.length === 0 
                  ? "You haven't shared this IEP document yet."
                  : "No shares match your current filter."
                }
              </p>
              {existingShares.length === 0 && (
                <Button
                  variant="gradient"
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Create First Share
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredShares.map(share => (
                <ShareCard
                  key={share.id}
                  share={share}
                  onUpdate={(updates) => onUpdateShare(share.id, updates)}
                  onRevoke={() => onRevokeShare(share.id)}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            onSubmit={onCreateShare}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};