import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { 
  Download, 
  ExternalLink, 
  Calendar, 
  Users, 
  Award,
  Newspaper,
  Video,
  FileText,
  ArrowRight,
  Camera,
  Mic,
  Globe
} from 'lucide-react';

export const Press: React.FC = () => {
  const pressReleases = [
    {
      title: 'AIVO Launches Revolutionary AI-Powered Learning Platform for Neurodiverse Students',
      date: '2024-10-15',
      excerpt: 'New TypeScript-based platform combines real-time WebSocket communication with adaptive learning algorithms to support children with autism, ADHD, and other learning differences.',
      category: 'Product Launch',
      featured: true
    },
    {
      title: 'AIVO Secures $15M Series A to Expand Personalized Education Technology',
      date: '2024-09-22',
      excerpt: 'Funding will accelerate development of multi-portal architecture and enhance real-time collaboration features for parents, teachers, and students.',
      category: 'Funding',
      featured: true
    },
    {
      title: 'Research Study Shows 67% Improvement in Learning Outcomes with AIVO Platform',
      date: '2024-08-30',
      excerpt: 'Independent study of 5,000+ students demonstrates significant gains in IEP goal achievement using AIVO\'s Express.js-powered analytics engine.',
      category: 'Research',
      featured: false
    },
    {
      title: 'AIVO Partners with Major School Districts to Deploy Enterprise Learning Solutions',
      date: '2024-07-18',
      excerpt: 'Turborepo-based platform architecture enables seamless scaling from hundreds to thousands of concurrent users across multiple educational institutions.',
      category: 'Partnership',
      featured: false
    },
    {
      title: 'AIVO Wins "Innovation in EdTech" Award at National Education Technology Conference',
      date: '2024-06-25',
      excerpt: 'Recognition highlights AIVO\'s groundbreaking use of modern web technologies including React 19 and Vite 7.0 for accessible learning experiences.',
      category: 'Awards',
      featured: false
    }
  ];

  const mediaKit = [
    {
      title: 'Company Logo Package',
      description: 'High-resolution logos, brain icons, and brand guidelines',
      fileSize: '15 MB',
      format: 'ZIP (PNG, SVG, AI)',
      icon: FileText
    },
    {
      title: 'Product Screenshots',
      description: 'Screenshots of all five portals: Parent, Teacher, Student, Assessment, and Web',
      fileSize: '25 MB',
      format: 'ZIP (PNG, JPG)',
      icon: Camera
    },
    {
      title: 'Executive Photos',
      description: 'Professional headshots of leadership team and key personnel',
      fileSize: '8 MB',
      format: 'ZIP (JPG)',
      icon: Users
    },
    {
      title: 'Technology Fact Sheet',
      description: 'Technical specifications: TypeScript 5.6+, React 19, Express.js, WebSocket',
      fileSize: '2 MB',
      format: 'PDF',
      icon: FileText
    }
  ];

  const mediaContacts = [
    {
      name: 'Sarah Chen',
      role: 'Head of Communications',
      email: 'press@aivo.ai',
      phone: '+1 (555) 123-4567',
      expertise: ['Product announcements', 'Technology features', 'Research findings']
    },
    {
      name: 'Michael Rodriguez',
      role: 'VP of Product',
      email: 'product@aivo.ai',
      phone: '+1 (555) 234-5678',
      expertise: ['Platform architecture', 'AI/ML capabilities', 'Technical interviews']
    }
  ];

  const mediaAppearances = [
    {
      outlet: 'TechCrunch',
      title: 'How AIVO Is Using TypeScript and WebSockets to Transform Special Education',
      date: '2024-11-01',
      type: 'Article',
      link: '#'
    },
    {
      outlet: 'Education Week',
      title: 'The Future of Personalized Learning: Real-Time Analytics and Multi-Portal Architecture',
      date: '2024-10-20',
      type: 'Interview',
      link: '#'
    },
    {
      outlet: 'EdTech Hub Podcast',
      title: 'Building Accessible Learning Platforms with Modern JavaScript',
      date: '2024-10-08',
      type: 'Podcast',
      link: '#'
    },
    {
      outlet: 'Special Needs Today',
      title: 'AIVO CEO Discusses Express.js Backend and Real-Time Parent-Teacher Communication',
      date: '2024-09-15',
      type: 'Video Interview',
      link: '#'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '10,000+', description: 'Across all portals' },
    { label: 'School Districts', value: '150+', description: 'Using AIVO platform' },
    { label: 'Learning Sessions', value: '1M+', description: 'Monthly active sessions' },
    { label: 'Platform Uptime', value: '99.9%', description: 'Reliable infrastructure' }
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
              Press & Media
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AIVO in the News
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Learn about AIVO's mission to transform education through innovative technology. 
              Download press materials, read our latest news, and connect with our media team.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Download Press Kit
                <Download className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="secondary">
                Contact Media Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Press Releases */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Press Releases
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Stay updated on AIVO's platform developments, research findings, and technology innovations
            </p>
          </motion.div>

          <div className="space-y-8">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.title}
                className={`rounded-2xl p-8 shadow-lg border ${
                  release.featured 
                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200' 
                    : 'bg-white border-gray-100'
                } hover:shadow-xl transition-shadow`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {release.featured && (
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      )}
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {release.category}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(release.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{release.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{release.excerpt}</p>
                    <div className="flex gap-4">
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Read Full Release
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  <div className="ml-6">
                    <Newspaper className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Media Resources
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Download high-quality assets, product information, and brand guidelines
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {mediaKit.map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {item.fileSize} • {item.format}
                      </div>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Media Coverage */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recent Media Coverage
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              AIVO featured in leading education and technology publications
            </p>
          </motion.div>

          <div className="space-y-6">
            {mediaAppearances.map((appearance, index) => (
              <motion.div
                key={appearance.title}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {appearance.type === 'Podcast' ? (
                        <Mic className="w-5 h-5 text-gray-600" />
                      ) : appearance.type === 'Video Interview' ? (
                        <Video className="w-5 h-5 text-gray-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appearance.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium">{appearance.outlet}</span>
                        <span>•</span>
                        <span>{appearance.type}</span>
                        <span>•</span>
                        <span>{new Date(appearance.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contacts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Media Contacts
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Connect with our media team for interviews, expert commentary, and press inquiries
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {mediaContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-blue-600 font-medium">{contact.role}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mic className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{contact.phone}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Expertise Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {contact.expertise.map((area) => (
                      <span 
                        key={area}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Share Our Story?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              We're always happy to discuss AIVO's technology, research findings, 
              and mission to transform education for neurodiverse learners.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-50">
                Download Press Kit
                <Download className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="ghost" className="text-white border-white hover:bg-white/10">
                <Newspaper className="w-4 h-4 mr-2" />
                Contact Press Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};