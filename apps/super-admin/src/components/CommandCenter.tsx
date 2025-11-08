import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Command, Search, ArrowRight, Zap, Brain, CreditCard, 
  Shield, Headphones, Server, AlertTriangle, RotateCcw
} from 'lucide-react';

interface CommandCenterProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'ai' | 'sales' | 'support' | 'system';
  keywords: string[];
}

export default function CommandCenter({ open, onClose }: CommandCenterProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      description: 'Platform overview and metrics',
      icon: <Command className="w-4 h-4" />,
      action: () => navigate('/dashboard'),
      category: 'navigation',
      keywords: ['dashboard', 'home', 'overview', 'metrics']
    },
    {
      id: 'nav-ai',
      label: 'AI Provider Management',
      description: 'Manage AI providers and models',
      icon: <Brain className="w-4 h-4" />,
      action: () => navigate('/ai-providers'),
      category: 'navigation',
      keywords: ['ai', 'providers', 'models', 'openai', 'anthropic']
    },
    {
      id: 'nav-sales',
      label: 'Enterprise Sales',
      description: 'Sales pipeline and provisioning',
      icon: <CreditCard className="w-4 h-4" />,
      action: () => navigate('/sales'),
      category: 'navigation',
      keywords: ['sales', 'enterprise', 'licenses', 'revenue']
    },
    {
      id: 'nav-support',
      label: 'Technical Support',
      description: 'Support tickets and SLA monitoring',
      icon: <Headphones className="w-4 h-4" />,
      action: () => navigate('/support'),
      category: 'navigation',
      keywords: ['support', 'tickets', 'help', 'sla']
    },
    {
      id: 'nav-rbac',
      label: 'Access Control',
      description: 'Roles and permissions management',
      icon: <Shield className="w-4 h-4" />,
      action: () => navigate('/rbac'),
      category: 'navigation',
      keywords: ['rbac', 'roles', 'permissions', 'access', 'security']
    },

    // AI Provider Actions
    {
      id: 'ai-switch-provider',
      label: 'Switch AI Provider',
      description: 'Change primary AI provider',
      icon: <Brain className="w-4 h-4" />,
      action: () => navigate('/ai-providers/switch'),
      category: 'ai',
      keywords: ['switch', 'provider', 'failover', 'primary']
    },
    {
      id: 'ai-cost-analysis',
      label: 'AI Cost Analysis',
      description: 'View AI provider costs and optimization',
      icon: <Zap className="w-4 h-4" />,
      action: () => navigate('/ai-providers/costs'),
      category: 'ai',
      keywords: ['cost', 'analysis', 'optimization', 'billing']
    },

    // Sales Actions
    {
      id: 'sales-provision',
      label: 'Provision New License',
      description: 'Set up new enterprise client',
      icon: <CreditCard className="w-4 h-4" />,
      action: () => navigate('/sales/provision'),
      category: 'sales',
      keywords: ['provision', 'license', 'new', 'client', 'setup']
    },
    {
      id: 'sales-quote',
      label: 'Generate Quote',
      description: 'Create pricing quote for prospect',
      icon: <CreditCard className="w-4 h-4" />,
      action: () => navigate('/sales/quote'),
      category: 'sales',
      keywords: ['quote', 'pricing', 'proposal', 'estimate']
    },

    // Support Actions
    {
      id: 'support-tickets',
      label: 'View Support Tickets',
      description: 'Open support ticket dashboard',
      icon: <Headphones className="w-4 h-4" />,
      action: () => navigate('/support/tickets'),
      category: 'support',
      keywords: ['tickets', 'support', 'issues', 'help']
    },
    {
      id: 'support-escalate',
      label: 'Escalate Critical Issue',
      description: 'Create high-priority escalation',
      icon: <AlertTriangle className="w-4 h-4" />,
      action: () => navigate('/support/escalate'),
      category: 'support',
      keywords: ['escalate', 'critical', 'urgent', 'priority']
    },

    // System Actions
    {
      id: 'system-restart',
      label: 'Restart Service',
      description: 'Restart platform services',
      icon: <RotateCcw className="w-4 h-4" />,
      action: () => navigate('/resources/restart'),
      category: 'system',
      keywords: ['restart', 'service', 'reboot', 'system']
    },
    {
      id: 'system-backup',
      label: 'Initiate Backup',
      description: 'Start system backup process',
      icon: <Server className="w-4 h-4" />,
      action: () => navigate('/resources/backup'),
      category: 'system',
      keywords: ['backup', 'data', 'export', 'save']
    },
  ];

  const filteredCommands = commands.filter(cmd => 
    query === '' || 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
    cmd.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredCommands, selectedIndex, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Reset state when closing
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose}>
      <div className="fixed top-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-800">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
              autoFocus
            />
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">ESC</kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredCommands.map((cmd, index) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-coral-600/20 border border-coral-500/30'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      cmd.category === 'navigation' ? 'bg-blue-500/20 text-blue-400' :
                      cmd.category === 'ai' ? 'bg-purple-500/20 text-purple-400' :
                      cmd.category === 'sales' ? 'bg-green-500/20 text-green-400' :
                      cmd.category === 'support' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {cmd.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{cmd.label}</p>
                      {cmd.description && (
                        <p className="text-sm text-gray-400 truncate">{cmd.description}</p>
                      )}
                    </div>
                    {index === selectedIndex && (
                      <ArrowRight className="w-4 h-4 text-coral-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">↵</kbd>
                  Select
                </span>
              </div>
              <span>{filteredCommands.length} commands</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}