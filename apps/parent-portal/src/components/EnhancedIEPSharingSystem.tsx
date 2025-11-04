import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  Download, 
  Share2, 
  Lock, 
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Monitor,
  User,
  Bell,
  Key,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Copy,
  Settings,
  Activity,
  Globe,
  Fingerprint
} from 'lucide-react';

interface IEPShare {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: 'teacher' | 'school-admin' | 'specialist' | 'therapist' | 'other';
  status: 'active' | 'paused' | 'revoked' | 'expired';
  shareToken: string;
  createdDate: string;
  expirationDate?: string;
  permissions: {
    view: boolean;
    download: boolean;
    print: boolean;
    share: boolean;
  };
  accessLimit?: number;
  requireLogin: boolean;
  notifyOnAccess: boolean;
  message?: string;
  securitySettings: {
    ipRestrictions: string[];
    allowedDevices?: string[];
    watermarkEnabled: boolean;
    downloadWatermark: boolean;
    sessionTimeout: number; // in minutes
    twoFactorRequired: boolean;
  };
  accessHistory: AccessHistoryEntry[];
}

interface AccessHistoryEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  action: 'view' | 'download' | 'print' | 'share' | 'login';
  success: boolean;
  deviceFingerprint: string;
  sessionDuration?: number;
  blockedReason?: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'share_created' | 'share_updated' | 'share_revoked' | 'access_granted' | 'access_denied' | 'security_alert';
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

interface EnhancedIEPSharingSystemProps {
  childId: string;
}

