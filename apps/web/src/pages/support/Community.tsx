import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Star, 
  ArrowRight,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  User,
  ThumbsUp,
  MessageCircle,
  Share2,
  Award,
  Zap,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Target,
  Globe,
  TrendingUp,
  CheckCircle,
  Eye,
  ExternalLink
} from 'lucide-react';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleJoinCommunity = () => {
    navigate('/signup?redirect=community');
  };

  const handleCreatePost = () => {
    navigate('/community/create-post');
  };

  const handleJoinEvent = (eventId: string) => {
    navigate(`/community/events/${eventId}`);
  };

  const tabs = [
    { id: 'discussions', name: 'Discussions', count: 1247, icon: MessageSquare },
    { id: 'events', name: 'Events', count: 23, icon: Calendar },
    { id: 'groups', name: 'Groups', count: 45, icon: Users },
    { id: 'resources', name: 'Shared Resources', count: 189, icon: BookOpen }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', color: 'bg-gray-100 text-gray-700' },
    { id: 'getting-started', name: 'Getting Started', color: 'bg-blue-100 text-blue-700' },
    { id: 'best-practices', name: 'Best Practices', color: 'bg-green-100 text-green-700' },
    { id: 'troubleshooting', name: 'Troubleshooting', color: 'bg-orange-100 text-orange-700' },
    { id: 'feature-requests', name: 'Feature Requests', color: 'bg-purple-100 text-purple-700' },
    { id: 'success-stories', name: 'Success Stories', color: 'bg-pink-100 text-pink-700' }
  ];

  const discussions = [
    {
      id: 'iep-integration-tips',
      title: 'Tips for Seamless IEP Integration with AIVO',
      author: 'Sarah Martinez',
      role: 'Special Ed Director',
      avatar: 'SM',
      content: 'After implementing AIVO across our district, I wanted to share some key insights that made our IEP integration process smooth...',
      category: 'best-practices',
      replies: 23,
      likes: 67,
      views: 234,
      timeAgo: '2 hours ago',
      pinned: true,
      solved: false,
      tags: ['IEP', 'Integration', 'Best Practices']
    },
    {
      id: 'autism-sensory-features',
      title: 'How are you using AIVO\'s sensory features for autism support?',
      author: 'Dr. Michael Chen',
      role: 'Autism Specialist',
      avatar: 'MC',
      content: 'I\'d love to hear from other professionals about how you\'re implementing the sensory-aware learning modules...',
      category: 'best-practices',
      replies: 45,
      likes: 89,
      views: 456,
      timeAgo: '5 hours ago',
      pinned: false,
      solved: true,
      tags: ['Autism', 'Sensory Learning', 'Implementation']
    },
    {
      id: 'parent-engagement-strategies',
      title: 'Strategies for Better Parent Engagement Through AIVO',
      author: 'Jennifer Walsh',
      role: 'Family Coordinator',
      avatar: 'JW',
      content: 'Our family engagement has improved 300% since implementing these AIVO communication strategies...',
      category: 'success-stories',
      replies: 31,
      likes: 125,
      views: 678,
      timeAgo: '1 day ago',
      pinned: false,
      solved: false,
      tags: ['Parent Engagement', 'Communication', 'Success']
    },
    {
      id: 'data-export-question',
      title: 'Question: How to export student progress data for reports?',
      author: 'Maria Rodriguez',
      role: 'Elementary Principal',
      avatar: 'MR',
      content: 'I need to create quarterly reports for our school board. What\'s the best way to export comprehensive progress data?',
      category: 'troubleshooting',
      replies: 12,
      likes: 34,
      views: 123,
      timeAgo: '2 days ago',
      pinned: false,
      solved: true,
      tags: ['Data Export', 'Reporting', 'Help Needed']
    }
  ];

  const events = [
    {
      id: 'monthly-best-practices',
      title: 'Monthly Best Practices Roundtable',
      description: 'Join fellow educators for a collaborative discussion on the latest AIVO implementation strategies.',
      date: '2025-01-20',
      time: '3:00 PM EST',
      duration: '60 minutes',
      type: 'Virtual',
      attendees: 67,
      maxAttendees: 100,
      host: 'AIVO Community Team',
      tags: ['Best Practices', 'Discussion', 'Monthly']
    },
    {
      id: 'autism-support-workshop',
      title: 'Autism Support Workshop: Advanced Techniques',
      description: 'Deep dive workshop covering advanced autism support strategies using AIVO\'s specialized tools.',
      date: '2025-01-25',
      time: '2:00 PM EST',
      duration: '90 minutes',
      type: 'Virtual',
      attendees: 89,
      maxAttendees: 150,
      host: 'Dr. Lisa Thompson',
      tags: ['Autism', 'Workshop', 'Advanced']
    },
    {
      id: 'parent-collaboration-meetup',
      title: 'Parent-Educator Collaboration Meetup',
      description: 'A space for parents and educators to share experiences and build stronger partnerships.',
      date: '2025-02-01',
      time: '7:00 PM EST',
      duration: '75 minutes',
      type: 'Virtual',
      attendees: 34,
      maxAttendees: 75,
      host: 'Family Success Team',
      tags: ['Parents', 'Collaboration', 'Partnership']
    }
  ];

  const groups = [
    {
      id: 'special-ed-directors',
      name: 'Special Education Directors',
      description: 'Leadership discussions for special education administrators and directors.',
      members: 234,
      posts: 89,
      activity: 'Very Active',
      private: false,
      moderator: 'Sarah Martinez'
    },
    {
      id: 'autism-specialists',
      name: 'Autism Support Specialists',
      description: 'Focused group for professionals working specifically with autism spectrum students.',
      members: 567,
      posts: 234,
      activity: 'Active',
      private: false,
      moderator: 'Dr. Michael Chen'
    },
    {
      id: 'homeschool-families',
      name: 'Homeschool Families',
      description: 'Support and resource sharing for homeschooling families using AIVO.',
      members: 345,
      posts: 156,
      activity: 'Active',
      private: false,
      moderator: 'Jennifer Walsh'
    },
    {
      id: 'rural-educators',
      name: 'Rural Education Network',
      description: 'Connecting educators in rural and remote areas for resource sharing and support.',
      members: 178,
      posts: 67,
      activity: 'Moderate',
      private: false,
      moderator: 'Tom Anderson'
    }
  ];

  const filteredDiscussions = selectedCategory === 'all' 
    ? discussions 
    : discussions.filter(discussion => discussion.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'Very Active': return 'bg-green-100 text-green-700';
      case 'Active': return 'bg-blue-100 text-blue-700';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryStyle = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-indigo-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Join the Conversation
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AIVO <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Community</span> Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with educators, parents, and specialists from around the world. Share experiences, 
              get support, and discover new ways to transform special education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleJoinCommunity}
                className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Join Our Community
              </button>
              <button 
                onClick={() => setActiveTab('discussions')}
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center gap-2"
              >
                Browse Discussions
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: '8,500+', label: 'Community Members' },
              { icon: MessageSquare, number: '1,200+', label: 'Active Discussions' },
              { icon: Calendar, number: '50+', label: 'Monthly Events' },
              { icon: Heart, number: '98%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Community Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : `${category.color} hover:opacity-80`
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Create Post Button */}
              <div className="mb-8">
                <button 
                  onClick={handleCreatePost}
                  className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start a Discussion
                </button>
              </div>

              {/* Discussions List */}
              <div className="space-y-6">
                {filteredDiscussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {discussion.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {discussion.pinned && (
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                                  Pinned
                                </span>
                              )}
                              {discussion.solved && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Solved
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryStyle(discussion.category)}`}>
                                {categories.find(cat => cat.id === discussion.category)?.name}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{discussion.title}</h3>
                            <p className="text-gray-600 mb-3">{discussion.content}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="font-medium">{discussion.author}</span>
                              <span>•</span>
                              <span>{discussion.role}</span>
                              <span>•</span>
                              <span>{discussion.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {discussion.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {discussion.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {discussion.replies}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {discussion.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time} ({event.duration})
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.attendees}/{event.maxAttendees} attending
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => handleJoinEvent(event.id)}
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Join Event
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="grid md:grid-cols-2 gap-6">
              {groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActivityColor(group.activity)}`}>
                      {group.activity}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">{group.members.toLocaleString()}</div>
                      <div className="text-gray-500">Members</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{group.posts}</div>
                      <div className="text-gray-500">Posts</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Moderated by <span className="font-medium">{group.moderator}</span>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      Join Group
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-8">
                Connect with thousands of educators, parents, and specialists who are transforming 
                special education together. Your voice and experience matter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleJoinCommunity}
                  className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Join Community Now
                </button>
                <button 
                  onClick={() => navigate('/education/webinars')}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  Explore Webinars
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

export default Community;
