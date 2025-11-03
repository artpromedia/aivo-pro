import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Target, Shield, Zap, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Virtual Brain',
    description: 'Each student gets a personalized AI agent that learns and adapts',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Target,
    title: 'IEP Aligned',
    description: 'Automatically syncs with Individual Education Programs',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Users,
    title: 'Neurodiverse Support',
    description: 'Built specifically for K-12 and college learners with diverse needs',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Shield,
    title: 'FERPA Compliant',
    description: 'Enterprise-grade security for educational data',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Zap,
    title: 'Real-time Adaptation',
    description: 'Lessons adjust instantly based on performance',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: BookOpen,
    title: 'Multi-Subject',
    description: 'Comprehensive coverage across all academic subjects',
    color: 'bg-indigo-100 text-indigo-600',
  },
];

export const FeatureGrid: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-purple-600 font-semibold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Master Every Subject, Instantly
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            AIVO helps every learner improve with smart, focused tools tailored 
            for neurodiverse students.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};