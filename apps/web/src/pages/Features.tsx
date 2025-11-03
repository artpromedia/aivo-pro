import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { FeatureGrid } from '../components/FeatureGrid';
import { 
  Brain, 
  Database, 
  Shield, 
  Zap, 
  Users, 
  Layers,
  Cloud,
  CheckCircle,
  ArrowRight,
  Code,
  Server,
  MessageSquare
} from 'lucide-react';

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const handleAPIDocumentationClick = () => {
    navigate('/products/api');
  };

  // Based on actual repository structure and technology stack
  const technicalFeatures = [
    {
      icon: Brain,
      category: 'Learning Engine',
      title: 'TypeScript-Powered AI',
      description: 'Built with TypeScript 5.6+ and React 19 for type-safe, adaptive learning algorithms that respond to student needs in real-time.',
      specs: [
        'Real-time learning path optimization',
        'Multi-modal content delivery',
        'Focus monitoring with attention tracking',
        'IEP goal progress automation',
      ],
      tech: 'TypeScript 5.6+ | React 19',
      gradient: 'from-purple-500 to-blue-600'
    },
    {
      icon: Database,
      category: 'API Architecture',
      title: 'Express.js Backend',
      description: 'Robust Express.js API with WebSocket support for real-time collaboration between parents, teachers, and students.',
      specs: [
        'RESTful API endpoints for all user types',
        'WebSocket server for live updates',
        'Multi-factor authentication (MFA)',
        'Real-time progress broadcasting',
      ],
      tech: 'Express.js | WebSocket | Node.js 20+',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: Layers,
      category: 'Monorepo Platform',
      title: 'Turborepo Architecture', 
      description: 'Modern monorepo with dedicated portals for each user type, shared component libraries, and unified development workflow.',
      specs: [
        'Parent Portal (Port 5174) - Progress tracking',
        'Teacher Portal (Port 5175) - Classroom analytics',
        'Learner App (Port 5176) - Student interface',
        'Assessment Tools (Port 5179) - Baseline testing',
      ],
      tech: 'Turborepo | pnpm workspaces',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Cloud,
      category: 'Build System',
      title: 'Vite 7.0 Performance',
      description: 'Lightning-fast development and builds with Vite 7.0, Tailwind CSS 4.0-beta, and modern tooling for optimal performance.',
      specs: [
        'Hot module replacement (HMR)',
        'TypeScript compilation with esbuild',
        'Tailwind CSS 4.0-beta design system',
        'Automated testing pipeline',
      ],
      tech: 'Vite 7.0 | Tailwind CSS 4.0-beta',
      gradient: 'from-pink-500 to-purple-600'
    },
  ];

  // Actual API endpoints from the repository
  const apiEndpoints = [
    { method: 'POST', endpoint: '/api/auth/login', description: 'Secure authentication with MFA' },
    { method: 'GET', endpoint: '/api/children/:id/progress', description: 'Real-time progress tracking' },
    { method: 'POST', endpoint: '/api/children', description: 'Child profile management' },
    { method: 'GET', endpoint: '/api/courses', description: 'Adaptive curriculum delivery' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-purple-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
              Built on Modern Technology
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Platform Architecture & Features
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              AIVO leverages cutting-edge technologies including TypeScript 5.6+, React 19, Express.js, 
              and Vite 7.0 to deliver personalized learning experiences for neurodiverse students.
            </p>
          </motion.div>

          {/* Technical Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 bg-linear-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shrink-0`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-purple-600 font-semibold">
                      {feature.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{feature.title}</h3>
                    <div className="text-sm text-gray-500 mt-2 font-mono">
                      {feature.tech}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.specs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 shrink-0"></div>
                      <span className="text-sm text-gray-700">{spec}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* API Endpoints Section */}
          <motion.div 
            className="bg-gray-900 rounded-3xl p-12 mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Live API Endpoints
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Production-ready API endpoints currently running on our Express.js server with WebSocket support
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {apiEndpoints.map((endpoint, index) => (
                <div
                  key={endpoint.endpoint}
                  className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      endpoint.method === 'POST' 
                        ? 'bg-green-900 text-green-300'
                        : 'bg-blue-900 text-blue-300'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-gray-300">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-gray-400 text-sm">{endpoint.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button 
                className="bg-linear-to-r from-purple-600 to-blue-600 text-white"
                onClick={handleAPIDocumentationClick}
              >
                View API Documentation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Existing Feature Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learning Platform Features
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for neurodiverse learners and their support teams
            </p>
          </motion.div>
          <FeatureGrid />
        </div>
      </section>
    </div>
  );
};
