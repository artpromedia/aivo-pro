import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { 
  Users, 
  Heart, 
  Target, 
  MapPin, 
  Clock, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Globe,
  Zap
} from 'lucide-react';

export const Careers: React.FC = () => {
  const navigate = useNavigate();

  const handleViewPositions = () => {
    // Scroll to positions section
    const positionsSection = document.getElementById('open-positions');
    if (positionsSection) {
      positionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnCulture = () => {
    // Scroll to values section
    const valuesSection = document.getElementById('company-values');
    if (valuesSection) {
      valuesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyPosition = (positionTitle: string) => {
    // Navigate to resume submission page with position pre-filled
    navigate(`/submit-resume?position=${encodeURIComponent(positionTitle)}`);
  };

  const handleSendResume = () => {
    navigate('/submit-resume');
  };

  const handleViewAllPositions = () => {
    const positionsSection = document.getElementById('open-positions');
    if (positionsSection) {
      positionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnCultureCTA = () => {
    const valuesSection = document.getElementById('company-values');
    if (valuesSection) {
      valuesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const values = [
    {
      icon: Heart,
      title: 'Impact First',
      description: 'Every decision we make is guided by how it will improve the lives of neurodiverse children and families.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Inclusive by Design',
      description: 'We build inclusive products because we are an inclusive team that celebrates diversity in all its forms.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Target,
      title: 'Excellence & Growth',
      description: 'We pursue excellence while supporting each team member\'s professional and personal growth journey.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Innovation & Curiosity',
      description: 'We approach challenges with curiosity, creativity, and a commitment to pushing boundaries.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const benefits = [
    {
      category: 'Health & Wellness',
      items: [
        'Comprehensive health, dental, and vision insurance',
        'Mental health support and therapy coverage',
        'Wellness stipend for fitness and self-care',
        'Flexible time off and sabbatical opportunities'
      ]
    },
    {
      category: 'Professional Growth',
      items: [
        'Learning & development budget ($3,000/year)',
        'Conference and workshop attendance',
        'Mentorship and career coaching programs',
        'Internal mobility and promotion opportunities'
      ]
    },
    {
      category: 'Work-Life Balance',
      items: [
        'Flexible work arrangements and remote options',
        'Family-friendly policies and parental leave',
        'Home office setup stipend',
        'Team retreats and social events'
      ]
    },
    {
      category: 'Financial Security',
      items: [
        'Competitive salary and equity participation',
        '401(k) matching and financial planning',
        'Life and disability insurance',
        'Relocation assistance when needed'
      ]
    }
  ];

  const openPositions = [
    {
      title: 'Senior Software Engineer - AI/ML',
      department: 'Engineering',
      location: 'Minneapolis, MN / Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead the development of our AI-powered personalization engine that adapts learning experiences for neurodiverse children.',
      requirements: ['Python, TensorFlow, or PyTorch', 'Machine Learning experience', 'Educational technology background preferred']
    },
    {
      title: 'Product Designer - Accessibility',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Design inclusive, accessible user experiences that work beautifully for children with diverse needs and abilities.',
      requirements: ['Figma/Sketch expertise', 'Accessibility design experience', 'User research skills']
    },
    {
      title: 'Education Specialist',
      department: 'Product',
      location: 'Minneapolis, MN / Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Bridge the gap between educational research and product development to ensure our solutions meet real classroom needs.',
      requirements: ['Special education background', 'Curriculum development', 'EdTech experience']
    },
    {
      title: 'Clinical Research Coordinator',
      department: 'Research',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Coordinate clinical studies and research partnerships to validate the effectiveness of our learning interventions.',
      requirements: ['Clinical research experience', 'Data analysis skills', 'IRB protocol knowledge']
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Build and maintain the infrastructure that powers personalized learning for thousands of children worldwide.',
      requirements: ['AWS/Azure experience', 'Docker/Kubernetes', 'CI/CD pipeline management']
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Minneapolis, MN / Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Help schools and districts successfully implement AIVO to maximize positive outcomes for their students.',
      requirements: ['Customer success experience', 'Educational sales background', 'Strong communication skills']
    }
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
              We're Hiring!
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Join Our Mission to 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Transform Education
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Help us build the future of neurodiverse education. Every line of code, 
              every design decision, and every research insight directly impacts 
              children's lives around the world.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleViewPositions}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="secondary"
                onClick={handleLearnCulture}
              >
                Learn Our Culture
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section id="company-values" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These aren't just words on a wall - they guide every decision we make 
              and every interaction we have as a team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits & Perks
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We believe in taking care of our team so they can focus on what they do best - 
              creating amazing products that change lives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((category, index) => (
              <motion.div
                key={category.category}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Join our growing team and help us scale our impact to reach more 
              neurodiverse learners around the world.
            </p>
          </motion.div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="grid lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <div className="flex items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {position.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {position.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {position.experience}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{position.description}</p>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Requirements:</h4>
                          <ul className="flex flex-wrap gap-2">
                            {position.requirements.map((req, i) => (
                              <li key={i} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button 
                      onClick={() => handleApplyPosition(position.title)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full lg:w-auto"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Don't see a perfect fit? We're always interested in hearing from talented people.
            </p>
            <Button 
              variant="secondary"
              onClick={handleSendResume}
            >
              Send Us Your Resume
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
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
              Ready to Make a Difference?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join a team that's passionate about creating technology that unlocks the potential 
              in every neurodiverse learner. Your work here won't just be a job - it'll be a calling.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleViewAllPositions}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                View All Positions
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={handleLearnCultureCTA}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Learn About Our Culture
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