const EnhancedIEPSharingSystem: React.FC<EnhancedIEPSharingSystemProps> = ({ childId }) => {
  const [shares, setShares] = useState<IEPShare[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedShare, setSelectedShare] = useState<IEPShare | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'shares' | 'security' | 'audit'>('shares');
  const [securityAlerts, setSecurityAlerts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharingData();
  }, [childId]);

  const loadSharingData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockShares: IEPShare[] = [
        {
          id: '1',
          recipientName: 'Ms. Jennifer Roberts',
          recipientEmail: 'j.roberts@school.edu',
          recipientRole: 'teacher',
          status: 'active',
          shareToken: 'abc123def456',
          createdDate: '2025-10-15',
          expirationDate: '2025-12-15',
          permissions: {
            view: true,
            download: true,
            print: false,
            share: false
          },
          accessLimit: 10,
          requireLogin: true,
          notifyOnAccess: true,
          message: 'Please review Alex\'s updated IEP for the upcoming meeting.',
          securitySettings: {
            ipRestrictions: ['192.168.1.0/24', '10.0.0.0/8'],
            watermarkEnabled: true,
            downloadWatermark: true,
            sessionTimeout: 60,
            twoFactorRequired: false
          },
          accessHistory: [
            {
              id: '1',
              timestamp: '2025-11-03T14:30:00Z',
              ipAddress: '192.168.1.100',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              location: 'Lincoln Elementary School',
              action: 'view',
              success: true,
              deviceFingerprint: 'fp_abc123',
              sessionDuration: 25
            },
            {
              id: '2',
              timestamp: '2025-11-02T09:15:00Z',
              ipAddress: '203.0.113.50',
              userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',  
              location: 'Unknown Location',
              action: 'view',
              success: false,
              deviceFingerprint: 'fp_def456',
              blockedReason: 'IP address not in allowed range'
            }
          ]
        },
        {
          id: '2',
          recipientName: 'Dr. Sarah Martinez',
          recipientEmail: 's.martinez@district.edu',
          recipientRole: 'specialist',
          status: 'active',
          shareToken: 'xyz789uvw012',
          createdDate: '2025-10-20',
          permissions: {
            view: true,
            download: false,
            print: true,
            share: false
          },
          requireLogin: true,
          notifyOnAccess: true,
          securitySettings: {
            ipRestrictions: [],
            watermarkEnabled: true,
            downloadWatermark: false,
            sessionTimeout: 30,
            twoFactorRequired: true
          },
          accessHistory: [
            {
              id: '3',
              timestamp: '2025-11-01T16:45:00Z',
              ipAddress: '10.0.1.50',
              userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
              location: 'District Office',
              action: 'view',
              success: true,
              deviceFingerprint: 'fp_ghi789',
              sessionDuration: 18
            }
          ]
        }
      ];

      const mockAuditLogs: AuditLogEntry[] = [
        {
          id: '1',
          timestamp: '2025-11-03T14:30:00Z',
          userId: 'parent_1',
          userName: 'Sarah Johnson',
          action: 'access_granted',
          details: 'Ms. Jennifer Roberts successfully accessed IEP document',
          ipAddress: '192.168.1.100',
          severity: 'info'
        },
        {
          id: '2',
          timestamp: '2025-11-02T09:15:00Z',
          userId: 'parent_1',
          userName: 'Sarah Johnson',
          action: 'access_denied',
          details: 'Access attempt blocked from unauthorized IP address 203.0.113.50',
          ipAddress: '203.0.113.50',
          severity: 'warning'
        },
        {
          id: '3',
          timestamp: '2025-10-15T10:00:00Z',
          userId: 'parent_1',
          userName: 'Sarah Johnson',
          action: 'share_created',
          details: 'New share link created for Ms. Jennifer Roberts',
          ipAddress: '192.168.1.50',
          severity: 'info'
        }
      ];

      setShares(mockShares);
      setAuditLogs(mockAuditLogs);
      setSecurityAlerts(mockAuditLogs.filter(log => log.severity === 'warning' || log.severity === 'error').length);
    } catch (error) {
      console.error('Error loading sharing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'revoked': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'expired': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSecurityLevel = (share: IEPShare) => {
    let score = 0;
    if (share.requireLogin) score += 20;
    if (share.securitySettings.twoFactorRequired) score += 25;
    if (share.securitySettings.ipRestrictions.length > 0) score += 20;
    if (share.securitySettings.watermarkEnabled) score += 15;
    if (share.accessLimit) score += 10;
    if (share.expirationDate) score += 10;

    if (score >= 80) return { level: 'High', color: 'text-green-600 bg-green-50' };
    if (score >= 50) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-50' };
    return { level: 'Low', color: 'text-red-600 bg-red-50' };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Secure IEP Sharing</h2>
          <p className="text-gray-600">Advanced security controls and audit logging</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSecurityModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security Settings
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg text-sm font-medium hover:bg-coral-600 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            New Secure Share
          </button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Shares</p>
              <p className="text-xl font-semibold text-gray-900">
                {shares.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Security</p>
              <p className="text-xl font-semibold text-gray-900">
                {shares.filter(s => getSecurityLevel(s).level === 'High').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Access</p>
              <p className="text-xl font-semibold text-gray-900">
                {shares.reduce((sum, share) => sum + share.accessHistory.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Security Alerts</p>
              <p className="text-xl font-semibold text-gray-900">{securityAlerts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'shares', label: 'Secure Shares', icon: Share2 },
            { id: 'security', label: 'Security Overview', icon: Shield },
            { id: 'audit', label: 'Audit Logs', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-coral-500 text-coral-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.id === 'audit' && securityAlerts > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {securityAlerts}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'shares' && (
        <div className="space-y-4">
          {shares.map(share => {
            const security = getSecurityLevel(share);
            const recentAccess = share.accessHistory.filter(h => h.success).length;
            const blockedAttempts = share.accessHistory.filter(h => !h.success).length;

            return (
              <div key={share.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{share.recipientName}</h3>
                      <p className="text-sm text-gray-600">{share.recipientEmail}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                          {share.recipientRole.replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(share.status)}
                          <span className="text-xs text-gray-600 capitalize">{share.status}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${security.color}`}>
                          {security.level} Security
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Security Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      {share.securitySettings.watermarkEnabled ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="ml-1 text-sm text-gray-600">Watermark</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      {share.securitySettings.ipRestrictions.length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="ml-1 text-sm text-gray-600">IP Restriction</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      {share.securitySettings.twoFactorRequired ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="ml-1 text-sm text-gray-600">2FA</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      {share.accessLimit ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="ml-1 text-sm text-gray-600">Access Limit</span>
                    </div>
                  </div>
                </div>

                {/* Access Statistics */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">{recentAccess}</p>
                    <p className="text-xs text-gray-600">Successful Access</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-red-600">{blockedAttempts}</p>
                    <p className="text-xs text-gray-600">Blocked Attempts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">
                      {Math.round(share.accessHistory.filter(h => h.sessionDuration).reduce((avg, h) => avg + (h.sessionDuration || 0), 0) / share.accessHistory.filter(h => h.sessionDuration).length) || 0}min
                    </p>
                    <p className="text-xs text-gray-600">Avg. Session</p>
                  </div>
                </div>

                {/* Recent Access */}
                {share.accessHistory.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Access Activity</h4>
                    <div className="space-y-2">
                      {share.accessHistory.slice(0, 2).map(access => (
                        <div key={access.id} className={`p-3 rounded-lg border ${
                          access.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                access.success ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {access.action.charAt(0).toUpperCase() + access.action.slice(1)} - {access.success ? 'Success' : 'Blocked'}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <MapPin className="w-3 h-3" />
                                  <span>{access.location}</span>
                                  <span>•</span>
                                  <Globe className="w-3 h-3" />
                                  <span>{access.ipAddress}</span>
                                  <span>•</span>
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(access.timestamp).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            {!access.success && access.blockedReason && (
                              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                {access.blockedReason}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/shared-iep/${share.shareToken}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <XCircle className="w-4 h-4" />
                    Revoke
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Share Security Levels</h4>
                <div className="space-y-2">
                  {['High', 'Medium', 'Low'].map(level => {
                    const count = shares.filter(s => getSecurityLevel(s).level === level).length;
                    const color = level === 'High' ? 'bg-green-500' : level === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';
                    return (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm text-gray-700">{level} Security</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Security Features Usage</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Watermarking', count: shares.filter(s => s.securitySettings.watermarkEnabled).length },
                    { label: 'IP Restrictions', count: shares.filter(s => s.securitySettings.ipRestrictions.length > 0).length },
                    { label: '2FA Required', count: shares.filter(s => s.securitySettings.twoFactorRequired).length },
                    { label: 'Access Limits', count: shares.filter(s => s.accessLimit).length }
                  ].map(feature => (
                    <div key={feature.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{feature.label}</span>
                      <span className="text-sm font-medium text-gray-900">{feature.count}/{shares.length}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Good Security Posture</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Most shares have adequate security controls
                    </p>
                  </div>
                  {shares.filter(s => getSecurityLevel(s).level === 'Low').length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Low Security Shares</span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        {shares.filter(s => getSecurityLevel(s).level === 'Low').length} shares need security improvements
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Enable Watermarking</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Add watermarks to shared documents to prevent unauthorized distribution and track document usage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Key className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Implement IP Restrictions</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Restrict access to specific IP addresses or networks to prevent unauthorized access from unknown locations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <Fingerprint className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900">Require Two-Factor Authentication</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Add an extra layer of security by requiring 2FA for sensitive document access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Export
                </button>
                <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500">
                  <option>All Severities</option>
                  <option>Critical</option>
                  <option>Error</option>
                  <option>Warning</option>
                  <option>Info</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className={`p-4 border rounded-lg ${getSeverityColor(log.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">
                          {log.action.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(log.severity)}`}>
                          {log.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {log.ipAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedIEPSharingSystem;