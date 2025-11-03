import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Target,
  ArrowRight,
  Download,
  ExternalLink,
  BarChart3,
  DollarSign,
  Globe,
  Zap,
  Shield,
  Calendar,
  FileText,
  Mail,
  Building,
  Lightbulb,
  Star,
  Heart,
  BookOpen,
  CheckCircle,
  Eye
} from 'lucide-react';

const Investors: React.FC = () => {
  const navigate = useNavigate();

  const handleContactInvestors = () => {
    navigate('/contact?subject=investor-relations');
  };

  const handleDownloadReport = (reportType: string) => {
    window.open(`/investor-documents/${reportType}`, '_blank');
  };

  const handleViewPressReleases = () => {
    navigate('/company/press');
  };

  const keyMetrics = [
    {
      title: "Market Opportunity",
      value: "$13.1B",
      description: "Global special education software market size by 2030",
      trend: "+12.8% CAGR",
      positive: true
    },
    {
      title: "Students Served",
      value: "15,000+",
      description: "Students across 250+ schools and districts",
      trend: "+340% YoY",
      positive: true
    },
    {
      title: "Revenue Growth",
      value: "285%",
      description: "Year-over-year revenue growth in 2024",
      trend: "Q4 2024",
      positive: true
    },
    {
      title: "Customer Retention",
      value: "96%",
      description: "Annual customer retention rate",
      trend: "+4% vs 2023",
      positive: true
    }
  ];

  const milestones = [
    {
      date: "Q4 2024",
      title: "Series A Funding Completed",
      description: "$15M Series A led by Education Technology Ventures",
      type: "funding"
    },
    {
      date: "Q3 2024",
      title: "Major District Partnerships",
      description: "Secured partnerships with 5 major school districts (50,000+ students)",
      type: "growth"
    },
    {
      date: "Q2 2024",
      title: "AI Platform Launch",
      description: "Launched next-generation AI-powered learning platform",
      type: "product"
    },
    {
      date: "Q1 2024",
      title: "Compliance Certification",
      description: "Achieved SOC 2 Type II and enhanced FERPA/COPPA compliance",
      type: "compliance"
    },
    {
      date: "Q4 2023",
      title: "Seed Round Closed",
      description: "$5M seed funding from prominent education investors",
      type: "funding"
    },
    {
      date: "Q2 2023",
      title: "Company Founded",
      description: "AIVO founded in Minneapolis with mission to transform special education",
      type: "founding"
    }
  ];

  const leadership = [
    {
      name: "Dr. Sarah Martinez",
      role: "CEO & Co-Founder",
      background: "Former Special Education Director, 15+ years experience",
      education: "PhD in Special Education, University of Minnesota"
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      background: "Former Google AI researcher, MIT alumnus",
      education: "MS Computer Science, MIT"
    },
    {
      name: "Jennifer Walsh",
      role: "Chief Product Officer",
      background: "Former Pearson Education product leader",
      education: "MBA Stanford, BS Education"
    },
    {
      name: "Dr. Robert Kim",
      role: "Head of Research",
      background: "Educational psychology researcher, published author",
      education: "PhD Educational Psychology, Stanford"
    }
  ];

  const investors = [
    {
      name: "Education Technology Ventures",
      type: "Lead Investor",
      round: "Series A",
      description: "Leading EdTech investment firm with $500M+ AUM"
    },
    {
      name: "Impact Education Partners",
      type: "Strategic Investor",
      round: "Series A",
      description: "Mission-driven fund focused on educational equity"
    },
    {
      name: "Minneapolis Venture Fund",
      type: "Regional Investor", 
      round: "Seed",
      description: "Premier Midwest venture capital firm"
    },
    {
      name: "Ed Tech Angels",
      type: "Angel Group",
      round: "Seed",
      description: "Network of education technology entrepreneurs"
    }
  ];

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'funding': return DollarSign;
      case 'growth': return TrendingUp;
      case 'product': return Zap;
      case 'compliance': return Shield;
      case 'founding': return Lightbulb;
      default: return CheckCircle;
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'funding': return 'bg-green-100 text-green-700';
      case 'growth': return 'bg-blue-100 text-blue-700';
      case 'product': return 'bg-purple-100 text-purple-700';
      case 'compliance': return 'bg-orange-100 text-orange-700';
      case 'founding': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-emerald-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Investor Relations
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforming <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-blue-600">Special Education</span> at Scale
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              AIVO is revolutionizing special education through AI-powered personalized learning, 
              serving 15,000+ students and growing rapidly across North America.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleContactInvestors}
                className="bg-linear-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Investor Relations
              </button>
              <button 
                onClick={() => handleDownloadReport('investor-deck')}
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-colors inline-flex items-center gap-2"
              >
                Download Investor Deck
                <Download className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Performance Metrics
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Strong fundamentals driving sustainable growth in the rapidly expanding special education technology market.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-linear-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">{metric.title}</div>
                <div className="text-sm text-gray-600 mb-3">{metric.description}</div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  metric.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {metric.trend}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Massive Market Opportunity
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 rounded-lg p-3">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Market Size</h3>
                    <p className="text-gray-600">The global special education software market is projected to reach $13.1B by 2030, growing at 12.8% CAGR.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Underserved Population</h3>
                    <p className="text-gray-600">7.3 million students in the US receive special education services, with growing demand for personalized technology solutions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Technology Gap</h3>
                    <p className="text-gray-600">Limited AI-powered solutions exist specifically for special education, creating significant opportunity for market leadership.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-emerald-50 to-blue-50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Competitive Advantages</h3>
              <div className="space-y-4">
                {[
                  "First-mover advantage in AI-powered special education",
                  "Deep domain expertise and educator-led development",
                  "Comprehensive compliance with FERPA/COPPA regulations", 
                  "Proven results with measurable student outcomes",
                  "Strong network effects and high switching costs",
                  "Scalable SaaS platform with high gross margins"
                ].map((advantage, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-gray-700">{advantage}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Milestones */}
      <section className="py-20 px-6 bg-linear-to-r from-emerald-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Company Milestones
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key achievements demonstrating consistent execution and growth trajectory.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gray-300"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMilestoneColor(milestone.type)}`}>
                          {milestone.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getMilestoneColor(milestone.type)}`}>
                      {React.createElement(getMilestoneIcon(milestone.type), { className: "w-6 h-6" })}
                    </div>
                  </div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced leaders combining deep education expertise with proven technology execution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {leader.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                    <p className="text-emerald-600 font-semibold mb-2">{leader.role}</p>
                    <p className="text-gray-600 text-sm mb-2">{leader.background}</p>
                    <p className="text-gray-500 text-sm">{leader.education}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Information */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Investors
              </h2>
              <p className="text-gray-600 mb-8">
                Backed by leading education technology investors who share our vision for transforming special education.
              </p>
              
              <div className="space-y-6">
                {investors.map((investor, index) => (
                  <div key={index} className="bg-linear-to-r from-emerald-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{investor.name}</h3>
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                        {investor.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{investor.description}</p>
                    <p className="text-gray-500 text-xs">Participated in {investor.round}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Investor Resources
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Investor Deck", description: "Company overview and growth strategy", type: "PDF" },
                  { title: "Financial Summary", description: "Key financial metrics and projections", type: "PDF" },
                  { title: "Market Analysis", description: "Comprehensive market opportunity report", type: "PDF" },
                  { title: "Product Demo", description: "Interactive platform demonstration", type: "Video" },
                  { title: "Press Releases", description: "Latest company announcements", type: "Web" },
                  { title: "Quarterly Updates", description: "Regular investor communications", type: "PDF" }
                ].map((resource, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                        <p className="text-gray-600 text-sm">{resource.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {resource.type}
                        </span>
                        <button 
                          onClick={() => resource.type === 'Web' ? handleViewPressReleases() : handleDownloadReport(resource.title.toLowerCase().replace(' ', '-'))}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          {resource.type === 'Web' ? <ExternalLink className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-linear-to-r from-emerald-600 to-blue-600 rounded-3xl p-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Building className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Join Us in Transforming Education
              </h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">
                Partner with AIVO as we revolutionize special education and create lasting impact 
                for millions of students worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleContactInvestors}
                  className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Contact Investor Relations
                </button>
                <button 
                  onClick={() => handleDownloadReport('executive-summary')}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  Download Executive Summary
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Investors;
