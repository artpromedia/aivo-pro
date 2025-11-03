import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Clock, 
  ArrowRight, 
  Quote,
  Play,
  Download,
  ExternalLink,
  BookOpen,
  BarChart3,
  Target,
  CheckCircle,
  Star,
  GraduationCap,
  School,
  Heart
} from 'lucide-react';

const CaseStudies: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const handleContactSales = () => {
    navigate('/contact?subject=enterprise-sales');
  };

  const handleViewAllResults = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filters = [
    { id: 'all', name: 'All Case Studies', count: 12 },
    { id: 'k12', name: 'K-12 Schools', count: 5 },
    { id: 'districts', name: 'School Districts', count: 4 },
    { id: 'homeschool', name: 'Homeschool', count: 3 }
  ];

  const caseStudies = [
    {
      id: 'riverside-elementary',
      category: 'k12',
      title: 'Riverside Elementary School',
      subtitle: '78% Improvement in Student Engagement',
      location: 'Minneapolis, MN',
      students: 450,
      timeframe: '6 months',
      challenge: 'Supporting 85 students with special needs in mainstream classrooms',
      solution: 'Implemented AIVO\'s adaptive learning platform with real-time IEP tracking',
      results: [
        { metric: '78%', description: 'Increase in student engagement scores' },
        { metric: '65%', description: 'Reduction in behavioral incidents' },
        { metric: '92%', description: 'Teacher satisfaction with AIVO tools' },
        { metric: '45%', description: 'Faster IEP goal achievement' }
      ],
      testimonial: {
        text: "AIVO transformed how we support our special education students. The AI-powered insights help us personalize learning in ways we never thought possible.",
        author: "Sarah Martinez",
        role: "Special Education Director"
      },
      image: '/images/case-studies/riverside-elementary.jpg',
      tags: ['Special Education', 'IEP Management', 'Engagement'],
      featured: true
    },
    {
      id: 'metro-district',
      category: 'districts',
      title: 'Metro School District',
      subtitle: 'District-Wide Implementation Success',
      location: 'Denver, CO',
      students: 12500,
      timeframe: '18 months',
      challenge: 'Coordinating special education services across 45 schools',
      solution: 'Rolled out AIVO platform district-wide with centralized administration',
      results: [
        { metric: '89%', description: 'Improvement in IEP compliance' },
        { metric: '56%', description: 'Reduction in administrative overhead' },
        { metric: '73%', description: 'Increase in parent satisfaction' },
        { metric: '$2.1M', description: 'Annual cost savings achieved' }
      ],
      testimonial: {
        text: "AIVO's district-wide capabilities allowed us to standardize and improve special education services across all our schools while maintaining local flexibility.",
        author: "Dr. Michael Chen",
        role: "Superintendent"
      },
      image: '/images/case-studies/metro-district.jpg',
      tags: ['District Management', 'Compliance', 'Cost Savings'],
      featured: true
    },
    {
      id: 'homeschool-network',
      category: 'homeschool',
      title: 'Twin Cities Homeschool Network',
      subtitle: 'Supporting 200+ Families',
      location: 'Twin Cities, MN',
      students: 850,
      timeframe: '12 months',
      challenge: 'Providing structured support for homeschooling families with special needs children',
      solution: 'Created collaborative learning environment using AIVO\'s family-focused tools',
      results: [
        { metric: '94%', description: 'Parent confidence in teaching' },
        { metric: '82%', description: 'Improvement in learning outcomes' },
        { metric: '67%', description: 'Increase in social interactions' },
        { metric: '91%', description: 'Family satisfaction rate' }
      ],
      testimonial: {
        text: "AIVO gave us the tools and confidence to provide our special needs children with the personalized education they deserve at home.",
        author: "Jennifer Walsh",
        role: "Homeschool Network Coordinator"
      },
      image: '/images/case-studies/homeschool-network.jpg',
      tags: ['Homeschooling', 'Family Support', 'Collaboration'],
      featured: false
    },
    {
      id: 'oakwood-middle',
      category: 'k12',
      title: 'Oakwood Middle School',
      subtitle: 'Breakthrough in Autism Support',
      location: 'Portland, OR',
      students: 680,
      timeframe: '9 months',
      challenge: 'Supporting 32 students on the autism spectrum with varying needs',
      solution: 'Deployed AIVO\'s sensory-aware learning modules and communication tools',
      results: [
        { metric: '85%', description: 'Reduction in sensory overload incidents' },
        { metric: '71%', description: 'Improvement in communication skills' },
        { metric: '90%', description: 'Increase in classroom participation' },
        { metric: '68%', description: 'Better peer social interactions' }
      ],
      testimonial: {
        text: "The sensory-aware features in AIVO have been game-changing for our students with autism. We've seen remarkable progress in their comfort and learning.",
        author: "Dr. Lisa Thompson",
        role: "Autism Specialist"
      },
      image: '/images/case-studies/oakwood-middle.jpg',
      tags: ['Autism Support', 'Sensory Learning', 'Communication'],
      featured: false
    },
    {
      id: 'sunshine-elementary',
      category: 'k12',
      title: 'Sunshine Elementary',
      subtitle: 'Early Intervention Success',
      location: 'Phoenix, AZ',
      students: 320,
      timeframe: '8 months',
      challenge: 'Early identification and intervention for learning differences',
      solution: 'Implemented AIVO\'s early screening and adaptive learning pathways',
      results: [
        { metric: '93%', description: 'Early identification accuracy' },
        { metric: '76%', description: 'Faster intervention deployment' },
        { metric: '88%', description: 'Improved reading comprehension' },
        { metric: '82%', description: 'Math skills improvement' }
      ],
      testimonial: {
        text: "AIVO's early intervention capabilities helped us identify and support learning differences before they became bigger challenges.",
        author: "Maria Rodriguez",
        role: "Elementary Principal"
      },
      image: '/images/case-studies/sunshine-elementary.jpg',
      tags: ['Early Intervention', 'Learning Differences', 'Prevention'],
      featured: false
    },
    {
      id: 'valley-district',
      category: 'districts',
      title: 'Valley Unified School District',
      subtitle: 'Rural Implementation Excellence',
      location: 'Rural Montana',
      students: 2800,
      timeframe: '15 months',
      challenge: 'Providing specialized support across geographically dispersed rural schools',
      solution: 'Leveraged AIVO\'s cloud-based platform for remote collaboration and support',
      results: [
        { metric: '87%', description: 'Improvement in resource allocation' },
        { metric: '69%', description: 'Reduction in travel costs' },
        { metric: '91%', description: 'Remote collaboration success' },
        { metric: '75%', description: 'Specialist availability increase' }
      ],
      testimonial: {
        text: "AIVO made it possible to provide big-city special education resources to our small rural schools. It's been transformational.",
        author: "Tom Anderson",
        role: "Rural Education Director"
      },
      image: '/images/case-studies/valley-district.jpg',
      tags: ['Rural Education', 'Remote Support', 'Resource Sharing'],
      featured: false
    }
  ];

  const filteredCaseStudies = activeFilter === 'all' 
    ? caseStudies 
    : caseStudies.filter(study => study.category === activeFilter);

  const featuredStudies = caseStudies.filter(study => study.featured);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-blue-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Real Results, Real Impact
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Success <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">Stories</span> That Inspire
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover how schools, districts, and families are transforming special education 
              outcomes with AIVO's innovative learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleContactSales}
                className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Start Your Success Story
              </button>
              <button 
                onClick={handleViewAllResults}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                View All Results
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proven Impact Across Education
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform has delivered measurable results for thousands of students, educators, and families.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: '15,000+', label: 'Students Supported' },
              { icon: School, number: '250+', label: 'Schools & Districts' },
              { icon: TrendingUp, number: '78%', label: 'Average Improvement' },
              { icon: Heart, number: '96%', label: 'Family Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-linear-to-br from-blue-50 to-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dive deep into detailed case studies showcasing transformational outcomes.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {featuredStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{study.title}</h3>
                    <p className="text-blue-600 font-semibold mb-1">{study.subtitle}</p>
                    <p className="text-gray-500 text-sm">{study.location}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{study.students.toLocaleString()} students</div>
                    <div>{study.timeframe}</div>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="mb-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                    <p className="text-gray-600 text-sm">{study.challenge}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                    <p className="text-gray-600 text-sm">{study.solution}</p>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {study.results.map((result, idx) => (
                    <div key={idx} className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{result.metric}</div>
                      <div className="text-xs text-gray-600">{result.description}</div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <Quote className="w-6 h-6 text-blue-600 mb-3" />
                  <p className="text-gray-700 italic mb-4">"{study.testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {study.testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{study.testimonial.author}</div>
                      <div className="text-sm text-gray-500">{study.testimonial.role}</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {study.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Case Studies */}
      <section className="py-20 px-6 bg-linear-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore All Case Studies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of success stories by category.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>

          {/* Case Studies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{study.title}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-1">{study.subtitle}</p>
                    <p className="text-gray-500 text-xs">{study.location}</p>
                  </div>
                  {study.featured && (
                    <div className="bg-linear-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-3">{study.challenge}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{study.results[0].metric}</div>
                      <div className="text-xs text-gray-500">{study.results[0].description}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{study.results[1].metric}</div>
                      <div className="text-xs text-gray-500">{study.results[1].description}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {study.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  Read Full Case Study
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Create Your Own Success Story?
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                Join the growing community of educators and families transforming special 
                education outcomes with AIVO's innovative platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleContactSales}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Schedule a Demo
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  Get Started Today
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

export default CaseStudies;
