import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Sparkles, 
  Target, 
  BookOpen, 
  Music, 
  Palette,
  ArrowRight,
  Star,
  Heart,
  Brain,
  Zap,
  Play
} from 'lucide-react';

export const ForStudents: React.FC = () => {
  const gameFeatures = [
    {
      icon: Gamepad2,
      title: 'Fun Learning Games',
      description: 'Turn learning into an adventure with interactive games designed just for you!',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Trophy,
      title: 'Earn Rewards',
      description: 'Collect badges, unlock achievements, and show off your progress!',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Learn with Friends',
      description: 'Work together on fun projects and help each other learn new things.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Sparkles,
      title: 'Magic Moments',
      description: 'Discover amazing facts and celebrate every step of your learning journey!',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const activities = [
    {
      title: 'Reading Adventures',
      icon: BookOpen,
      description: 'Go on exciting reading journeys with stories that adapt to your interests!',
      emoji: '📚',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      title: 'Math Magic',
      icon: Target,
      description: 'Solve puzzles and play number games that make math super fun!',
      emoji: '🎲',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      title: 'Creative Corner',
      icon: Palette,
      description: 'Draw, create, and express yourself while learning new skills!',
      emoji: '🎨',
      gradient: 'from-pink-400 to-red-500'
    },
    {
      title: 'Music & Movement',
      icon: Music,
      description: 'Dance, sing, and move while practicing important skills!',
      emoji: '🎵',
      gradient: 'from-yellow-400 to-orange-500'
    }
  ];

  const achievements = [
    { name: 'Reading Star', icon: '⭐', description: 'Read 10 stories' },
    { name: 'Math Wizard', icon: '🧙‍♀️', description: 'Complete 20 math games' },
    { name: 'Creative Genius', icon: '🎨', description: 'Finish 5 art projects' },
    { name: 'Helper Hero', icon: '🦸‍♂️', description: 'Help 3 classmates' },
    { name: 'Focus Champion', icon: '🏆', description: 'Stay focused for 30 minutes' },
    { name: 'Problem Solver', icon: '🧩', description: 'Solve 15 puzzles' }
  ];

  const studentTestimonials = [
    {
      name: 'Alex',
      age: 8,
      quote: 'AIVO makes learning so much fun! I love the games and earning stars.',
      avatar: '🦁',
      color: 'from-orange-400 to-red-400'
    },
    {
      name: 'Emma',
      age: 7,
      quote: 'My favorite part is the art activities. I made a rainbow story!',
      avatar: '🦄',
      color: 'from-pink-400 to-purple-400'
    },
    {
      name: 'Sam',
      age: 9,
      quote: 'I used to think math was hard, but now it\'s my favorite subject!',
      avatar: '🚀',
      color: 'from-blue-400 to-green-400'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 overflow-hidden relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-bold mb-6">
                🌟 Just for Students! 🌟
              </span>
              <h1 className="text-6xl font-bold text-gray-900 mb-6">
                Learning is
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500">
                  Super Fun!
                </span>
              </h1>
              <p className="text-2xl text-gray-700 mb-8 font-medium">
                Play games, earn rewards, and become a learning superstar! 🚀
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-8 py-4">
                  Start Playing Now!
                  <Play className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="secondary" className="text-lg px-8 py-4">
                  Watch Fun Videos
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Fun Elements */}
        <motion.div 
          className="absolute top-20 left-10 text-4xl"
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🎈
        </motion.div>
        <motion.div 
          className="absolute top-32 right-16 text-3xl"
          animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌈
        </motion.div>
        <motion.div 
          className="absolute bottom-20 left-20 text-5xl"
          animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          ⭐
        </motion.div>
        <motion.div 
          className="absolute bottom-32 right-10 text-4xl"
          animate={{ y: [8, -8, 8], rotate: [3, -3, 3] }}
          transition={{ duration: 4.5, repeat: Infinity }}
        >
          🦋
        </motion.div>
      </section>

      {/* Game Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Learning with AIVO is Awesome! 🎉
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make learning feel like playing your favorite games!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Activities */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fun Learning Activities 🎪
            </h2>
            <p className="text-xl text-gray-600">
              Choose your adventure and start learning in the most fun way possible!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                className="bg-white rounded-3xl p-8 shadow-lg border-2 border-white hover:shadow-xl transition-all group cursor-pointer"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${activity.gradient} rounded-2xl flex items-center justify-center text-3xl`}>
                    {activity.emoji}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {activity.title}
                    </h3>
                  </div>
                </div>
                <p className="text-lg text-gray-600 mb-6">{activity.description}</p>
                <Button className={`bg-gradient-to-r ${activity.gradient} text-white w-full`}>
                  Start Playing! 🎮
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Collect Amazing Badges! 🏆
            </h2>
            <p className="text-xl text-gray-600">
              Every time you learn something new, you earn a special badge!
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 text-center border-2 border-yellow-200 hover:shadow-lg transition-all cursor-pointer hover:scale-110"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{achievement.name}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Other Kids Say 💬
            </h2>
            <p className="text-xl text-gray-600">
              Listen to what your friends have to say about AIVO!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {studentTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-6`}>
                  {testimonial.avatar}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6 font-medium italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="font-bold text-xl text-gray-900">{testimonial.name}</div>
                <div className="text-purple-600 font-semibold">Age {testimonial.age}</div>
                <div className="flex justify-center gap-1 mt-3">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Learning Adventure? 🚀
            </h2>
            <p className="text-purple-100 text-xl mb-8 max-w-2xl mx-auto font-medium">
              Join millions of kids who are having fun while learning amazing new things every day!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2 shadow-lg">
                🎮 Start Playing Now!
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-3 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                🎬 Watch Fun Videos
                <Play className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
