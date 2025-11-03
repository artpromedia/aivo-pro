import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { 
  Shield, 
  Server, 
  Users, 
  BarChart, 
  Lock, 
  Cloud, 
  Code, 
  Database,
  Layers,
  Globe,
  ArrowRight,
  CheckCircle,
  Zap,
  Settings
} from 'lucide-react';

export const Enterprise: React.FC = () => {
  // Based on actual repository architecture
  const infrastructure = {
    monorepo: {
      title: 'Turborepo Monorepo Architecture',
      description: 'Modern monorepo with pnpm workspaces supporting multiple specialized portals',
      percentage: '100%',
      features: [
        'Web Marketing Site (Port 5173)',
        'Parent Portal Dashboard (Port 5174)', 
        'Teacher Portal Analytics (Port 5175)',
        'Student Learning Interface (Port 5176)',
        'Baseline Assessment Tools (Port 5179)',
        'Mobile React Native App',
        'Shared Component Libraries (@aivo/ui)',
        'Unified TypeScript Types (@aivo/types)',
      ],
      gradient: 'from-blue-500 to-purple-600'
    },
    backend: {
      title: 'Express.js API with WebSocket',
      description: 'Production-grade Node.js 20+ backend with real-time communication',
      percentage: '100%',
      features: [
        'RESTful API with Express.js framework',
        'WebSocket server for real-time updates',
        'Multi-factor authentication (MFA)',
        'JWT token-based session management',
        'CORS-enabled for all portal domains',
        'Real-time progress broadcasting',
        'Focus monitoring WebSocket events',
        'Comprehensive error handling middleware',
      ],
      gradient: 'from-green-500 to-teal-600'
    },
    frontend: {
      title: 'Modern Frontend Stack',
      description: 'TypeScript 5.6+ with React 19 and cutting-edge tooling',
      percentage: '100%',
      features: [
        'React 19 with latest features',
        'TypeScript 5.6+ for type safety',
        'Vite 7.0 for lightning-fast builds',
        'Tailwind CSS 4.0-beta design system',
        'Framer Motion animations',
        'Responsive design for all devices',
        'Accessibility-first development',
        'Component-based architecture',
      ],
      gradient: 'from-pink-500 to-red-500'
    },
    devops: {
      title: 'Developer Experience',
      description: 'Modern tooling and development workflow optimization',
      percentage: '100%',
      features: [
        'pnpm package manager (v10+)',
        'ESLint + Prettier code formatting',
        'TypeScript strict mode compilation',
        'Hot module replacement (HMR)',
        'Automated testing pipeline',
        'Turbo for monorepo task orchestration',
        'Git-based version control',
        'Environment configuration management',
      ],
      gradient: 'from-yellow-500 to-orange-500'
    },
  };

  const enterpriseFeatures = [
    {
      icon: Users,
      title: 'Multi-Portal Architecture',
      description: 'Dedicated portals for each user type with role-based access control and shared authentication.',
      benefits: [
        'Parent Portal: Child progress tracking and communication',
        'Teacher Portal: Classroom analytics and student management', 
        'Student App: Gamified learning with focus monitoring',
        'Assessment Portal: Comprehensive evaluation tools',
      ]
    },
    {
      icon: Database,
      title: 'Real-Time Data Synchronization',
      description: 'WebSocket-powered live updates across all portals with instant progress sharing.',
      benefits: [
        'Live focus monitoring during learning sessions',
        'Real-time progress updates for parents/teachers',
        'Instant communication between stakeholders',
        'Collaborative session management',
      ]
    },
    {
      icon: Shield,
      title: 'Enterprise Security & Compliance',
      description: 'Built-in FERPA/COPPA compliance with multi-factor authentication and data protection.',
      benefits: [
        'Multi-factor authentication (MFA) support',
        'JWT-based secure session management',
        'Role-based access control (RBAC)',
        'Comprehensive audit logging',
      ]
    },
    {
      icon: Cloud,
      title: 'Scalable Infrastructure',
      description: 'Modern architecture designed to scale from hundreds to millions of concurrent users.',
      benefits: [
        'Microservice-ready monorepo structure',
        'Horizontal scaling capabilities',
        'Load balancer-ready architecture',
        'CDN-optimized asset delivery',
      ]
    }
  ];

  const deploymentOptions = [
    {
      title: 'Cloud Deployment',
      description: 'Deploy all portals to your preferred cloud provider',
      features: ['AWS/GCP/Azure compatible', 'Auto-scaling groups', 'Load balancing', 'CDN integration'],
      icon: Cloud
    },
    {
      title: 'On-Premises',
      description: 'Self-hosted deployment for maximum data control',
      features: ['Docker containerization', 'Kubernetes orchestration', 'Private network deployment', 'Custom security policies'],
      icon: Server
    },
    {
      title: 'Hybrid Setup',
      description: 'Combine cloud and on-premises for optimal performance',
      features: ['Edge computing', 'Data residency compliance', 'Failover redundancy', 'Custom integrations'],
      icon: Settings
    }
  ];

  const metrics = [
    { label: 'Concurrent Users', value: '10,000+', description: 'Tested load capacity' },
    { label: 'Response Time', value: '<100ms', description: 'API endpoint performance' },
    { label: 'Uptime SLA', value: '99.9%', description: 'Guaranteed availability' },
    { label: 'Data Centers', value: 'Multi-region', description: 'Global deployment ready' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-6">
              Enterprise Solutions
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AIVO for School Districts & Institutions
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Enterprise-grade learning platform built with modern technologies: 
              TypeScript 5.6+, React 19, Express.js, and Turborepo architecture. 
              Scale from hundreds to millions of learners with our robust infrastructure.
            </p>
          </motion.div>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{metric.label}</div>
                <div className="text-sm text-gray-600">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Production Architecture Stack
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Built with modern technologies and production-tested architecture 
              currently powering the AIVO learning platform across multiple environments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(infrastructure).map(([key, section], index) => (
              <motion.div 
                key={key} 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  <div className={`px-3 py-1 bg-gradient-to-r ${section.gradient} text-white rounded-full text-sm font-semibold`}>
                    {section.percentage}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{section.description}</p>
                <ul className="space-y-3">
                  {section.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Comprehensive platform capabilities designed for large-scale educational deployments 
              with robust security, real-time collaboration, and scalable architecture.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Flexible Deployment Options
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Deploy AIVO according to your institution's requirements with multiple 
              deployment strategies designed for scalability and security.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {deploymentOptions.map((option, index) => (
              <motion.div
                key={option.title}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <option.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <ul className="space-y-2 text-sm">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Details */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 text-white">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Complete Technology Specifications
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Every component built with modern, production-ready technologies 
                for enterprise-scale educational technology deployment.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Frontend Stack</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>TypeScript 5.6+ with React 19</div>
                  <div>Vite 7.0 build system</div>
                  <div>Tailwind CSS 4.0-beta</div>
                  <div>Framer Motion animations</div>
                </div>
              </div>
              
              <div className="text-center">
                <Server className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Backend Services</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Express.js with WebSocket</div>
                  <div>Node.js 20+ runtime</div>
                  <div>JWT authentication with MFA</div>
                  <div>Real-time event streaming</div>
                </div>
              </div>
              
              <div className="text-center">
                <Layers className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Architecture</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Turborepo monorepo</div>
                  <div>pnpm package management</div>
                  <div>Shared component libraries</div>
                  <div>Multi-portal deployment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Deploy AIVO at Scale?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Contact our enterprise team to discuss deployment options, 
              customization requirements, and integration possibilities for your institution.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-50">
                Schedule Enterprise Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="ghost" className="text-white border-white hover:bg-white/10">
                <Globe className="w-4 h-4 mr-2" />
                View Architecture Docs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};