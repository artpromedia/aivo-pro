import React from 'react';
import { motion } from 'framer-motion';
import { 
  Baby, 
  Shield, 
  Heart, 
  Lock, 
  UserCheck, 
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Mail,
  Phone
} from 'lucide-react';

const COPPACompliance: React.FC = () => {
  const handleDownloadPolicy = () => {
    // In a real app, this would download an actual PDF
    window.open('/documents/aivo-coppa-policy.pdf', '_blank');
  };

  const protections = [
    {
      icon: UserCheck,
      title: "Parental Consent",
      description: "We obtain verifiable parental consent before collecting any personal information from children under 13."
    },
    {
      icon: Lock,
      title: "Limited Data Collection",
      description: "We collect only the minimum information necessary to provide educational services to your child."
    },
    {
      icon: Heart,
      title: "No Behavioral Advertising",
      description: "We never use children's personal information for targeted advertising or behavioral profiling."
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "All children's data is encrypted and stored with the highest security standards available."
    }
  ];

  const parentalRights = [
    {
      title: "Review Your Child's Information",
      description: "Request to see the personal information we have collected from your child",
      action: "Access anytime through your parent dashboard"
    },
    {
      title: "Delete Your Child's Information",
      description: "Request deletion of your child's personal information from our systems",
      action: "Contact support for immediate deletion"
    },
    {
      title: "Stop Further Collection",
      description: "Refuse to permit further collection or use of your child's information",
      action: "Manage preferences in account settings"
    },
    {
      title: "Correct Information",
      description: "Request correction of any inaccurate information about your child",
      action: "Submit correction requests via support"
    }
  ];

  const dataTypes = [
    {
      category: "Educational Data",
      items: [
        "Learning progress and assessment scores",
        "Time spent on educational activities", 
        "Learning preferences and accessibility needs",
        "Academic goals and achievements"
      ]
    },
    {
      category: "Account Information",
      items: [
        "Child's first name (no last name stored)",
        "Age or grade level",
        "Parent-provided profile information",
        "Account creation date"
      ]
    },
    {
      category: "Technical Data",
      items: [
        "Device type and operating system",
        "Session duration and frequency",
        "App usage patterns for improvement",
        "Crash reports and error logs"
      ]
    }
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
              <Baby className="w-12 h-12 text-pink-600" />
              <h1 className="text-5xl font-bold text-gray-900">
                COPPA Compliance
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              AIVO is fully compliant with the Children's Online Privacy Protection Act (COPPA), 
              ensuring the safety and privacy of children under 13 years old.
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5" />
              <span>Certified COPPA Compliant Since 2023</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is COPPA */}
      <section className="py-20 px-6 bg-pink-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What is COPPA?
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                The Children's Online Privacy Protection Act (COPPA) is a federal law designed to 
                protect the privacy of children under 13 years old. It requires websites and online 
                services to obtain verifiable parental consent before collecting personal information 
                from children.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                COPPA gives parents control over what information is collected from their children 
                online and how that information is used, ensuring a safer digital environment for young learners.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Enacted: April 21, 2000 • Updated: July 1, 2013</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Age Verification Process</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">
                    1
                  </div>
                  <span className="text-gray-700">Parent creates account and verifies identity</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">
                    2
                  </div>
                  <span className="text-gray-700">Child's age is verified during setup</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">
                    3
                  </div>
                  <span className="text-gray-700">COPPA protections automatically applied</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">
                    4
                  </div>
                  <span className="text-gray-700">Parent maintains full control over data</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How We Protect Children */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How AIVO Protects Children
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We go above and beyond COPPA requirements to ensure the highest level of privacy 
              and safety for children using our platform.
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
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
                  <protection.icon className="w-6 h-6 text-pink-600" />
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

      {/* Your Parental Rights */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Your Rights as a Parent
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              COPPA gives you specific rights regarding your child's personal information. 
              Here's how you can exercise these rights with AIVO.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {parentalRights.map((right, index) => (
              <motion.div
                key={right.title}
                className="bg-white rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-gray-900 mb-3">{right.title}</h3>
                <p className="text-gray-700 mb-4">{right.description}</p>
                <div className="flex items-center gap-2 text-pink-600 font-medium text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{right.action}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data We Collect */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What Information We Collect
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We collect only the minimum information necessary to provide educational services. 
              All collection is done with your explicit consent.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {dataTypes.map((category, index) => (
              <motion.div
                key={category.category}
                className="bg-gray-50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-gray-900 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 shrink-0"></div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20 px-6 bg-amber-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-amber-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Important for Parents
                </h3>
                <p className="text-gray-700 mb-4">
                  If your child is under 13 years old, federal law requires that we obtain your 
                  consent before collecting, using, or disclosing personal information from your child. 
                  We take this responsibility seriously and have implemented robust verification processes.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Verified parental consent required</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">No advertising or marketing to children</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Educational use only</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Data deletion available anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Questions About COPPA or Your Child's Privacy?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our dedicated privacy team is available to address any concerns about your child's 
              privacy and our COPPA compliance practices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-pink-50 rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Mail className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy Team</h3>
              <p className="text-gray-600 mb-4">
                Contact our privacy specialists for COPPA-related questions
              </p>
              <a
                href="mailto:privacy@aivo.com"
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                privacy@aivo.com
              </a>
              <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
            </motion.div>

            <motion.div
              className="bg-pink-50 rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Phone className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Parent Hotline</h3>
              <p className="text-gray-600 mb-4">
                Speak directly with our COPPA compliance officer
              </p>
              <a
                href="tel:+1-555-AIVO-KIDS"
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                +1 (555) AIVO-KIDS
              </a>
              <p className="text-sm text-gray-500 mt-2">Available Monday-Friday, 9 AM - 6 PM EST</p>
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
              className="inline-flex items-center gap-2 bg-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-pink-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Download Full COPPA Policy
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default COPPACompliance;