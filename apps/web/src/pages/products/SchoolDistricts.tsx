import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  School, 
  Users, 
  BarChart3, 
  Shield, 
  Clock, 
  CheckCircle,
  Zap,
  Globe,
  BookOpen,
  Award,
  ArrowRight,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const SchoolDistricts: React.FC = () => {
  const navigate = useNavigate();

  const handleScheduleDemo = () => {
    navigate('/schedule-demo');
  };

  const handleDownloadGuide = () => {
    window.open('/documents/aivo-district-guide.pdf', '_blank');
  };

  const handleRequestPricing = () => {
    navigate('/contact?subject=district-pricing');
  };

  const benefits = [
    {
      icon: Users,
      title: "District-Wide Management",
      description: "Centralized administration for thousands of students across multiple schools with role-based access controls."
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Real-time district-level insights, progress tracking, and performance metrics to inform educational decisions."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "FERPA and COPPA compliant with advanced security features including SSO, audit logs, and data encryption."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Dedicated district support team with priority response times and comprehensive training resources."
    }
  ];

  const features = [
    {
      category: "Administration",
      items: [
        "Bulk student enrollment and management",
        "Automated IEP data integration", 
        "Custom user roles and permissions",
        "District-wide policy enforcement",
        "Compliance monitoring and reporting"
      ]
    },
    {
      category: "Learning Management", 
      items: [
        "Curriculum alignment tools",
        "Standards-based assessment tracking",
        "Individualized learning pathways",
        "Progress monitoring dashboards",
        "Parent-teacher communication tools"
      ]
    },
    {
      category: "Data & Analytics",
      items: [
        "Real-time performance analytics",
        "Predictive learning insights",
        "Custom reporting tools",
        "Data export and API access",
        "Integration with existing SIS systems"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "AIVO has transformed how we serve our special education students. The district-wide visibility and personalized learning paths have improved outcomes across all our schools.",
      author: "Dr. Sarah Mitchell",
      role: "Superintendent",
      district: "Springfield Public Schools",
      students: "25,000 students"
    },
    {
      quote: "The implementation was seamless and the support team understood our unique district needs. We're seeing measurable improvements in student engagement and progress.",
      author: "Michael Chen",
      role: "Director of Special Education",
      district: "Metro Valley School District", 
      students: "18,500 students"
    }
  ];

  const pricingTiers = [
    {
      name: "District Starter",
      studentRange: "1,000 - 5,000 students",
      price: "Contact for pricing",
      features: [
        "Core learning platform",
        "Basic analytics dashboard",
        "Standard support",
        "IEP integration",
        "Parent portal access"
      ]
    },
    {
      name: "District Professional", 
      studentRange: "5,001 - 15,000 students",
      price: "Contact for pricing",
      popular: true,
      features: [
        "Advanced analytics suite",
        "Custom reporting tools",
        "Priority support",
        "API access",
        "Professional development",
        "Dedicated success manager"
      ]
    },
    {
      name: "District Enterprise",
      studentRange: "15,000+ students", 
      price: "Contact for pricing",
      features: [
        "Full platform access",
        "Custom integrations",
        "White-label options",
        "24/7 premium support", 
        "On-site training",
        "Data warehouse access",
        "Custom development"
      ]
    }
  ];

  const implementation = [
    {
      phase: "Discovery & Planning",
      duration: "2-4 weeks",
      description: "Assess district needs, existing systems, and develop implementation roadmap"
    },
    {
      phase: "System Setup", 
      duration: "3-6 weeks",
      description: "Configure platform, integrate with SIS, migrate data, and set up user accounts"
    },
    {
      phase: "Training & Rollout",
      duration: "4-8 weeks", 
      description: "Comprehensive staff training, pilot programs, and phased district-wide rollout"
    },
    {
      phase: "Ongoing Support",
      duration: "Continuous",
      description: "24/7 support, regular check-ins, feature updates, and success optimization"
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
              <School className="w-12 h-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">
                School Districts
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Empower your entire district with AIVO's comprehensive learning platform designed 
              specifically for special education at scale. Serving over 500,000 students nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleScheduleDemo}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Schedule District Demo
              </button>
              <button 
                onClick={handleDownloadGuide}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Download District Guide
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why School Districts Choose AIVO
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Trusted by leading school districts nationwide to deliver personalized learning 
              experiences and improve outcomes for students with special needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="flex gap-4 p-6 bg-white rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-700 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Comprehensive District Features
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Everything your district needs to manage, monitor, and improve special education 
              services across all schools and grade levels.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((category, index) => (
              <motion.div
                key={category.category}
                className="bg-gray-50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-gray-900 mb-6 text-lg">{category.category}</h3>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              District Success Stories
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              See how school districts are transforming special education with AIVO's platform.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                className="bg-white rounded-xl p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.district}</p>
                    <p className="text-xs text-gray-500">{testimonial.students}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* District Pricing */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              District Pricing Plans
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options designed to scale with your district size and needs. 
              All plans include implementation support and ongoing training.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                className={`rounded-2xl p-8 ${tier.popular ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {tier.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tier.studentRange}</p>
                  <p className="text-2xl font-bold text-blue-600">{tier.price}</p>
                </div>
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  tier.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}>
                  Contact Sales
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Implementation Process
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our proven implementation methodology ensures a smooth transition and rapid 
              adoption across your entire district.
            </p>
          </motion.div>

          <div className="space-y-6">
            {implementation.map((phase, index) => (
              <motion.div
                key={phase.phase}
                className="bg-white rounded-xl p-6 flex items-center gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{phase.phase}</h3>
                    <span className="text-sm text-gray-500">{phase.duration}</span>
                  </div>
                  <p className="text-gray-700">{phase.description}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your District?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join the hundreds of school districts already using AIVO to improve 
              special education outcomes. Schedule a personalized demo today.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 justify-center">
                <Phone className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">+1 (555) AIVO-EDU</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Mail className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">districts@aivo.com</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Calendar className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">Schedule Demo</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleScheduleDemo}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Schedule District Demo
              </button>
              <button 
                onClick={handleRequestPricing}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Request Pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SchoolDistricts;
