import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Search,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Code,
  Brain,
  Users,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All', 'Product Updates', 'Technical Deep Dive', 'Research', 'Education', 'Community'
  ];

  const featuredPost = {
    title: 'Building Real-Time Learning Analytics with WebSocket and Express.js',
    excerpt: 'A technical deep dive into how AIVO leverages modern JavaScript technologies to provide instant feedback and real-time collaboration between parents, teachers, and students.',
    author: 'Sarah Chen',
    role: 'Lead Engineer',
    date: '2024-11-01',
    readTime: 8,
    category: 'Technical Deep Dive',
    image: '/api/placeholder/800/400',
    tags: ['WebSocket', 'Express.js', 'Real-time', 'TypeScript'],
    featured: true
  };

  const blogPosts = [
    {
      title: 'Introducing Multi-Portal Architecture: Separate Apps for Different Users',
      excerpt: 'Learn how AIVO\'s Turborepo monorepo structure enables dedicated experiences for parents (port 5174), teachers (port 5175), and students (port 5176).',
      author: 'Michael Rodriguez',
      role: 'VP of Product',
      date: '2024-10-28',
      readTime: 6,
      category: 'Product Updates',
      tags: ['Turborepo', 'Architecture', 'Multi-tenant'],
      likes: 42,
      comments: 18
    },
    {
      title: 'From TypeScript 5.6 to React 19: Our Modern Frontend Stack',
      excerpt: 'Exploring how upgrading to the latest TypeScript and React versions improved our development experience and application performance.',
      author: 'Emily Zhang',
      role: 'Frontend Architect',
      date: '2024-10-25',
      readTime: 5,
      category: 'Technical Deep Dive',
      tags: ['TypeScript', 'React', 'Performance'],
      likes: 67,
      comments: 24
    },
    {
      title: 'Research Update: 67% Improvement in IEP Goal Achievement',
      excerpt: 'Our latest study with 5,000+ students shows significant learning gains when using AIVO\'s PostgreSQL-powered analytics for personalized instruction.',
      author: 'Dr. Amanda Foster',
      role: 'Director of Research',
      date: '2024-10-22',
      readTime: 7,
      category: 'Research',
      tags: ['Research', 'IEP', 'Analytics', 'PostgreSQL'],
      likes: 89,
      comments: 31
    },
    {
      title: 'How We Built Accessible Components with Tailwind CSS v4',
      excerpt: 'A guide to creating WCAG AAA compliant UI components using the latest Tailwind CSS beta features and modern CSS techniques.',
      author: 'Jordan Kim',
      role: 'UI/UX Designer',
      date: '2024-10-20',
      readTime: 4,
      category: 'Technical Deep Dive',
      tags: ['Accessibility', 'Tailwind', 'CSS', 'WCAG'],
      likes: 53,
      comments: 15
    },
    {
      title: 'Community Spotlight: Teachers Share Their AIVO Success Stories',
      excerpt: 'Hear from educators using AIVO\'s teacher portal to track student progress, collaborate with parents, and adapt lesson plans in real-time.',
      author: 'Lisa Chen',
      role: 'Community Manager',
      date: '2024-10-18',
      readTime: 6,
      category: 'Community',
      tags: ['Teachers', 'Success Stories', 'Community'],
      likes: 76,
      comments: 42
    },
    {
      title: 'Scaling with Vite 7.0: Fast Development for Five Applications',
      excerpt: 'How Vite\'s lightning-fast development server and hot module replacement enabled rapid development across our five-app architecture.',
      author: 'Alex Thompson',
      role: 'DevOps Engineer',
      date: '2024-10-15',
      readTime: 5,
      category: 'Technical Deep Dive',
      tags: ['Vite', 'Performance', 'DevOps', 'HMR'],
      likes: 38,
      comments: 12
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical Deep Dive': return Code;
      case 'Research': return Brain;
      case 'Product Updates': return Lightbulb;
      case 'Community': return Users;
      case 'Education': return BookOpen;
      default: return TrendingUp;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
              AIVO Blog
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Insights & Updates
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the latest developments in AI-powered education, technical insights 
              from our engineering team, and research findings that shape the future of learning.
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or technologies..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-white mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">
                  Featured Article
                </span>
                <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-purple-100 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">{featuredPost.author}</div>
                    <div className="text-purple-200 text-sm">{featuredPost.role}</div>
                  </div>
                  <div className="text-purple-200 text-sm">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                  <div className="text-purple-200 text-sm">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {featuredPost.readTime} min read
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredPost.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Button className="bg-white text-purple-600 hover:bg-gray-50">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="lg:order-first">
                <div className="w-full h-80 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Code className="w-16 h-16 text-white/60" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredPosts.map((post, index) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <motion.article
                  key={post.title}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-purple-600">{post.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{post.author}</div>
                          <div className="text-sm text-gray-500">{post.role}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {post.readTime} min
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <Button size="sm" variant="secondary">
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated with AIVO
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the latest technical insights, product updates, and research findings 
              delivered to your inbox. Join our community of educators and developers.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No spam. Unsubscribe anytime. Read our privacy policy.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
