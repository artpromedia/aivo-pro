import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  CheckCircle,
  Download,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

const FERPACompliance: React.FC = () => {
  const handleDownloadPolicy = () => {
    // In a real app, this would download an actual PDF
    window.open('/documents/aivo-ferpa-policy.pdf', '_blank');
  };

  const protections = [
    {
      icon: Lock,
      title: "Data Encryption",
      description: "All student data is encrypted both in transit and at rest using industry-standard AES-256 encryption."
    },
    {
      icon: Eye,
      title: "Access Controls",
      description: "Role-based access ensures only authorized personnel can view educational records."
    },
    {
      icon: Users,
      title: "Parental Rights",
      description: "Parents maintain full control over their child's educational records and can request access at any time."
    },
    {
      icon: FileText,
      title: "Record Accuracy",
      description: "Built-in tools allow parents and students to request corrections to inaccurate records."
    }
  ];

  const rights = [
    {
      title: "Right to Inspect and Review",
      description: "Parents have the right to inspect and review their child's education records maintained by AIVO within 45 days of a request."
    },
    {
      title: "Right to Request Amendment",
      description: "Parents may request that AIVO correct records they believe are inaccurate, misleading, or in violation of privacy rights."
    },
    {
      title: "Right to Control Disclosure",
      description: "Parents have the right to provide written consent before AIVO discloses personally identifiable information."
    },
    {
      title: "Right to File Complaints",
      description: "Parents have the right to file complaints with the Department of Education if they believe AIVO has violated FERPA."
    }
  ];

  const dataTypes = [
    "Student name and contact information",
    "Academic progress and assessment scores",
    "Individualized Education Program (IEP) data",
    "Learning preferences and accessibility needs",
    "Time spent on educational activities",
    "Parent and teacher communications",
    "Behavioral tracking and interventions"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Shield className="w-12 h-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">
                FERPA Compliance
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              AIVO is fully compliant with the Family Educational Rights and Privacy Act (FERPA), 
              ensuring the privacy and security of student educational records at every level.
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5" />
              <span>Certified FERPA Compliant</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is FERPA */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What is FERPA?
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                The Family Educational Rights and Privacy Act (FERPA) is a federal law that protects the 
                privacy of student education records. It applies to all schools and educational technology 
                providers that receive federal funding.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                FERPA gives parents certain rights with respect to their children's education records, 
                including the right to inspect records, request corrections, and control disclosure of 
                personally identifiable information.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Enacted: 1974 • Last Updated: 2012</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key FERPA Principles</h3>
              <div className="space-y-4">
                {[
                  "Transparency in data collection and use",
                  "Parental access to student records",
                  "Consent required for data disclosure",
                  "Right to challenge inaccurate records",
                  "Secure storage and transmission"
                ].map((principle, index) => (
                  <div key={principle} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{principle}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How We Protect Data */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How AIVO Protects Student Data
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We implement comprehensive security measures and privacy protections to ensure 
              full compliance with FERPA requirements.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {protections.map((protection, index) => (
              <motion.div
                key={protection.title}
                className="flex gap-4 p-6 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <protection.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{protection.title}</h3>
                  <p className="text-gray-700 text-sm">{protection.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights Under FERPA */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Your Rights Under FERPA
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              As a parent or eligible student, you have specific rights regarding educational records.
            </p>
          </motion.div>

          <div className="space-y-6">
            {rights.map((right, index) => (
              <motion.div
                key={right.title}
                className="bg-white rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-gray-900 mb-3">{right.title}</h3>
                <p className="text-gray-700">{right.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data We Collect */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Student Data We Collect
              </h2>
              <p className="text-gray-700 mb-8">
                We collect only the minimum data necessary to provide educational services. 
                All data collection is done with appropriate consent and in compliance with FERPA.
              </p>
              <div className="space-y-3">
                {dataTypes.map((type, index) => (
                  <motion.div
                    key={type}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{type}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-blue-50 rounded-2xl p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={ { once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Data Usage Principles</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Educational Purpose Only</p>
                    <p className="text-sm text-gray-600">Data is used solely for educational services</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">No Commercial Use</p>
                    <p className="text-sm text-gray-600">We never use data for advertising or marketing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Storage</p>
                    <p className="text-sm text-gray-600">All data is encrypted and securely stored</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Limited Access</p>
                    <p className="text-sm text-gray-600">Access restricted to authorized personnel only</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact and Resources */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Questions About FERPA Compliance?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our privacy team is here to help with any questions about FERPA compliance 
              or your data rights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy Officer</h3>
              <p className="text-gray-600 mb-4">
                Contact our designated privacy officer for FERPA-related inquiries
              </p>
              <a
                href="mailto:privacy@aivo.com"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                privacy@aivo.com
              </a>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Hotline</h3>
              <p className="text-gray-600 mb-4">
                Speak directly with our compliance team
              </p>
              <a
                href="tel:+1-555-AIVO-123"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                +1 (555) AIVO-123
              </a>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button 
              onClick={handleDownloadPolicy}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download FERPA Policy Document
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FERPACompliance;
