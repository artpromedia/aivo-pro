import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const features = [
  'Personalized AI Tutor',
  'IEP/504 Plan Support',
  'Multi-Subject Coverage',
  'Real-time Adaptation',
  'Parent Dashboard',
  'Teacher Collaboration',
];

export const ComparisonTable: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How AIVO Stacks Up
          </h2>
          <p className="text-gray-600">
            AIVO replaces all traditional learning apps
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-3 gap-0">
            <div className="p-6 border-r border-gray-200">
              <h3 className="font-semibold text-gray-500">AI Features</h3>
            </div>
            <div className="p-6 border-r border-gray-200 bg-purple-50">
              <h3 className="font-semibold text-purple-600">AIVO</h3>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-500">Other Apps</h3>
            </div>
          </div>

          {features.map((feature, index) => (
            <motion.div
              key={feature}
              className="grid grid-cols-3 gap-0 border-t border-gray-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-6 border-r border-gray-200">
                <span className="text-gray-700">{feature}</span>
              </div>
              <div className="p-6 border-r border-gray-200 bg-purple-50 flex justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="p-6 flex justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};