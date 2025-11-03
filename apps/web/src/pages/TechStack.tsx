import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Package, Database, Layout, Shield, Server, Zap, Globe, GitBranch } from 'lucide-react';

export const TechStack: React.FC = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate('/features');
  };

  // Based on actual Copilot instructions and repo structure
  const architecture = {
    core: {
      title: 'Core Technologies',
      items: [
        { label: 'Node.js', version: 'v20.19.4', description: 'Runtime environment', icon: Server },
        { label: 'pnpm', version: 'v10+', description: 'Package management', icon: Package },
        { label: 'Vite', version: 'v7.0.0', description: 'Build tool', icon: Zap },
        { label: 'React', version: '19.0.0', description: 'UI framework', icon: Layout },
        { label: 'TypeScript', version: 'v5.6+', description: 'Type safety', icon: Code },
        { label: 'Tailwind CSS', version: 'v4.0.0-beta', description: 'Styling system', icon: Globe },
      ],
    },
    monorepo: {
      title: 'Monorepo Structure (Turborepo)',
      apps: [
        { name: 'apps/web', description: 'Marketing website', port: '5173', color: 'blue' },
        { name: 'apps/parent-portal', description: 'Parent dashboard', port: '5174', color: 'green' },
        { name: 'apps/teacher-portal', description: 'Teacher dashboard', port: '5175', color: 'purple' },
        { name: 'apps/learner-app', description: 'Student learning interface', port: '5176', color: 'pink' },
        { name: 'apps/baseline-assessment', description: 'Initial assessment', port: '5179', color: 'orange' },
        { name: 'apps/mobile', description: 'React Native app', port: 'N/A', color: 'indigo' },
      ],
      packages: [
        { name: 'packages/ui', description: 'Shared component library with design system' },
        { name: 'packages/config', description: 'Shared configurations' },
        { name: 'packages/types', description: 'Shared TypeScript definitions' },
        { name: 'packages/utils', description: 'Shared utilities' },
        { name: 'packages/auth', description: 'Authentication logic' },
      ],
    },
    repositories: [
      {
        name: 'aivo-pro (Current)',
        composition: 'TypeScript 90%+ | React 19 | Monorepo',
        purpose: 'Main platform with all applications and shared packages',
        status: 'Active Development'
      },
      {
        name: 'aivo-agentic-ai-platform',
        composition: 'Python 52.5% | TypeScript 34.4% | PostgreSQL 9.5%',
        purpose: 'Core AI engine and platform infrastructure',
        status: 'Production'
      },
      {
        name: 'aivo-agentic-ai-learning-app',
        composition: 'TypeScript 62.9% | Python 33.6% | PostgreSQL 1.8%',
        purpose: 'Adaptive learning application with virtual brain agents',
        status: 'Production'
      },
      {
        name: 'aivo-v2',
        composition: 'TypeScript 84.9% | JavaScript 12.9% | PostgreSQL 1.1%',
        purpose: 'Next generation platform with enhanced TypeScript architecture',
        status: 'Legacy'
      },
    ],
  };

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      purple: 'bg-purple-100 text-purple-700',
      pink: 'bg-pink-100 text-pink-700',
      orange: 'bg-orange-100 text-orange-700',
      indigo: 'bg-indigo-100 text-indigo-700',
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24">
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
              Technical Architecture
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Built with Modern Technologies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AIVO Learning leverages a modern Turborepo monorepo architecture, 
              combining the power of Python AI models with TypeScript's type safety 
              for a robust, scalable platform.
            </p>
          </motion.div>

          {/* Core Technologies */}
          <div className="mb-16">
            <motion.h2 
              className="text-3xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {architecture.core.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architecture.core.items.map((tech, index) => (
                <motion.div
                  key={tech.label}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <tech.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{tech.label}</h3>
                      <span className="text-purple-600 font-mono text-sm">{tech.version}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Monorepo Structure */}
          <div className="mb-16 bg-linear-to-r from-purple-50 to-blue-50 rounded-3xl p-12">
            <motion.h2 
              className="text-3xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {architecture.monorepo.title}
            </motion.h2>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-purple-600" />
                  Applications
                </h3>
                <div className="space-y-4">
                  {architecture.monorepo.apps.map((app, index) => (
                    <motion.div 
                      key={app.name} 
                      className="bg-white rounded-lg p-4 shadow-sm"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-purple-600 font-mono text-sm">{app.name}</code>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(app.color)}`}>
                          Port {app.port}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{app.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Shared Packages
                </h3>
                <div className="space-y-4">
                  {architecture.monorepo.packages.map((pkg, index) => (
                    <motion.div 
                      key={pkg.name} 
                      className="bg-white rounded-lg p-4 shadow-sm"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <code className="text-blue-600 font-mono text-sm block mb-2">{pkg.name}</code>
                      <p className="text-gray-600 text-sm">{pkg.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Repository Overview */}
          <div className="mb-16">
            <motion.h2 
              className="text-3xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Repository Architecture
            </motion.h2>
            <div className="space-y-6">
              {architecture.repositories.map((repo, index) => (
                <motion.div
                  key={repo.name}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <GitBranch className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-semibold">{repo.name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      repo.status === 'Active Development' ? 'bg-green-100 text-green-700' :
                      repo.status === 'Production' ? 'bg-blue-100 text-blue-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {repo.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{repo.purpose}</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-mono text-gray-700">{repo.composition}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Development Commands */}
          <div className="bg-gray-900 rounded-3xl p-12 text-white">
            <motion.h2 
              className="text-3xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Development Commands
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-300">Core Commands</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <code className="text-green-400 text-sm">pnpm dev</code>
                    <p className="text-gray-400 text-xs mt-1">Start all apps in development mode</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <code className="text-green-400 text-sm">pnpm build</code>
                    <p className="text-gray-400 text-xs mt-1">Build all apps and packages</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <code className="text-green-400 text-sm">pnpm test</code>
                    <p className="text-gray-400 text-xs mt-1">Run tests across workspace</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-300">Quality Commands</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <code className="text-green-400 text-sm">pnpm lint</code>
                    <p className="text-gray-400 text-xs mt-1">Lint all code</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <code className="text-green-400 text-sm">pnpm type-check</code>
                    <p className="text-gray-400 text-xs mt-1">TypeScript type checking</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <code className="text-green-400 text-sm">pnpm format</code>
                    <p className="text-gray-400 text-xs mt-1">Format code with Prettier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience AIVO?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover how our modern architecture powers personalized learning for neurodiverse students.
            </p>
            <button
              onClick={handleLearnMore}
              className="bg-linear-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Explore Our Platform
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};