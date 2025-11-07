import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Brain, TrendingUp, Award, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Profile',
    description: 'Tell us about your learner\'s needs, IEP goals, and learning preferences. This helps AIVO understand how to best support your child.',
    details: ['Learning style assessment', 'IEP/504 plan integration', 'Accessibility preferences', 'Subject strengths & challenges']
  },
  {
    icon: Brain,
    number: '02',
    title: 'AI Creates Virtual Brain',
    description: 'AIVO builds a personalized AI agent that adapts to your child\'s unique learning style and cognitive patterns.',
    details: ['Neural pathway modeling', 'Attention pattern analysis', 'Memory retention optimization', 'Processing speed calibration']
  },
  {
    icon: TrendingUp,
    number: '03',
    title: 'Adaptive Learning Begins',
    description: 'Lessons adjust in real-time based on performance, attention, and engagement levels to maintain optimal learning flow.',
    details: ['Real-time difficulty adjustment', 'Attention monitoring', 'Break recommendations', 'Multi-sensory content delivery']
  },
  {
    icon: Award,
    number: '04',
    title: 'Track Progress',
    description: 'See detailed analytics, celebrate achievements, and share comprehensive reports with teachers and therapists.',
    details: ['IEP goal progress tracking', 'Skill mastery analytics', 'Engagement reports', 'Teacher collaboration tools']
  },
];

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const handleStartTrialClick = () => {
    navigate('/pricing');
  };

  const handleWatchDemoClick = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
              Simple Setup
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              How AIVO Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple 4-step process designed specifically 
              for neurodiverse learners and their families.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connection Line - Desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-200 via-purple-400 to-purple-600 hidden lg:block"></div>
            
            <div className="space-y-16">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-1">
                    <div className={`bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow ${
                      index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                    }`}>
                      <div className={`mb-4 ${index % 2 === 0 ? 'lg:flex lg:justify-end' : ''}`}>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                          Step {step.number}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                      
                      <div className={`${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                        <ul className={`space-y-2 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                          {step.details.map((detail, i) => (
                            <li key={i} className={`flex items-center gap-2 text-gray-600 ${
                              index % 2 === 0 ? 'lg:justify-end' : ''
                            }`}>
                              {index % 2 === 0 ? (
                                <>
                                  <span className="hidden lg:block">{detail}</span>
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                  <span className="lg:hidden">{detail}</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                  <span>{detail}</span>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white shadow-xl">
                        <step.icon className="w-10 h-10" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-100">
                        <span className="text-xs font-bold text-purple-600">{step.number}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Families Choose AIVO
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built specifically for neurodiverse learners with input from educators, 
              therapists, and families who understand the unique challenges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Truly Personalized',
                description: 'Not just adaptive content, but AI that understands individual learning patterns and needs.',
                stat: '95%',
                statLabel: 'improvement in engagement'
              },
              {
                title: 'Evidence-Based',
                description: 'Methods rooted in special education research and proven therapeutic approaches.',
                stat: '78%',
                statLabel: 'faster skill acquisition'
              },
              {
                title: 'Family-Centered',
                description: 'Designed with parents, teachers, and therapists as partners in the learning journey.',
                stat: '4.9/5',
                statLabel: 'parent satisfaction'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                  {benefit.stat}
                </div>
                <div className="text-sm text-purple-600 mb-4">{benefit.statLabel}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Learning?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of families who have discovered a better way to learn. 
              Start your free trial today.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleStartTrialClick}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={handleWatchDemoClick}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
