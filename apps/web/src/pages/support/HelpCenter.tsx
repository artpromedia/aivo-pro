import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Book, MessageCircle, Video, Phone, Mail, HelpCircle, Users, Zap, Settings } from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleEmailSupport = () => {
    navigate('/contact');
  };

  const handleCallSupport = () => {
    window.location.href = 'tel:+1-555-AIVO-HELP';
  };

  const handleSupportOption = (action: string) => {
    switch (action) {
      case 'Start Chat':
        // Open chat widget or navigate to chat page
        console.log('Opening live chat...');
        break;
      case 'Browse Articles':
        navigate('/documentation');
        break;
      case 'Watch Videos':
        navigate('/tutorials');
        break;
      case 'Join Community':
        navigate('/community');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      availability: '24/7 for Pro & Premium users'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step guides for all features',
      action: 'Watch Videos',
      availability: 'Always available'
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Comprehensive guides and API docs',
      action: 'Browse Docs',
      availability: 'Always available'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      action: 'Call Support',
      availability: 'Mon-Fri 8AM-6PM PST'
    }
  ];

  const popularArticles = [
    {
      category: 'Getting Started',
      icon: Zap,
      articles: [
        'How to create your first student profile',
        'Setting up IEP goals in AIVO',
        'Understanding the adaptive learning system',
        'Parent dashboard overview'
      ]
    },
    {
      category: 'For Educators',
      icon: Users,
      articles: [
        'Integrating AIVO with your LMS',
        'Creating custom learning plans',
        'Generating progress reports',
        'Collaborating with parents and therapists'
      ]
    },
    {
      category: 'Technical Help',
      icon: Settings,
      articles: [
        'Troubleshooting login issues',
        'Browser compatibility guide',
        'AIVO Pad setup and maintenance',
        'Data export and backup'
      ]
    }
  ];

  const quickActions = [
    { title: 'Reset Password', description: 'Get help logging into your account' },
    { title: 'Report a Bug', description: 'Let us know about technical issues' },
    { title: 'Feature Request', description: 'Suggest improvements to AIVO' },
    { title: 'Account Billing', description: 'Questions about your subscription' }
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-linear-to-b from-purple-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers, get support, and learn how to make the most of AIVO Learning
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Get Support
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <motion.div
                key={option.title}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <button 
                  onClick={() => handleSupportOption(option.action)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors mb-3"
                >
                  {option.action}
                </button>
                <p className="text-xs text-gray-500">{option.availability}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Popular Help Articles
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {popularArticles.map((category, index) => (
              <motion.div
                key={category.category}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <button 
                        onClick={() => alert(`Opening article: ${article}`)}
                        className="text-left text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 w-full"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                        {article}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Quick Actions
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-linear-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Still need help?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Our support team is here to help you succeed with AIVO Learning. 
              Reach out anytime for personalized assistance.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleEmailSupport}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </button>
              <button 
                onClick={handleCallSupport}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Support
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
