import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Users, AlertCircle } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  const keyTerms = [
    {
      icon: Users,
      title: 'User Accounts',
      description: 'Parents and educators create accounts to manage student access and progress.'
    },
    {
      icon: FileText,
      title: 'Educational Use',
      description: 'AIVO is designed exclusively for educational purposes and academic support.'
    },
    {
      icon: Scale,
      title: 'Data Rights',
      description: 'Students and families retain all rights to their educational data and progress.'
    },
    {
      icon: AlertCircle,
      title: 'Acceptable Use',
      description: 'Users must follow our community guidelines and use AIVO responsibly.'
    }
  ];

  const lastUpdated = 'November 1, 2025';

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-linear-to-b from-purple-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              These terms govern your use of AIVO Learning platform and establish 
              the rights and responsibilities of all users in our educational community.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Terms Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Key Terms Overview
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {keyTerms.map((term, index) => (
              <motion.div
                key={term.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <term.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{term.title}</h3>
                </div>
                <p className="text-gray-600">{term.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Terms of Service</h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h3>
                <p className="text-gray-700 mb-4">
                  By accessing or using AIVO Learning services, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access the service.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">2. Educational Purpose</h3>
                <p className="text-gray-700 mb-4">
                  AIVO Learning is designed exclusively for educational purposes. The platform provides 
                  personalized learning experiences for neurodiverse students in K-12 and college settings.
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• Use AIVO only for legitimate educational activities</li>
                  <li>• Respect intellectual property and copyright laws</li>
                  <li>• Follow your school's technology and acceptable use policies</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">3. User Accounts and Responsibilities</h3>
                <p className="text-gray-700 mb-4">
                  Account holders are responsible for maintaining the security of their accounts and 
                  all activities that occur under their account.
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• Provide accurate and complete registration information</li>
                  <li>• Maintain the security of your password and account</li>
                  <li>• Notify us immediately of any unauthorized use</li>
                  <li>• Parents/guardians control student accounts for users under 18</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">4. Privacy and Data Protection</h3>
                <p className="text-gray-700 mb-4">
                  We are committed to protecting your privacy and comply with FERPA, COPPA, and other 
                  applicable privacy laws. See our Privacy Policy for detailed information.
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• Student educational records are protected under FERPA</li>
                  <li>• We do not sell or share personal data with third parties</li>
                  <li>• Data is used only to improve educational outcomes</li>
                  <li>• Parents can access and delete their child's data at any time</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">5. Prohibited Activities</h3>
                <p className="text-gray-700 mb-4">
                  The following activities are strictly prohibited on AIVO Learning:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• Harassment, bullying, or inappropriate communication</li>
                  <li>• Sharing account credentials with unauthorized users</li>
                  <li>• Attempting to access other users' accounts or data</li>
                  <li>• Using the platform for non-educational purposes</li>
                  <li>• Reverse engineering or attempting to hack the system</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">6. Intellectual Property</h3>
                <p className="text-gray-700 mb-4">
                  AIVO Learning respects intellectual property rights and expects users to do the same.
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• AIVO platform and content are protected by copyright and trademark laws</li>
                  <li>• Users retain rights to their original work and submissions</li>
                  <li>• Report copyright infringement to legal@aivolearning.com</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">7. Service Availability</h3>
                <p className="text-gray-700 mb-4">
                  We strive to provide reliable service but cannot guarantee 100% uptime.
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• Scheduled maintenance will be announced in advance</li>
                  <li>• We are not liable for service interruptions beyond our control</li>
                  <li>• Offline features available on AIVO Pad devices</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">8. Termination</h3>
                <p className="text-gray-700 mb-4">
                  Either party may terminate access to AIVO Learning services at any time.
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• Users can delete their accounts at any time</li>
                  <li>• We may suspend accounts for violations of these terms</li>
                  <li>• Educational data will be deleted according to our retention policy</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">9. Contact Information</h3>
                <p className="text-gray-700 mb-4">
                  For questions about these Terms of Service:
                </p>
                <div className="flex flex-col gap-2 text-gray-700">
                  <span>Email: legal@aivolearning.com</span>
                  <span>Phone: 1-800-AIVO-LEGAL</span>
                  <span>Mail: AIVO Learning Legal Department, 123 Education St, San Francisco, CA 94105</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
