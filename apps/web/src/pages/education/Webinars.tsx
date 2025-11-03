import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Download,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle,
  Bell,
  Star,
  Filter,
  Search,
  ExternalLink,
  Zap,
  GraduationCap,
  MessageSquare,
  Share2,
  Eye
} from 'lucide-react';

const Webinars: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRegisterWebinar = (webinarId: string) => {
    navigate(`/register?webinar=${webinarId}`);
  };

  const handleWatchRecording = (webinarId: string) => {
    // In real app, would open video player or navigate to recording
    console.log('Opening recording for:', webinarId);
  };

  const handleJoinLive = (webinarId: string) => {
    // In real app, would open live webinar room
    window.open(`https://webinar.aivo.com/join/${webinarId}`, '_blank');
  };

  const filters = [
    { id: 'all', name: 'All Webinars', count: 28 },
    { id: 'upcoming', name: 'Upcoming', count: 6 },
    { id: 'recorded', name: 'Recorded', count: 22 },
    { id: 'series', name: 'Series', count: 4 }
  ];

  const categories = [
    { id: 'getting-started', name: 'Getting Started', color: 'bg-blue-100 text-blue-700' },
    { id: 'advanced', name: 'Advanced Features', color: 'bg-purple-100 text-purple-700' },
    { id: 'case-studies', name: 'Case Studies', color: 'bg-green-100 text-green-700' },
    { id: 'best-practices', name: 'Best Practices', color: 'bg-orange-100 text-orange-700' },
    { id: 'research', name: 'Research & Insights', color: 'bg-pink-100 text-pink-700' }
  ];

  const webinars = [
    {
      id: 'intro-to-aivo-2025',
      title: 'Introduction to AIVO: Getting Started with AI-Powered Special Education',
      description: 'Learn the fundamentals of AIVO and how to set up your first student profiles and learning plans.',
      type: 'upcoming',
      category: 'getting-started',
      date: '2025-01-15',
      time: '2:00 PM EST',
      duration: '60 minutes',
      presenter: {
        name: 'Dr. Sarah Martinez',
        role: 'Chief Education Officer',
        image: '/images/presenters/sarah-martinez.jpg'
      },
      attendees: 245,
      maxAttendees: 500,
      level: 'Beginner',
      featured: true,
      tags: ['Setup', 'Getting Started', 'IEP Integration']
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics: Leveraging Data for Better Student Outcomes',
      description: 'Deep dive into AIVO\'s analytics dashboard and learn how to interpret data to improve learning outcomes.',
      type: 'upcoming',
      category: 'advanced',
      date: '2025-01-22',
      time: '3:00 PM EST',
      duration: '90 minutes',
      presenter: {
        name: 'Michael Chen',
        role: 'Senior Data Scientist',
        image: '/images/presenters/michael-chen.jpg'
      },
      attendees: 187,
      maxAttendees: 300,
      level: 'Advanced',
      featured: false,
      tags: ['Analytics', 'Data Analysis', 'Outcomes']
    },
    {
      id: 'autism-support-strategies',
      title: 'Supporting Students with Autism: AIVO\'s Specialized Tools and Approaches',
      description: 'Explore AIVO\'s autism-specific features and learn evidence-based strategies for better support.',
      type: 'recorded',
      category: 'best-practices',
      date: '2024-12-10',
      time: 'On Demand',
      duration: '75 minutes',
      presenter: {
        name: 'Dr. Lisa Thompson',
        role: 'Autism Specialist',
        image: '/images/presenters/lisa-thompson.jpg'
      },
      views: 1284,
      rating: 4.8,
      level: 'Intermediate',
      featured: true,
      tags: ['Autism', 'Sensory Learning', 'Communication']
    },
    {
      id: 'riverside-case-study',
      title: 'Case Study: How Riverside Elementary Achieved 78% Improvement in Engagement',
      description: 'Real-world implementation story and lessons learned from a successful AIVO deployment.',
      type: 'recorded',
      category: 'case-studies',
      date: '2024-11-25',
      time: 'On Demand',
      duration: '45 minutes',
      presenter: {
        name: 'Principal Maria Rodriguez',
        role: 'Riverside Elementary',
        image: '/images/presenters/maria-rodriguez.jpg'
      },
      views: 892,
      rating: 4.9,
      level: 'All Levels',
      featured: false,
      tags: ['Implementation', 'Results', 'Elementary']
    },
    {
      id: 'parent-collaboration',
      title: 'Building Strong Parent-School Partnerships with AIVO',
      description: 'Learn how to effectively involve parents in the learning process using AIVO\'s collaboration tools.',
      type: 'upcoming',
      category: 'best-practices',
      date: '2025-02-05',
      time: '7:00 PM EST',
      duration: '60 minutes',
      presenter: {
        name: 'Jennifer Walsh',
        role: 'Parent Engagement Specialist',
        image: '/images/presenters/jennifer-walsh.jpg'
      },
      attendees: 156,
      maxAttendees: 400,
      level: 'All Levels',
      featured: false,
      tags: ['Parent Engagement', 'Collaboration', 'Communication']
    },
    {
      id: 'research-insights-2024',
      title: 'AIVO Research Insights: 2024 Special Education Trends and Outcomes',
      description: 'Annual research presentation covering key findings and trends in special education technology.',
      type: 'recorded',
      category: 'research',
      date: '2024-12-15',
      time: 'On Demand',
      duration: '120 minutes',
      presenter: {
        name: 'Dr. Robert Kim',
        role: 'Head of Research',
        image: '/images/presenters/robert-kim.jpg'
      },
      views: 2156,
      rating: 4.7,
      level: 'All Levels',
      featured: true,
      tags: ['Research', 'Trends', 'Data']
    }
  ];

  const filteredWebinars = webinars.filter(webinar => {
    const matchesFilter = activeFilter === 'all' || webinar.type === activeFilter;
    const matchesSearch = searchQuery === '' || 
      webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webinar.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webinar.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const featuredWebinars = webinars.filter(webinar => webinar.featured);
  const upcomingWebinars = webinars.filter(webinar => webinar.type === 'upcoming');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryStyle = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-700';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'General';
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
              <Video className="w-4 h-4" />
              Expert-Led Learning
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Educational <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">Webinars</span> & Training
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join our expert-led webinars to master AIVO, learn best practices, and connect 
              with educators transforming special education outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveFilter('upcoming')}
                className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                View Upcoming Webinars
              </button>
              <button 
                onClick={() => setActiveFilter('recorded')}
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors inline-flex items-center gap-2"
              >
                Browse Recordings
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Video, number: '28+', label: 'Total Webinars' },
              { icon: Users, number: '15,000+', label: 'Total Attendees' },
              { icon: Clock, number: '120+', label: 'Hours of Content' },
              { icon: Star, number: '4.8/5', label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-linear-to-br from-purple-50 to-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Webinars */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Webinars
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss these highly-rated sessions from our expert presenters.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredWebinars.slice(0, 2).map((webinar, index) => (
              <motion.div
                key={webinar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(webinar.category)}`}>
                        {getCategoryName(webinar.category)}
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{webinar.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{webinar.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {webinar.presenter.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{webinar.presenter.name}</div>
                    <div className="text-sm text-gray-500">{webinar.presenter.role}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {webinar.type === 'upcoming' ? formatDate(webinar.date) : 'On Demand'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {webinar.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {webinar.type === 'upcoming' 
                      ? `${webinar.attendees}/${webinar.maxAttendees} registered`
                      : `${webinar.views} views`
                    }
                  </div>
                  {webinar.type === 'recorded' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4" />
                      {webinar.rating}/5 rating
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mb-6">
                  {webinar.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {webinar.type === 'upcoming' ? (
                    <>
                      <button 
                        onClick={() => handleRegisterWebinar(webinar.id)}
                        className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Register Now
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                        <Bell className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleWatchRecording(webinar.id)}
                        className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all inline-flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Watch Now
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Webinars */}
      <section className="py-20 px-6 bg-linear-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse All Webinars
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search and filter through our complete library of educational content.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search webinars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
                  }`}
                >
                  {filter.name} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Webinars Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebinars.map((webinar, index) => (
              <motion.div
                key={webinar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(webinar.category)}`}>
                    {getCategoryName(webinar.category)}
                  </span>
                  {webinar.featured && (
                    <div className="bg-linear-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{webinar.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{webinar.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {webinar.presenter.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{webinar.presenter.name}</div>
                    <div className="text-xs text-gray-500">{webinar.presenter.role}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {webinar.type === 'upcoming' ? formatDate(webinar.date) : 'Available On Demand'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {webinar.duration}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{webinar.level}</span>
                  {webinar.type === 'upcoming' ? (
                    <button 
                      onClick={() => handleRegisterWebinar(webinar.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Register
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleWatchRecording(webinar.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors inline-flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      Watch
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Bell className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Never Miss a Webinar
              </h2>
              <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-8">
                Subscribe to our newsletter and get notified about upcoming webinars, 
                new recordings, and exclusive educational content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                />
                <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Webinars;
