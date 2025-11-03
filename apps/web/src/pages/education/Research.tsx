import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Users, Shield, BookOpen, Award, Lightbulb, ExternalLink } from 'lucide-react';

const Research: React.FC = () => {
  const researchAreas = [
    {
      icon: Brain,
      title: "Adaptive Learning Systems",
      description: "Developing AI-powered systems that adjust to each child's learning pace and style",
      status: "In Development"
    },
    {
      icon: Target,
      title: "Learning Analytics",
      description: "Creating insights from learning data to improve educational outcomes",
      status: "Research Phase"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Studying how children learn together in digital environments",
      status: "Planning"
    },
    {
      icon: Shield,
      title: "Child Safety & Privacy",
      description: "Ensuring secure and privacy-compliant learning environments for children",
      status: "Ongoing"
    }
  ];

  const futureGoals = [
    {
      icon: BookOpen,
      title: "Evidence-Based Design",
      description: "We aim to conduct rigorous studies to validate our learning methodologies and ensure our platform is backed by solid research."
    },
    {
      icon: Award,
      title: "Academic Partnerships",
      description: "We are seeking partnerships with educational institutions and research organizations to advance our understanding of effective digital learning."
    },
    {
      icon: Lightbulb,
      title: "Innovation Research",
      description: "Exploring cutting-edge technologies in AI and machine learning to enhance personalized education experiences."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-20">
      {/* Hero Section */}
      <motion.section 
        className="container mx-auto px-6 text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Research & Development
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          At AIVO, we believe in building educational technology that is grounded in research and evidence. 
          Our commitment to continuous learning drives our mission to create effective, safe, and innovative learning experiences for children.
        </p>
      </motion.section>

      {/* Current Research Areas */}
      <motion.section 
        className="container mx-auto px-6 mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Current Research Areas
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {researchAreas.map((area, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-2xl mr-4">
                  <area.icon className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{area.title}</h3>
                  <span className="text-sm text-purple-600 font-medium">{area.status}</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Research Philosophy */}
      <motion.section 
        className="container mx-auto px-6 mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="bg-white rounded-3xl p-12 shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Our Research Philosophy
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              We believe that effective educational technology must be built on a foundation of rigorous research 
              and evidence-based practices. Our approach emphasizes:
            </p>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <div className="bg-purple-100 rounded-full p-1 mr-3 mt-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span><strong>Child-Centered Design:</strong> Placing the needs, safety, and developmental stages of children at the center of our research</span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 rounded-full p-1 mr-3 mt-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span><strong>Ethical Standards:</strong> Maintaining the highest ethical standards in all research involving children and their data</span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 rounded-full p-1 mr-3 mt-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span><strong>Open Collaboration:</strong> Working with educators, researchers, and families to ensure our solutions meet real needs</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Future Goals */}
      <motion.section 
        className="container mx-auto px-6 mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Research Goals & Aspirations
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {futureGoals.map((goal, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 text-center"
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-md">
                <goal.icon className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{goal.title}</h3>
              <p className="text-gray-600 leading-relaxed">{goal.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Development Status */}
      <motion.section 
        className="container mx-auto px-6 mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Platform Development Status</h2>
          <p className="text-xl mb-8 leading-relaxed">
            AIVO is currently in active development. We are building our platform with a strong focus on 
            research-backed methodologies and are committed to transparency about our progress and findings.
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Current Phase: MVP Development & Research Planning</h3>
            <p className="text-white/90">
              We are developing our minimum viable product while simultaneously planning comprehensive research 
              studies to validate our approach and ensure the effectiveness of our learning platform.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Collaboration Invitation */}
      <motion.section 
        className="container mx-auto px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Interested in Collaboration?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We welcome partnerships with educational institutions, researchers, and organizations 
            that share our commitment to evidence-based educational technology.
          </p>
          <motion.button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get in Touch</span>
            <ExternalLink className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default Research;