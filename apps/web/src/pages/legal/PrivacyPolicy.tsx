import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, Bell, FileText } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: [
        'Educational progress and performance data',
        'IEP/504 plan information (with consent)',
        'Device usage patterns for learning optimization',
        'Communication between students, parents, and educators'
      ]
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: [
        'End-to-end encryption for all sensitive data',
        'FERPA and COPPA compliant data handling',
        'Regular security audits and penetration testing',
        'Data minimization - we only collect what\'s necessary'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'Personalize learning experiences with AI',
        'Generate progress reports for educators and families',
        'Improve our educational algorithms',
        'Provide customer support and technical assistance'
      ]
    },
    {
      icon: Database,
      title: 'Data Retention',
      content: [
        'Student data retained only as long as educationally necessary',
        'Parents can request data deletion at any time',
        'Automatic deletion upon graduation or withdrawal',
        'Backup data permanently deleted within 90 days'
      ]
    }
  ];

  const lastUpdated = 'November 1, 2025';

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Your privacy and your child's educational data security are our top priorities. 
              We're committed to transparency in how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 shrink-0"></div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Policy */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Privacy Policy</h2>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4">1. Introduction</h3>
                <p className="text-gray-700 mb-4">
                  AIVO Learning ("we," "our," or "us") is committed to protecting the privacy of students, 
                  parents, and educators who use our platform. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our educational services.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4">2. FERPA Compliance</h3>
                <p className="text-gray-700 mb-4">
                  We comply fully with the Family Educational Rights and Privacy Act (FERPA). Educational 
                  records are shared only with authorized school personnel and parents/guardians. We act 
                  as a school official with legitimate educational interests when processing student data.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4">3. COPPA Compliance</h3>
                <p className="text-gray-700 mb-4">
                  For students under 13, we comply with the Children's Online Privacy Protection Act (COPPA). 
                  We collect only minimal information necessary for educational purposes and do not use 
                  student data for advertising or commercial purposes.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold mb-4">4. Your Rights</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Access your child's educational data at any time</li>
                  <li>• Request correction of inaccurate information</li>
                  <li>• Request deletion of your child's data</li>
                  <li>• Receive data in a portable format</li>
                  <li>• Opt out of data processing for non-educational purposes</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">5. Contact Us</h3>
                <p className="text-gray-700 mb-4">
                  For questions about this Privacy Policy or to exercise your privacy rights:
                </p>
                <div className="flex flex-col gap-2 text-gray-700">
                  <span>Email: privacy@aivolearning.com</span>
                  <span>Phone: 1-800-AIVO-PRIVACY</span>
                  <span>Mail: AIVO Learning Privacy Office, 123 Education St, San Francisco, CA 94105</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Privacy & Security Certifications</h2>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-3 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">FERPA Compliant</div>
                  <div className="text-sm text-gray-600">Educational Records Protected</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">COPPA Certified</div>
                  <div className="text-sm text-gray-600">Child Privacy Protected</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <Lock className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-900">SOC 2 Type II</div>
                  <div className="text-sm text-gray-600">Security Audited</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
