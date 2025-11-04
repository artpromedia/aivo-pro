import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  BookOpen,
  Puzzle,
  Music,
  Calculator,
  Globe,
  Palette,
  Heart,
  Eye,
  Users,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  Play,
  BarChart3
} from 'lucide-react';
import { Button } from '@aivo/ui';

interface BrainNode {
  id: string;
  label: string;
  category: 'strength' | 'developing' | 'challenge';
  score: number;
  icon: React.ElementType;
  connections: string[];
  description: string;
  recentChange: number;
}

interface AIInsight {
  type: 'strength' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  action?: string;
}

export const VirtualBrain: React.FC = () => {
  const { childId } = useParams();
  const [selectedNode, setSelectedNode] = useState<BrainNode | null>(null);
  const [viewMode, setViewMode] = useState<'cognitive' | 'academic' | 'social'>('cognitive');

  // Mock child data - would be fetched based on childId
  const childName = "Emma";

  const brainNodes: BrainNode[] = [
    {
      id: 'math',
      label: 'Mathematics',
      category: 'strength',
      score: 85,
      icon: Calculator,
      connections: ['logic', 'spatial'],
      description: 'Shows exceptional pattern recognition and problem-solving skills',
      recentChange: 8,
    },
    {
      id: 'reading',
      label: 'Reading',
      category: 'developing',
      score: 72,
      icon: BookOpen,
      connections: ['language', 'comprehension'],
      description: 'Good foundational skills, working on reading fluency',
      recentChange: 5,
    },
    {
      id: 'creative',
      label: 'Creativity',
      category: 'strength',
      score: 92,
      icon: Palette,
      connections: ['visual', 'imagination'],
      description: 'Outstanding creative thinking and artistic expression',
      recentChange: 3,
    },
    {
      id: 'social',
      label: 'Social Skills',
      category: 'challenge',
      score: 65,
      icon: Heart,
      connections: ['communication', 'empathy'],
      description: 'Working on peer interaction and emotional regulation',
      recentChange: 7,
    },
    {
      id: 'music',
      label: 'Music & Rhythm',
      category: 'strength',
      score: 88,
      icon: Music,
      connections: ['pattern', 'auditory'],
      description: 'Strong auditory processing and rhythmic abilities',
      recentChange: 2,
    },
    {
      id: 'logic',
      label: 'Logic & Reasoning',
      category: 'developing',
      score: 76,
      icon: Puzzle,
      connections: ['math', 'problem-solving'],
      description: 'Good analytical thinking, developing abstract reasoning',
      recentChange: 6,
    },
    {
      id: 'language',
      label: 'Language Arts',
      category: 'developing',
      score: 68,
      icon: MessageSquare,
      connections: ['reading', 'communication'],
      description: 'Strong vocabulary, working on written expression',
      recentChange: 4,
    },
    {
      id: 'spatial',
      label: 'Spatial Reasoning',
      category: 'strength',
      score: 91,
      icon: Globe,
      connections: ['math', 'creative'],
      description: 'Excellent 3D visualization and spatial manipulation',
      recentChange: 1,
    },
  ];

  const aiInsights: AIInsight[] = [
    {
      type: 'strength',
      title: 'Visual-Spatial Learner',
      description: 'Emma shows strong visual-spatial processing, which supports her math and creative abilities.',
    },
    {
      type: 'opportunity',
      title: 'Reading Integration',
      description: 'Connecting reading activities with visual elements could accelerate literacy development.',
      action: 'Try graphic novels and visual storytelling exercises',
    },
    {
      type: 'recommendation',
      title: 'Social Skills Practice',
      description: 'Structured peer interactions in small groups could help develop social confidence.',
      action: 'Consider joining art or music clubs',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'from-green-400 to-emerald-600';
      case 'developing': return 'from-coral-400 to-orange-500';
      case 'challenge': return 'from-purple-400 to-pink-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-green-50 border-green-200';
      case 'developing': return 'bg-coral-50 border-coral-200';
      case 'challenge': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-coral-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-coral-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard"
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-aivo-gradient rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-coral-600">AIVO Virtual Brain</span>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent">
                    {childName}'s Cognitive Map
                  </h1>
                  <p className="text-gray-600 mt-1">
                    AI-generated insights based on 147 learning sessions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link 
                  to="/analytics"
                  className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white border-2 border-gray-200 hover:border-gray-300"
                >
                  <BarChart3 className="w-5 h-5" />
                  View Report
                </Link>
                <button 
                  onClick={() => {
                    // Trigger analysis update
                    window.location.reload();
                  }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-coral-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-600 border border-white/20 backdrop-blur-sm"
                >
                  <Zap className="w-5 h-5" />
                  Update Analysis
                </button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm w-fit">
              {[
                { key: 'cognitive', label: 'Cognitive', icon: Brain },
                { key: 'academic', label: 'Academic', icon: BookOpen },
                { key: 'social', label: 'Social', icon: Users },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === key 
                      ? 'bg-aivo-gradient text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Brain Visualization */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                  {/* Central Brain */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 bg-gradient-to-br from-coral-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                      <Brain className="w-20 h-20 text-coral-600" />
                    </div>
                  </div>

                  {/* Cognitive Nodes */}
                  {brainNodes.map((node, index) => {
                    const angle = (index * 360) / brainNodes.length;
                    const radius = 220;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <motion.div
                        key={node.id}
                        className="absolute"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.button
                          className={`relative w-28 h-28 rounded-2xl bg-gradient-to-br ${getCategoryColor(node.category)} p-1 shadow-lg hover:shadow-xl`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          onClick={() => setSelectedNode(node)}
                        >
                          <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center p-2">
                            {React.createElement(node.icon, { className: "w-8 h-8 text-gray-700 mb-1" })}
                            <span className="text-xs font-semibold text-center leading-tight">{node.label}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-lg font-bold text-gray-900">{node.score}%</span>
                              {node.recentChange > 0 && (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              )}
                            </div>
                          </div>
                          
                          {/* Recent improvement indicator */}
                          {node.recentChange > 5 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                              <Sparkles className="w-3 h-3 text-yellow-800" />
                            </div>
                          )}
                        </motion.button>
                      </motion.div>
                    );
                  })}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                    {brainNodes.map((node, i) => {
                      const angle1 = (i * 360) / brainNodes.length;
                      const x1 = Math.cos((angle1 * Math.PI) / 180) * 220 + 300;
                      const y1 = Math.sin((angle1 * Math.PI) / 180) * 220 + 300;

                      return node.connections.map((connectionId) => {
                        const connectedNode = brainNodes.find(n => n.id === connectionId);
                        if (!connectedNode) return null;
                        
                        const j = brainNodes.indexOf(connectedNode);
                        const angle2 = (j * 360) / brainNodes.length;
                        const x2 = Math.cos((angle2 * Math.PI) / 180) * 220 + 300;
                        const y2 = Math.sin((angle2 * Math.PI) / 180) * 220 + 300;

                        return (
                          <motion.line
                            key={`${node.id}-${connectionId}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            strokeOpacity="0.2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          />
                        );
                      });
                    })}
                    <defs>
                      <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#FF7B5C" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></div>
                    <span className="text-sm text-gray-600 font-medium">Strengths (80%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-coral-400 to-orange-500"></div>
                    <span className="text-sm text-gray-600 font-medium">Developing (60-79%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-600"></div>
                    <span className="text-sm text-gray-600 font-medium">Focus Areas (&lt;60%)</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Selected Node Details */}
              {selectedNode && (
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedNode.category)} p-2 shadow-sm`}>
                      {React.createElement(selectedNode.icon, { className: "w-full h-full text-white" })}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedNode.label}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{selectedNode.score}%</span>
                        {selectedNode.recentChange > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            +{selectedNode.recentChange}% this month
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{selectedNode.description}</p>
                  
                  <div className="space-y-3">
                    <Link 
                      to="/learner-app"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Start Targeted Activity
                    </Link>
                    <Link 
                      to="/analytics"
                      className="w-full inline-flex items-center justify-center gap-2 bg-transparent border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Target className="w-4 h-4" />
                      View Learning Plan
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* AI Insights */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-coral-600" />
                  <h3 className="font-bold text-gray-900">AI Insights</h3>
                </div>
                
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        insight.type === 'strength' ? 'bg-green-50 border-green-200' :
                        insight.type === 'opportunity' ? 'bg-coral-50 border-coral-200' :
                        'bg-purple-50 border-purple-200'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <p className={`text-sm font-semibold mb-1 ${
                        insight.type === 'strength' ? 'text-green-900' :
                        insight.type === 'opportunity' ? 'text-coral-900' :
                        'text-purple-900'
                      }`}>
                        {insight.title}
                      </p>
                      <p className={`text-sm mb-2 ${
                        insight.type === 'strength' ? 'text-green-700' :
                        insight.type === 'opportunity' ? 'text-coral-700' :
                        'text-purple-700'
                      }`}>
                        {insight.description}
                      </p>
                      {insight.action && (
                        <p className={`text-xs font-medium ${
                          insight.type === 'strength' ? 'text-green-600' :
                          insight.type === 'opportunity' ? 'text-coral-600' :
                          'text-purple-600'
                        }`}>
                          💡 {insight.action}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    to="/settings"
                    className="w-full inline-flex items-center justify-start gap-3 bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-coral-300 hover:text-coral-600"
                  >
                    <Target className="w-5 h-5" />
                    Adjust Learning Goals
                  </Link>
                  <Link 
                    to="/messages"
                    className="w-full inline-flex items-center justify-start gap-3 bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600"
                  >
                    <Users className="w-5 h-5" />
                    Share with Teacher
                  </Link>
                  <Link 
                    to="/analytics"
                    className="w-full inline-flex items-center justify-start gap-3 bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600"
                  >
                    <Eye className="w-5 h-5" />
                    View Detailed Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};