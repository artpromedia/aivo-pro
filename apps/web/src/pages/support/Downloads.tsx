import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  BookOpen, 
  Video, 
  Image,
  Search,
  Filter,
  Star,
  Eye,
  Calendar,
  User,
  Tag,
  ArrowRight,
  CheckCircle,
  Award,
  Zap,
  Shield,
  Users,
  BarChart3,
  GraduationCap,
  Heart,
  ExternalLink
} from 'lucide-react';

const Downloads: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDownload = (resourceId: string) => {
    // In real app, would trigger actual download
    window.open(`/downloads/${resourceId}`, '_blank');
  };

  const handleContactSales = () => {
    navigate('/contact?subject=enterprise-resources');
  };

  const categories = [
    { id: 'all', name: 'All Resources', count: 32, icon: BookOpen },
    { id: 'whitepapers', name: 'Whitepapers', count: 8, icon: FileText },
    { id: 'guides', name: 'Implementation Guides', count: 12, icon: BookOpen },
    { id: 'case-studies', name: 'Case Studies', count: 6, icon: Award },
    { id: 'templates', name: 'Templates & Tools', count: 4, icon: Zap },
    { id: 'research', name: 'Research Reports', count: 2, icon: BarChart3 }
  ];

  const resources = [
    {
      id: 'special-education-ai-guide-2025',
      title: 'The Complete Guide to AI in Special Education',
      description: 'Comprehensive 45-page guide covering AI implementation strategies, best practices, and real-world case studies from leading educators.',
      category: 'whitepapers',
      type: 'PDF',
      size: '3.2 MB',
      pages: 45,
      downloadCount: 2847,
      rating: 4.9,
      publishDate: '2024-12-15',
      author: 'Dr. Sarah Martinez',
      featured: true,
      premium: false,
      tags: ['AI', 'Special Education', 'Implementation', 'Best Practices'],
      preview: '/previews/ai-guide-preview.jpg'
    },
    {
      id: 'iep-integration-handbook',
      title: 'IEP Integration Handbook: From Setup to Success',
      description: 'Step-by-step handbook for integrating AIVO with existing IEP systems, including compliance checklists and troubleshooting guides.',
      category: 'guides',
      type: 'PDF',
      size: '2.1 MB',
      pages: 28,
      downloadCount: 1943,
      rating: 4.8,
      publishDate: '2024-11-30',
      author: 'Implementation Team',
      featured: true,
      premium: false,
      tags: ['IEP', 'Integration', 'Setup', 'Compliance'],
      preview: '/previews/iep-handbook-preview.jpg'
    },
    {
      id: 'autism-support-research-2024',
      title: 'Autism Support Technology: 2024 Research Findings',
      description: 'Latest research on technology-assisted autism support, featuring data from 15,000+ students and evidence-based recommendations.',
      category: 'research',
      type: 'PDF',
      size: '5.7 MB',
      pages: 62,
      downloadCount: 892,
      rating: 4.7,
      publishDate: '2024-10-20',
      author: 'AIVO Research Division',
      featured: false,
      premium: true,
      tags: ['Autism', 'Research', 'Technology', 'Evidence-Based'],
      preview: '/previews/autism-research-preview.jpg'
    },
    {
      id: 'parent-engagement-toolkit',
      title: 'Parent Engagement Toolkit: Building Stronger Partnerships',
      description: 'Complete toolkit with templates, communication guides, and strategies for improving parent-school collaboration.',
      category: 'templates',
      type: 'ZIP',
      size: '12.4 MB',
      pages: null,
      downloadCount: 1567,
      rating: 4.9,
      publishDate: '2024-12-01',
      author: 'Family Success Team',
      featured: false,
      premium: false,
      tags: ['Parent Engagement', 'Communication', 'Templates', 'Collaboration'],
      preview: '/previews/parent-toolkit-preview.jpg'
    },
    {
      id: 'riverside-elementary-case-study',
      title: 'Case Study: Riverside Elementary\'s 78% Engagement Improvement',
      description: 'Detailed case study documenting Riverside Elementary\'s successful AIVO implementation and measurable outcomes.',
      category: 'case-studies',
      type: 'PDF',
      size: '1.8 MB',
      pages: 16,
      downloadCount: 1234,
      rating: 4.8,
      publishDate: '2024-11-15',
      author: 'Principal Maria Rodriguez',
      featured: true,
      premium: false,
      tags: ['Case Study', 'Elementary', 'Engagement', 'Results'],
      preview: '/previews/riverside-case-study-preview.jpg'
    },
    {
      id: 'district-implementation-roadmap',
      title: 'District-Wide Implementation Roadmap',
      description: '90-day implementation plan for school districts, including timeline, milestones, and success metrics.',
      category: 'guides',
      type: 'PDF',
      size: '2.9 MB',
      pages: 35,
      downloadCount: 678,
      rating: 4.6,
      publishDate: '2024-09-30',
      author: 'Enterprise Solutions Team',
      featured: false,
      premium: true,
      tags: ['District', 'Implementation', 'Planning', 'Timeline'],
      preview: '/previews/district-roadmap-preview.jpg'
    },
    {
      id: 'data-privacy-compliance-guide',
      title: 'Student Data Privacy & Compliance Guide',
      description: 'Comprehensive guide to FERPA, COPPA, and other privacy regulations in educational technology.',
      category: 'whitepapers',
      type: 'PDF',
      size: '2.4 MB',
      pages: 32,
      downloadCount: 2156,
      rating: 4.9,
      publishDate: '2024-11-01',
      author: 'Legal & Compliance Team',
      featured: false,
      premium: false,
      tags: ['Privacy', 'FERPA', 'COPPA', 'Compliance'],
      preview: '/previews/privacy-guide-preview.jpg'
    },
    {
      id: 'assessment-strategies-whitepaper',
      title: 'AI-Powered Assessment Strategies for Special Education',
      description: 'Research-backed strategies for using AI to create more effective and inclusive assessment methods.',
      category: 'whitepapers',
      type: 'PDF',
      size: '3.8 MB',
      pages: 41,
      downloadCount: 1687,
      rating: 4.7,
      publishDate: '2024-10-15',
      author: 'Dr. Michael Chen',
      featured: false,
      premium: false,
      tags: ['Assessment', 'AI', 'Inclusive Education', 'Strategies'],
      preview: '/previews/assessment-strategies-preview.jpg'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter(resource => resource.featured);
  const premiumResources = resources.filter(resource => resource.premium);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (size: string) => {
    return size.replace(' MB', 'MB').replace(' KB', 'KB');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return FileText;
      case 'ZIP': return Download;
      case 'VIDEO': return Video;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-700';
      case 'ZIP': return 'bg-blue-100 text-blue-700';
      case 'VIDEO': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-green-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Download className="w-4 h-4" />
              Free Educational Resources
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Expert <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-blue-600">Resources</span> & Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access our comprehensive library of whitepapers, implementation guides, 
              case studies, and research reports to accelerate your special education success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveCategory('guides')}
                className="bg-linear-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Browse Implementation Guides
              </button>
              <button 
                onClick={() => setActiveCategory('whitepapers')}
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2"
              >
                View Whitepapers
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resource Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: FileText, number: '32+', label: 'Total Resources' },
              { icon: Download, number: '15,000+', label: 'Total Downloads' },
              { icon: Users, number: '5,000+', label: 'Active Users' },
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
                <div className="bg-linear-to-br from-green-50 to-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular and comprehensive resources, trusted by thousands of educators.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredResources.slice(0, 2).map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)} flex items-center gap-1`}>
                        {React.createElement(getTypeIcon(resource.type), { className: "w-3 h-3" })}
                        {resource.type}
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                      {resource.premium && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    {resource.author}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(resource.publishDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    {resource.pages ? `${resource.pages} pages` : 'Multi-file'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Download className="w-4 h-4" />
                    {resource.downloadCount.toLocaleString()} downloads
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{resource.rating}/5</span>
                    <span className="text-sm text-gray-500">• {formatFileSize(resource.size)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {resource.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDownload(resource.id)}
                    className="flex-1 bg-linear-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all inline-flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download {resource.premium ? '(Premium)' : 'Free'}
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-20 px-6 bg-linear-to-r from-green-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Resource Library
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search and browse our full collection of educational resources and tools.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl font-medium transition-all text-center ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
              >
                <category.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs opacity-75">({category.count})</div>
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)} flex items-center gap-1`}>
                    {React.createElement(getTypeIcon(resource.type), { className: "w-3 h-3" })}
                    {resource.type}
                  </span>
                  <div className="flex gap-1">
                    {resource.featured && (
                      <div className="bg-linear-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                      </div>
                    )}
                    {resource.premium && (
                      <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                        Premium
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {resource.author}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {resource.rating}/5
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      {resource.downloadCount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{formatFileSize(resource.size)}</span>
                  <button 
                    onClick={() => handleDownload(resource.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      resource.premium 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {resource.premium ? 'Get Premium' : 'Download'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Resources CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-linear-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Unlock Premium Resources
              </h2>
              <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
                Get access to exclusive research reports, advanced implementation guides, 
                and priority support with our premium resource library.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleContactSales}
                  className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Learn About Premium
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  Contact Sales Team
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

export default Downloads;
