import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  {
    label: 'RETENTION RATE',
    value: '92%',
    description: 'Students staying engaged',
  },
  {
    label: 'TOTAL STUDENTS',
    value: '50K+',
    description: '28% growth rate this month',
  },
  {
    label: 'DAILY ACTIVE USERS',
    value: '15K+',
    description: 'Using AIVO Regularly',
  },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-delayed" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
                <p className="text-sm font-semibold text-purple-600 mb-4 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-lg">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};