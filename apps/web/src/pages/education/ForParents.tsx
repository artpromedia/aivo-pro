import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { 
  Heart, 
  Shield, 
  Home, 
  Smartphone, 
  BookOpen, 
  MessageCircle, 
  Calendar, 
  Trophy,
  ArrowRight,
  Star,
  CheckCircle,
  Users,
  Clock
} from 'lucide-react';

export const ForParents: React.FC = () => {
  const parentBenefits = [
    {
      icon: Heart,
      title: 'Peace of Mind',
      description: 'Know your child is receiving personalized, evidence-based support that adapts to their unique needs.',
      highlights: ['Progress transparency', 'Regular updates', 'Professional oversight']
    },
    {
      icon: Home,
      title: 'Home Extension',
      description: 'Seamlessly extend learning from school to home with activities that reinforce classroom progress.',
      highlights: ['Home activities', 'Family engagement', 'Consistent approach']
    },
    {
      icon: Shield,
      title: 'Safe Environment',
      description: 'COPPA and FERPA compliant platform with industry-leading privacy and security measures.',
      highlights: ['Data protection', 'Privacy controls', 'Secure communication']
    },
    {
      icon: MessageCircle,
      title: 'Easy Communication',
      description: 'Stay connected with your child\'s education team through real-time messaging and updates.',
      highlights: ['Direct messaging', 'Progress sharing', 'Team collaboration']
    }
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Parent App',
      description: 'Track progress, communicate with teachers, and access home activities on the go.',
      image: '/features/parent-app-mockup.png'
    },
    {
      icon: Calendar,
      title: 'Progress Tracking',
      description: 'Visual dashboards showing your child\'s learning journey and achievements.',
      image: '/features/progress-dashboard.png'
    },
    {
      icon: BookOpen,
      title: 'Home Activities',
      description: 'Engaging exercises that support classroom learning and skill development.',
      image: '/features/home-activities.png'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Parent',
      childAge: 'Alex, age 8',
      quote: 'AIVO has been a game-changer for our family. Alex looks forward to learning time every day, and I can see real progress.',
      rating: 5,
      image: '/testimonials/maria-rodriguez.jpg'
    },
    {
      name: 'James Thompson',
      role: 'Parent',
      childAge: 'Emma, age 6',
      quote: 'The communication with Emma\'s teachers through AIVO is incredible. I feel so much more involved in her education.',
      rating: 5,
      image: '/testimonials/james-thompson.jpg'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Parent & Pediatrician',
      childAge: 'Rohan, age 7',
      quote: 'As both a parent and healthcare provider, I appreciate how AIVO respects our privacy while delivering results.',
      rating: 5,
      image: '/testimonials/priya-patel.jpg'
    }
  ];

  const faqs = [
    {
      question: 'How does AIVO support my child at home?',
      answer: 'AIVO provides personalized home activities that reinforce school learning, plus family engagement tools and progress tracking to keep you involved in your child\'s educational journey.'
    },
    {
      question: 'Is my child\'s data safe and private?',
      answer: 'Absolutely. AIVO is COPPA and FERPA compliant with industry-leading encryption and privacy controls. You control what information is shared and with whom.'
    },
    {
      question: 'Will this replace my child\'s teachers?',
      answer: 'No, AIVO enhances and supports teachers, never replaces them. It provides tools that help educators be more effective and helps you stay connected with your child\'s learning.'
    },
    {
      question: 'What if my child has multiple diagnoses?',
      answer: 'AIVO is designed to support children with complex needs. Our platform adapts to multiple conditions and works with your entire care team including therapists, specialists, and educators.'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
                For Parents
              </span>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Support Your Child's 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Learning Journey
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Stay connected, track progress, and extend learning from school to home 
                with AIVO's parent-friendly tools and resources.
              </p>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="secondary">
                  Watch Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
                {/* Parent Dashboard Mockup */}
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Alex's Progress</div>
                      <div className="text-sm text-gray-600">This Week</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-600 mb-1" />
                      <div className="text-sm font-medium text-green-800">3 Goals Met</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600 mb-1" />
                      <div className="text-sm font-medium text-blue-800">45 min/day</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Reading</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Math</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className={`w-3 h-3 ${i <= 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-full opacity-20"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-8 h-8 bg-purple-500 rounded-full opacity-30"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Parent Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed with Parents in Mind
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We understand that every parent wants the best for their child. AIVO gives you 
              the tools and insights to be an active partner in your child's education.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {parentBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              From real-time progress updates to home learning activities, 
              AIVO keeps you engaged in your child's educational journey.
            </p>
          </motion.div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-8">{feature.description}</p>
                  <Button variant="secondary">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 aspect-video flex items-center justify-center">
                    <div className="text-6xl">📱</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Parents Are Saying
            </h2>
            <p className="text-gray-600">
              Real stories from real families using AIVO
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-blue-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-600">{testimonial.childAge}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Get answers to common questions about AIVO for families
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
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
              Start Your Child's Learning Journey Today
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of families who are already seeing amazing results. 
              Get started with a free trial and see the difference AIVO can make.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Talk to an Expert
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
