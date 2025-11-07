import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { 
  Users, 
  BarChart, 
  BookOpen, 
  Target, 
  Clock, 
  Award, 
  MessageSquare, 
  Download,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

export const ForEducators: React.FC = () => {
  const educatorBenefits = [
    {
      icon: Target,
      title: 'IEP Goal Alignment',
      description: 'Automatically sync with Individual Education Programs and track progress toward specific learning objectives.',
      features: ['Goal progress tracking', 'Automated reporting', 'Data-driven insights']
    },
    {
      icon: BarChart,
      title: 'Real-time Analytics',
      description: 'Monitor student engagement, learning patterns, and areas needing additional support.',
      features: ['Engagement metrics', 'Learning analytics', 'Performance dashboards']
    },
    {
      icon: Users,
      title: 'Collaborative Tools',
      description: 'Work seamlessly with parents, therapists, and other educators to support each student.',
      features: ['Parent communication', 'Team collaboration', 'Shared progress notes']
    },
    {
      icon: Clock,
      title: 'Time-Saving Automation',
      description: 'Reduce administrative workload with automated lesson planning and progress reporting.',
      features: ['Auto-generated reports', 'Lesson recommendations', 'Administrative efficiency']
    }
  ];

  const features = [
    {
      category: 'Classroom Management',
      items: [
        'Student progress dashboards',
        'Behavior tracking and intervention',
        'Collaborative learning activities',
        'Real-time attention monitoring'
      ]
    },
    {
      category: 'Curriculum Integration',
      items: [
        'Standards-aligned content',
        'Multi-subject lesson plans',
        'Adaptive difficulty scaling',
        'Assessment and evaluation tools'
      ]
    },
    {
      category: 'Special Education Support',
      items: [
        'IEP/504 plan integration',
        'Accommodations management',
        'Therapy session coordination',
        'Transition planning tools'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Martinez',
      role: 'Special Education Teacher',
      school: 'Lincoln Elementary School',
      quote: 'AIVO has transformed how I support my students with autism. The real-time feedback helps me adjust my teaching instantly.',
      image: '/testimonials/sarah-martinez.jpg'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Education Director',
      school: 'Bay Area School District',
      quote: 'The data insights from AIVO have helped us make evidence-based decisions that truly impact student outcomes.',
      image: '/testimonials/michael-chen.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
                For Educators
              </span>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Empower Every Student with 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Personalized Learning
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                AIVO provides educators with powerful tools to create inclusive, 
                adaptive learning experiences that meet each student where they are.
              </p>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="secondary">
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <BarChart className="w-8 h-8 text-purple-600 mb-2" />
                    <div className="text-sm font-medium">Student Progress</div>
                    <div className="text-xs text-gray-600">Real-time analytics</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <Target className="w-8 h-8 text-green-600 mb-2" />
                    <div className="text-sm font-medium">IEP Goals</div>
                    <div className="text-xs text-gray-600">85% on track</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <Users className="w-8 h-8 text-blue-600 mb-2" />
                    <div className="text-sm font-medium">Collaboration</div>
                    <div className="text-xs text-gray-600">3 team members</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <Award className="w-8 h-8 text-yellow-600 mb-2" />
                    <div className="text-sm font-medium">Achievements</div>
                    <div className="text-xs text-gray-600">12 this week</div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-12 h-12 bg-purple-500 rounded-full opacity-20"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-500 rounded-full opacity-30"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Educator Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Educators, By Educators
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Every feature is designed with classroom realities in mind, helping you create 
              more effective and inclusive learning environments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {educatorBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
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

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Education Tools
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              From lesson planning to progress tracking, AIVO provides everything you need 
              to support neurodiverse learners effectively.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((category, index) => (
              <motion.div
                key={category.category}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 shrink-0"></div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Educators Are Saying
            </h2>
            <p className="text-gray-600">
              Join thousands of educators who are transforming lives with AIVO
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <blockquote className="text-lg text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-purple-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-600">{testimonial.school}</div>
                  </div>
                </div>
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
              Ready to Transform Your Classroom?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join educators worldwide who are creating more inclusive, effective learning 
              environments with AIVO. Start your free trial today.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Resources
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
