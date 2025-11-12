import React, { useState } from 'react';
import { getDemoCredentials } from '../services/demoUsers';

interface DemoCredentialsProps {
  onSelectCredentials?: (email: string, password: string) => void;
}

export const DemoCredentials: React.FC<DemoCredentialsProps> = ({ onSelectCredentials }) => {
  const [expanded, setExpanded] = useState(false);
  const credentials = getDemoCredentials();

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-sm font-medium text-blue-900"
      >
        <span>🎭 Demo Credentials (Click to expand)</span>
        <span className="text-lg">{expanded ? '▼' : '▶'}</span>
      </button>
      
      {expanded && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-blue-700 mb-3">
            Quick access accounts for testing and demos. Click to auto-fill:
          </p>
          
          {credentials.map((cred) => (
            <button
              key={cred.email}
              onClick={() => onSelectCredentials?.(cred.email, cred.password)}
              className="w-full text-left p-3 bg-white rounded border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {cred.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {cred.role.replace('_', ' ')}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>{cred.email}</div>
                  <div className="font-mono">{cred.password}</div>
                </div>
              </div>
            </button>
          ))}
          
          <div className="pt-2 mt-2 border-t border-blue-200">
            <p className="text-xs text-gray-600">
              💡 <strong>New users:</strong> Sign up with any email to create your own account. 
              All data is stored locally in your browser.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
