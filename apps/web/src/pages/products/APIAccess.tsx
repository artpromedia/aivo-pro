import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { 
  Code, 
  Copy, 
  Check, 
  Lock, 
  Zap, 
  Database, 
  Server, 
  ArrowRight,
  ExternalLink,
  Globe,
  MessageSquare
} from 'lucide-react';

export const APIAccess: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Based on actual repository's Express.js API structure
  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/auth/login',
      description: 'Authenticate users with multi-factor authentication support',
      status: 'Live'
    },
    {
      method: 'POST',
      endpoint: '/api/auth/mfa/setup',
      description: 'Configure multi-factor authentication for enhanced security',
      status: 'Live'
    },
    {
      method: 'GET',
      endpoint: '/api/children',
      description: 'Retrieve child profiles with learning preferences and IEP data',
      status: 'Live'
    },
    {
      method: 'POST',
      endpoint: '/api/children',
      description: 'Create new child profile with personalized learning settings',
      status: 'Live'
    },
    {
      method: 'GET',
      endpoint: '/api/children/:childId/progress',
      description: 'Get real-time learning progress and analytics data',
      status: 'Live'
    },
    {
      method: 'GET',
      endpoint: '/api/courses',
      description: 'Access adaptive curriculum content with mentor assignments',
      status: 'Live'
    },
    {
      method: 'GET',
      endpoint: '/api/progress/:userId',
      description: 'Comprehensive learning statistics and performance metrics',
      status: 'Live'
    },
  ];

  // Real code examples based on the repository structure
  const codeExamples = {
    typescript: `// TypeScript SDK Example - Based on AIVO Repository Structure
import express from 'express';
import { WebSocket } from 'ws';

// Initialize AIVO API Client
const app = express();
const PORT = process.env.PORT || 3001;

// Authentication with MFA Support
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await authenticateUser(email, password);
    
    if (user.mfa?.enabled) {
      return res.json({
        requiresMFA: true,
        tempToken: generateTempToken(user.id)
      });
    }
    
    const token = generateJWT(user);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Child Profile Management
app.get('/api/children', async (req, res) => {
  const { userId } = req.user;
  
  const children = await database.children.getByParentId(userId);
  
  res.json({
    data: children.map(child => ({
      id: child.id,
      firstName: child.firstName,
      grade: child.grade,
      learningProfile: child.learningProfile,
      currentAssessment: child.currentAssessment,
      progressHistory: child.progressHistory
    }))
  });
});

// Real-time WebSocket Updates
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const userId = getUserIdFromToken(req);
  
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    
    switch (message.type) {
      case 'focus-update':
        broadcastFocusUpdate(userId, message.focusScore);
        break;
      case 'progress-update':
        broadcastProgressUpdate(userId, message.progress);
        break;
    }
  });
});`,

    javascript: `// JavaScript Client Example - Connect to AIVO API
const AIVO_API = 'http://localhost:3001';

class AIVOClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = AIVO_API;
  }

  // Authenticate and establish session
  async login(email, password) {
    const response = await fetch(\`\${this.baseURL}/api/auth/login\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.requiresMFA) {
      // Handle MFA flow
      return { requiresMFA: true, tempToken: data.tempToken };
    }
    
    this.token = data.token;
    return data.user;
  }

  // Get child profiles
  async getChildren() {
    const response = await fetch(\`\${this.baseURL}/api/children\`, {
      headers: { 
        'Authorization': \`Bearer \${this.token}\`
      }
    });
    
    return response.json();
  }

  // Track learning progress
  async getProgress(childId) {
    const response = await fetch(
      \`\${this.baseURL}/api/children/\${childId}/progress\`,
      {
        headers: { 
          'Authorization': \`Bearer \${this.token}\`
        }
      }
    );
    
    const progress = await response.json();
    
    return {
      totalTimeSpent: progress.data.totalTimeSpent,
      lessonsCompleted: progress.data.lessonsCompleted,
      averageScore: progress.data.averageScore,
      focusTime: progress.data.focusTime
    };
  }

  // Connect to real-time updates
  connectWebSocket(userId) {
    const ws = new WebSocket(\`ws://localhost:3001?userId=\${userId}\`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'focus-update':
          console.log('Focus score:', message.data.focusScore);
          break;
        case 'progress-update':
          console.log('Progress update:', message.data.progress);
          break;
      }
    };
    
    return ws;
  }
}

// Usage Example
const client = new AIVOClient(process.env.AIVO_API_KEY);

async function example() {
  // Login
  const user = await client.login('parent@example.com', 'password');
  
  // Get children
  const children = await client.getChildren();
  
  // Track progress
  const progress = await client.getProgress(children.data[0].id);
  
  // Connect for real-time updates
  const ws = client.connectWebSocket(user.id);
}`,
  };

  const techStack = [
    {
      icon: Code,
      title: 'TypeScript 5.6+',
      description: 'Type-safe API development with modern TypeScript features',
      color: 'blue'
    },
    {
      icon: Server,
      title: 'Express.js + WebSocket',
      description: 'RESTful API with real-time WebSocket communication',
      color: 'green'
    },
    {
      icon: Database,
      title: 'Node.js 20+',
      description: 'High-performance runtime with modern ES modules',
      color: 'purple'
    },
    {
      icon: Lock,
      title: 'Security First',
      description: 'MFA, JWT tokens, FERPA/COPPA compliance built-in',
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
                Developer API Access
              </span>
              <h1 className="text-5xl font-bold mb-6">
                Build on AIVO's Learning Platform
              </h1>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                Integrate with our production Express.js API running on Node.js 20+. 
                Access real-time learning data, WebSocket updates, and comprehensive 
                student analytics through our TypeScript-powered platform.
              </p>
              <div className="flex gap-4">
                <Button className="bg-white text-purple-600 hover:bg-gray-50">
                  Get API Key
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="ghost" className="text-white border-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Modern Technology Stack
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Built with production-grade technologies currently powering 
              the AIVO learning platform across multiple portals and applications.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.title}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 ${getColorClasses(tech.color)} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <tech.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.title}</h3>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Live API Endpoints */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-16">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Live API Endpoints</h2>
                  <p className="text-gray-600">Currently running on http://localhost:3001</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm">Live</span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <motion.div
                    key={endpoint.endpoint}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        endpoint.method === 'POST' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-gray-800 font-medium">
                        {endpoint.endpoint}
                      </code>
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-medium">
                        {endpoint.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm max-w-md">{endpoint.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Integration Examples
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {Object.entries(codeExamples).map(([language, code]) => (
                <motion.div 
                  key={language} 
                  className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300 font-semibold capitalize font-mono">
                        {language}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(code, language)}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="Copy code"
                    >
                      {copiedCode === language ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm text-gray-300 leading-relaxed">
                      <code>{code}</code>
                    </pre>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Integrate with AIVO?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join developers building the next generation of educational technology. 
              Access our live API endpoints, real-time WebSocket connections, and comprehensive documentation.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Code className="w-4 h-4 mr-2" />
                Get API Access
              </Button>
              <Button variant="ghost" className="text-white border-white hover:bg-white/10">
                <MessageSquare className="w-4 h-4 mr-2" />
                Developer Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};