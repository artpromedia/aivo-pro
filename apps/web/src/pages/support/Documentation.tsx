import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Search, Code, Download, ExternalLink, ChevronRight, FileText, Video, Lightbulb } from 'lucide-react';

const Documentation: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleContactSupport = () => {
    navigate('/contact');
  };

  const handleScheduleDemo = () => {
    navigate('/schedule-demo');
  };

  const categories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Everything you need to begin your AIVO journey",
      articles: [
        { title: "Quick Start Guide", type: "guide", readTime: "5 min" },
        { title: "Setting Up Your First Student Profile", type: "tutorial", readTime: "10 min" },
        { title: "Understanding IEP Integration", type: "guide", readTime: "8 min" },
        { title: "Parent Dashboard Overview", type: "tutorial", readTime: "7 min" }
      ]
    },
    {
      icon: Code,
      title: "API Documentation",
      description: "Technical documentation for developers",
      articles: [
        { title: "API Authentication", type: "technical", readTime: "15 min" },
        { title: "Student Data Endpoints", type: "reference", readTime: "12 min" },
        { title: "Progress Tracking API", type: "tutorial", readTime: "20 min" },
        { title: "Webhook Integration", type: "technical", readTime: "18 min" }
      ]
    },
    {
      icon: Lightbulb,
      title: "Best Practices",
      description: "Tips and strategies for optimal learning outcomes",
      articles: [
        { title: "Maximizing Engagement for ADHD Students", type: "guide", readTime: "12 min" },
        { title: "Supporting Students with Autism", type: "guide", readTime: "15 min" },
        { title: "Creating Effective Learning Schedules", type: "tutorial", readTime: "10 min" },
        { title: "Collaborating with Teachers", type: "guide", readTime: "8 min" }
      ]
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides and walkthroughs",
      articles: [
        { title: "Platform Overview (Video)", type: "video", readTime: "25 min" },
        { title: "Setting Up Accessibility Features", type: "video", readTime: "15 min" },
        { title: "Progress Report Walkthrough", type: "video", readTime: "18 min" },
        { title: "Troubleshooting Common Issues", type: "video", readTime: "22 min" }
      ]
    }
  ];

  const quickLinks = [
    { title: "API Reference", icon: Code, href: "/products/api" },
    { title: "SDK Downloads", icon: Download, href: "#" },
    { title: "Status Page", icon: ExternalLink, href: "/support/status" },
    { title: "Contact Support", icon: FileText, href: "/contact" }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'technical': return Code;
      case 'tutorial': return Book;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-600';
      case 'technical': return 'bg-blue-100 text-blue-600';
      case 'tutorial': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive guides, API documentation, and resources to help you make the most of AIVO's learning platform.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {quickLinks.map((link, index) => (
              <motion.a
                key={link.title}
                href={link.href}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <link.icon className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">{link.title}</span>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.articles.map((article) => {
                    const TypeIcon = getTypeIcon(article.type);
                    return (
                      <div
                        key={article.title}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(article.type)}`}>
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                              {article.title}
                            </p>
                            <p className="text-sm text-gray-500">{article.readTime}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Most Popular Articles
            </h2>
            <p className="text-gray-600">
              The most frequently accessed documentation and guides
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Complete Setup Guide for New Users",
                description: "Step-by-step instructions for getting started with AIVO",
                views: "12.3k",
                category: "Getting Started"
              },
              {
                title: "Understanding Your Child's Progress Reports",
                description: "How to interpret analytics and share with teachers",
                views: "8.7k",
                category: "Analytics"
              },
              {
                title: "Troubleshooting Common Technical Issues",
                description: "Solutions to frequently encountered problems",
                views: "6.2k",
                category: "Support"
              }
            ].map((article, index) => (
              <motion.div
                key={article.title}
                className="p-6 border border-gray-200 rounded-xl hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full mb-3">
                    {article.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm">{article.description}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.views} views</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Need More Help */}
      <section className="py-20 px-6 bg-linear-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Need More Help?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleContactSupport}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
              <button 
                onClick={handleScheduleDemo}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Schedule a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
