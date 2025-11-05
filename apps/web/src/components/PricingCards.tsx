import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    description: 'Essential Tools to Begin Learning Journey with Ease',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Access to Basic Lessons',
      'Core Subject Coverage',
      'Basic Progress Tracking',
      'Community Support',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'Unlock Advanced Features for Faster Progress and Deeper Learning',
    monthlyPrice: 29.99,
    yearlyPrice: 24.99,
    originalPrice: 39.99,
    features: [
      'Access to All Lessons',
      'Personalized AI Tutor',
      'IEP Goal Integration',
      'Progress Tracking (Spider, Graph Charts)',
      'Parent Dashboard Access',
      'Priority Support',
      'Live Chat with Tutors (Limited)',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
    discount: '50% Off',
  },
  {
    name: 'Premium',
    description: 'Essential Tools to Begin Learning Journey with Ease',
    monthlyPrice: 49.99,
    yearlyPrice: 41.99,
    features: [
      'Access to All Lessons and Features',
      'Advanced AI Learning Agent',
      'Multiple Student Profiles',
      'Teacher Collaboration Tools',
      'Unlimited Live Chat with Tutors',
      '24/7 Priority Support',
      'Custom Learning Plans',
    ],
    cta: 'Upgrade to Premium',
    popular: false,
  },
];

export const PricingCards: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const handlePlanClick = (plan: string) => {
    if (plan === 'Free') {
      // Redirect to parent portal for free signup
      window.location.href = 'http://localhost:5174';
    } else {
      // For paid plans, navigate to contact for sales inquiry
      navigate('/contact');
    }
  };

  return (
    <section className="py-24 bg-linear-to-b from-white to-purple-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.span
            className="inline-block text-purple-600 font-semibold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Pricing Plan
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Elevate Your Learning Experience
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Access Advanced Features and Benefits to Master Learning with Precision, 
            Efficiency, and Personalized Support for Every Learner.
          </motion.p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors"
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 bg-purple-600 rounded-full"
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </button>
            <span className={`font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
              <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                (50% Off)
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 ${
                plan.popular 
                  ? 'ring-2 ring-purple-600 shadow-xl scale-105' 
                  : 'border border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.discount && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {plan.discount}
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  {plan.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${plan.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Per user, per month, billed {isYearly ? 'annually' : 'monthly'}
                </p>
              </div>

              <Button
                variant={plan.popular ? "primary" : "secondary"}
                onClick={() => handlePlanClick(plan.name)}
                className={`w-full mb-6 ${
                  plan.popular 
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white' 
                    : ''
                }`}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
