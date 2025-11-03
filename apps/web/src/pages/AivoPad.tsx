import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Tablet, Shield, Wifi, Battery, Cpu, Eye, Volume2, ArrowRight, Check, Users } from 'lucide-react';

export const AivoPad: React.FC = () => {
  const navigate = useNavigate();

  const handlePreOrderClick = () => {
    navigate('/contact');
  };

  const handleLearnMoreClick = () => {
    navigate('/features');
  };

  const handleJoinWaitlistClick = () => {
    navigate('/contact');
  };

  const specs = [
    {
      key: 'display',
      label: 'Display',
      value: '10.9" Retina Display with TrueTone'
    },
    {
      key: 'processor',
      label: 'Processor',
      value: 'Custom Neural Engine for AI'
    },
    {
      key: 'eyeTracking',
      label: 'Eye Tracking',
      value: 'Built-in attention monitoring'
    },
    {
      key: 'battery',
      label: 'Battery',
      value: '12+ hours of active learning'
    },
    {
      key: 'storage',
      label: 'Storage',
      value: '128GB / 256GB options'
    },
    {
      key: 'safety',
      label: 'Safety',
      value: 'COPPA & FERPA compliant'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Zero Distractions',
      description: 'No games, social media, or web browsing. Pure learning environment.',
    },
    {
      icon: Eye,
      title: 'Attention Tracking',
      description: 'AI monitors engagement and adapts lessons when attention wavers.',
    },
    {
      icon: Cpu,
      title: 'Offline AI',
      description: 'Built-in AI works without internet for consistent learning anywhere.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
              Coming Q2 2025
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              The First Tablet Built for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Neurodiverse Learning
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built tablet designed for neurodiverse learners. Powered by our 
              adaptive AI platform with a distraction-free, accessible interface optimized 
              for special education needs.
            </p>
            
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto mb-8 mt-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Tablet className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-gray-800">Development Status</span>
              </div>
              <p className="text-gray-700 text-center">
                The AIVO Pad is currently in development. Sign up for updates to be 
                notified when pre-orders open.
              </p>
            </div>
          </motion.div>

          {/* Device Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8">
                <div className="w-full aspect-[4/3] bg-gray-900 rounded-2xl relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Tablet className="w-24 h-24 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                </div>
                
                {/* Floating specs */}
                <motion.div 
                  className="absolute top-10 -left-4 bg-white p-4 rounded-xl shadow-lg border border-purple-100"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Eye className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-sm font-medium">Eye-tracking built in</p>
                </motion.div>

                <motion.div 
                  className="absolute bottom-10 -right-4 bg-white p-4 rounded-xl shadow-lg border border-purple-100"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <Battery className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium">12+ hour battery</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">Hardware Meets AI</h2>
              <div className="space-y-4">
                {specs.map((spec) => (
                  <div key={spec.key} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{spec.label}</p>
                      <p className="text-gray-600">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleJoinWaitlistClick}
                  className="bg-linear-to-r from-purple-600 to-pink-600 text-white"
                >
                  Join Waitlist - $199
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="secondary"
                  onClick={handleLearnMoreClick}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Focus & Accessibility
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every feature is carefully crafted to support neurodiverse learners
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Integration Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Seamless Platform Integration
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              The AIVO Pad integrates perfectly with our Turborepo monorepo architecture, 
              running optimized versions of our core applications built with React 19 and TypeScript 5.6+
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Tablet className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learner App (Port 5176)</h3>
              <p className="text-gray-600 mb-4">
                Child-facing interface with minimal UI, built with React 19 and 
                TypeScript for maximum accessibility and focus
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <code className="text-sm text-gray-700">apps/learner-app/</code>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Parent Portal Access</h3>
              <p className="text-gray-600 mb-4">
                Parents can remotely monitor progress and adjust settings through 
                the parent-portal dashboard (Port 5174)
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <code className="text-sm text-gray-700">apps/parent-portal/</code>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Teacher Integration</h3>
              <p className="text-gray-600 mb-4">
                Teachers can push assignments and track progress via the 
                teacher-portal interface (Port 5175)
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <code className="text-sm text-gray-700">apps/teacher-portal/</code>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Built on Modern Architecture
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Core Technologies</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Node.js v20.19.4 runtime environment</li>
                  <li>• Vite 7.0.0 for optimized builds</li>
                  <li>• Tailwind CSS 4.0.0-beta styling</li>
                  <li>• pnpm workspace management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Shared Libraries</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• packages/ui - Design system components</li>
                  <li>• packages/auth - Authentication logic</li>
                  <li>• packages/types - TypeScript definitions</li>
                  <li>• packages/utils - Shared utilities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-order CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Be Among the First to Experience AIVO Pad
            </h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Limited quantities available for Q2 2025 launch. Secure your AIVO Pad today.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleJoinWaitlistClick}
                className="bg-white text-purple-600 hover:bg-gray-50"
              >
                Reserve Yours - $199
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                onClick={handleLearnMoreClick}
                className="text-white border-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};