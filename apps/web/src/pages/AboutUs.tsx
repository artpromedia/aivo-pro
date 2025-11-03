import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Target, Users, Shield, Brain, Linkedin } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const handleCareersClick = () => {
    navigate('/company/careers');
  };

  const handlePartnerClick = () => {
    navigate('/contact');
  };

  const founder = {
    name: 'Ofem Ekapong Ofem',
    role: 'Founder & CEO',
    bio: 'Passionate advocate for neurodiverse education and parent dedicated to creating personalized learning solutions for every child.',
    image: '/founder/ofem-ofem.jpg',
    linkedin: 'https://linkedin.com/in/ofem-ofem',
  };

  const advisoryBoard = [
    {
      name: 'Dr. Ike Osuji',
      role: 'Chairman, Advisory Board & Medical Advisor',
      expertise: 'Family Physician',
      bio: 'Chairman of the Advisory Board bringing extensive medical expertise in child development and neurodiversity to guide platform health integration.',
      image: '/advisors/dr-osuji.jpg',
    },
    {
      name: 'Dr. Patrick Ukata',
      role: 'Academic Advisor',
      expertise: 'Professor at Johns Hopkins',
      bio: 'Leading academic voice in educational technology and adaptive learning systems.',
      image: '/advisors/dr-ukata.jpg',
    },
    {
      name: 'Nnamdi Uzokwe',
      role: 'Strategic Advisor',
      expertise: 'Retired Navy Veteran & Med Device Sales Director',
      bio: 'Combines military discipline with medical device industry expertise to drive operational excellence.',
      image: '/advisors/nnamdi-uzokwe.jpg',
    },
    {
      name: 'Edward Hamilton',
      role: 'Special Education Advisor',
      expertise: '9/11 NYPD Veteran & Special Education Advocate',
      bio: 'Dedicated special education expert bringing decades of advocacy and real-world classroom insights.',
      image: '/advisors/edward-hamilton.jpg',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Empathy First',
      description: 'Every feature is designed with neurodiverse learners at the center.',
    },
    {
      icon: Target,
      title: 'Evidence-Based',
      description: 'Grounded in special education best practices and continuous improvement.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built with continuous feedback from families, educators, and therapists.',
    },
    {
      icon: Shield,
      title: 'Accessibility',
      description: 'Committed to making quality education accessible to all learners.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Our Mission: Every Mind Matters
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AIVO was founded by parents and educators who believe that neurodiversity 
              is a strength. We're building the future of personalized education, one 
              learner at a time.
            </p>
          </motion.div>

          {/* Founder Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Founder</h2>
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto"
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-2xl">
                    OO
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold">{founder.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{founder.role}</p>
                  <p className="text-gray-600 mb-4">{founder.bio}</p>
                  <a 
                    href={founder.linkedin}
                    className="inline-flex items-center text-purple-600 hover:underline"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    Connect on LinkedIn →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Advisory Board Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-4">Our Advisory Board</h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              AIVO is guided by distinguished experts in medicine, education, and special needs advocacy
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {advisoryBoard.map((advisor) => (
                <motion.div
                  key={advisor.name}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {advisor.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{advisor.name}</h3>
                      <p className="text-purple-600 font-medium text-sm mb-1">
                        {advisor.role}
                      </p>
                      <p className="text-gray-500 text-xs mb-2">
                        {advisor.expertise}
                      </p>
                      <p className="text-gray-600 text-sm">{advisor.bio}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Values
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div 
                  key={value.title} 
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <value.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Why We Built AIVO */}
          <div className="bg-purple-50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Why We Built AIVO</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
              "Every child deserves an education that adapts to their unique learning style. 
              AIVO was born from the belief that AI can create truly personalized learning 
              experiences that help neurodiverse students thrive. With guidance from our 
              exceptional advisory board of medical professionals, educators, and advocates, 
              we're making this vision a reality."
            </p>
            <p className="font-semibold text-purple-600">
              - Ofem Ekapong Ofem, Founder & CEO
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Join Us in Revolutionizing Education
            </h2>
            <p className="text-purple-100 text-lg max-w-3xl mx-auto mb-8">
              Together, we're building a world where every learner has access to personalized, 
              compassionate education that celebrates neurodiversity and unlocks human potential.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleCareersClick}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Careers at AIVO
              </button>
              <button 
                onClick={handlePartnerClick}
                className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Partner with Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};