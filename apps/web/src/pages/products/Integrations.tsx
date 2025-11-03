import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Puzzle, 
  ArrowRight, 
  Check, 
  Globe, 
  Zap,
  Shield,
  Clock,
  Users,
  BookOpen,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  PlayCircle,
  Download,
  ExternalLink
} from 'lucide-react';

const Integrations: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const handleRequestIntegration = () => {
    navigate('/contact?subject=integration-request');
  };

  const handleExploreAPI = () => {
    navigate('/api-access');
  };

  const categories = [
    { id: 'all', name: 'All Integrations', count: 24 },
    { id: 'lms', name: 'Learning Management', count: 8 },
    { id: 'communication', name: 'Communication', count: 6 },
    { id: 'assessment', name: 'Assessment & Analytics', count: 5 },
    { id: 'productivity', name: 'Productivity Tools', count: 5 }
  ];

  const integrations = [
    // LMS Integrations
    {
      id: 'canvas',
      name: 'Canvas LMS',
      category: 'lms',
      description: 'Seamless grade passback and assignment synchronization with Canvas Learning Management System.',
      icon: '🎨',
      status: 'active',
      features: ['Single Sign-On', 'Grade Sync', 'Deep Linking', 'Roster Import'],
      setupTime: '5 minutes'
    },
    {
      id: 'google-classroom',
      name: 'Google Classroom',
      category: 'lms',
      description: 'Direct integration with Google Classroom for assignment distribution and grading.',
      icon: '🏫',
      status: 'active',
      features: ['Assignment Sync', 'Google Drive Integration', 'Roster Management'],
      setupTime: '3 minutes'
    },
    {
      id: 'schoology',
      name: 'Schoology',
      category: 'lms',
      description: 'Complete integration with Schoology for seamless workflow management.',
      icon: '📚',
      status: 'active',
      features: ['Gradebook Sync', 'Content Library', 'Analytics Dashboard'],
      setupTime: '10 minutes'
    },
    
    // Communication Integrations
    {
      id: 'zoom',
      name: 'Zoom',
      category: 'communication',
      description: 'Launch AIVO sessions directly from Zoom meetings with screen sharing capabilities.',
      icon: '📹',
      status: 'active',
      features: ['Meeting Integration', 'Screen Sharing', 'Recording Support'],
      setupTime: '2 minutes'
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      category: 'communication',
      description: 'Native Microsoft Teams integration for collaborative learning sessions.',
      icon: '👥',
      status: 'active',
      features: ['Teams Integration', 'File Sharing', 'Chat Support'],
      setupTime: '5 minutes'
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      description: 'Get AIVO notifications and manage student progress directly in Slack.',
      icon: '💬',
      status: 'beta',
      features: ['Progress Notifications', 'Quick Actions', 'Team Collaboration'],
      setupTime: '3 minutes'
    },
    
    // Assessment & Analytics
    {
      id: 'power-bi',
      name: 'Microsoft Power BI',
      category: 'assessment',
      description: 'Advanced analytics and reporting with Power BI integration.',
      icon: '📊',
      status: 'active',
      features: ['Custom Dashboards', 'Data Export', 'Automated Reports'],
      setupTime: '15 minutes'
    },
    {
      id: 'tableau',
      name: 'Tableau',
      category: 'assessment',
      description: 'Comprehensive data visualization with Tableau integration.',
      icon: '📈',
      status: 'coming-soon',
      features: ['Data Visualization', 'Custom Reports', 'Real-time Updates'],
      setupTime: 'Coming Q2 2025'
    },
    
    // Productivity Tools
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      category: 'productivity',
      description: 'Full integration with Google Docs, Sheets, and Drive for document management.',
      icon: '🗂️',
      status: 'active',
      features: ['Document Sync', 'Collaborative Editing', 'Cloud Storage'],
      setupTime: '5 minutes'
    },
    {
      id: 'office-365',
      name: 'Microsoft 365',
      category: 'productivity',
      description: 'Complete Office 365 integration for seamless document workflow.',
      icon: '🏢',
      status: 'active',
      features: ['Word Integration', 'Excel Reports', 'OneDrive Sync'],
      setupTime: '10 minutes'
    }
  ];

  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-blue-100 text-blue-800';
      case 'coming-soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'beta': return 'Beta';
      case 'coming-soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-purple-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Puzzle className="w-4 h-4" />
              Connect Your Favorite Tools
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">Integrations</span> for Seamless Learning
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect AIVO with your existing tools and platforms. Our extensive integration 
              ecosystem ensures AIVO fits perfectly into your current workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleExploreAPI}
                className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Explore API Access
              </button>
              <button 
                onClick={handleRequestIntegration}
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors inline-flex items-center gap-2"
              >
                Request Integration
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Integration Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse integrations by category to find the tools that work best with your existing setup.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl mb-3">{integration.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {getStatusText(integration.status)}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-gray-600 mb-4">{integration.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {integration.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Setup: {integration.setupTime}
                  </div>
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      integration.status === 'active' 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : integration.status === 'beta'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={integration.status === 'coming-soon'}
                  >
                    {integration.status === 'coming-soon' ? 'Coming Soon' : 'Connect'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-linear-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AIVO Integrations?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our integration platform is built with security, scalability, and ease-of-use in mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'All integrations maintain FERPA and COPPA compliance with end-to-end encryption.'
              },
              {
                icon: Zap,
                title: 'Real-time Sync',
                description: 'Data synchronization happens in real-time, ensuring everyone stays up-to-date.'
              },
              {
                icon: Settings,
                title: 'Easy Setup',
                description: 'Most integrations can be set up in under 10 minutes with our guided setup wizard.'
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Enable seamless collaboration across teams and departments with shared workflows.'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <benefit.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API & Custom Integrations */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Need a Custom Integration?
              </h2>
              <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-8">
                Don't see your favorite tool? Our robust API and development team can help you 
                build custom integrations tailored to your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleExploreAPI}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Explore API Documentation
                </button>
                <button 
                  onClick={handleRequestIntegration}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  Request Custom Integration
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Integrations;
