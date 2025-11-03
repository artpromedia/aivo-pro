import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PricingCards } from '../components/PricingCards';
import { Check, ArrowRight, Star, Shield, Clock, Users } from 'lucide-react';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/signup');
  };

  const benefits = [
    {
      icon: Shield,
      title: "FERPA & COPPA Compliant",
      description: "Complete data protection for student privacy"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for families"
    },
    {
      icon: Users,
      title: "Family Dashboard",
      description: "Parent and teacher collaboration tools"
    },
    {
      icon: Star,
      title: "IEP Integration",
      description: "Seamless goal tracking and reporting"
    }
  ];

  const testimonial = {
    quote: "AIVO has transformed how my child approaches learning. The personalized approach makes such a difference for children with ADHD.",
    author: "Sarah M.",
    role: "Parent of ADHD student",
    rating: 5
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-purple-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
              Transparent Pricing
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Choose Your Learning Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Every plan includes personalized AI tutoring, progress tracking, and family collaboration tools. 
              Start free and upgrade as your needs grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <PricingCards />

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Every Plan Includes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All AIVO plans come with our core features designed specifically for neurodiverse learners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center bg-linear-to-r from-purple-50 to-pink-50 rounded-3xl p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl font-medium text-gray-900 mb-6">
              "{testimonial.quote}"
            </blockquote>
            <div>
              <p className="font-semibold text-gray-900">{testimonial.author}</p>
              <p className="text-gray-600">{testimonial.role}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Can I switch plans anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Our Free plan lets you experience AIVO's core features. You can always upgrade for advanced features."
              },
              {
                question: "How does billing work?",
                answer: "We bill monthly or annually. Annual plans save 50% and include priority support."
              },
              {
                question: "What if my child has multiple learning differences?",
                answer: "AIVO is designed to support multiple learning differences simultaneously. Our AI adapts to each unique profile."
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-linear-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Learning?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of families already using AIVO to unlock their child's potential.
            </p>
            <button 
              onClick={handleStartJourney}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
