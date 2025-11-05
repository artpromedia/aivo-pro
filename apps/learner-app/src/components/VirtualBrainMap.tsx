import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, X, Zap, Target, BookOpen, TrendingUp, 
  Lightbulb, Star, Award, BarChart3, Activity,
  Eye, Play, Pause, RotateCcw, Settings, Info
} from 'lucide-react';

interface BrainMapProps {
  childProfile: any;
  onClose: () => void;
}

interface BrainNode {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  strength: number;
  category: 'math' | 'reading' | 'science' | 'creativity' | 'logic' | 'memory';
  connections: string[];
  activity: number;
  growth: number;
}

export const VirtualBrainMap: React.FC<BrainMapProps> = ({ childProfile, onClose }) => {
  console.log('VirtualBrainMap component rendered!');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [time, setTime] = useState(0);

  // Advanced brain data with real-time metrics
  const brainNodes: BrainNode[] = [
    {
      id: 'prefrontal-cortex',
      label: 'Executive Function',
      x: 50, y: 25, z: 40,
      strength: 85,
      category: 'logic',
      connections: ['hippocampus', 'math-region'],
      activity: Math.sin(time * 0.003) * 20 + 70,
      growth: 12
    },
    {
      id: 'hippocampus',
      label: 'Memory Formation',
      x: 45, y: 55, z: 30,
      strength: 78,
      category: 'memory',  
      connections: ['prefrontal-cortex', 'language-area'],
      activity: Math.sin(time * 0.002) * 15 + 65,
      growth: 8
    },
    {
      id: 'visual-cortex',
      label: 'Visual Processing',
      x: 15, y: 70, z: 25,
      strength: 92,
      category: 'creativity',
      connections: ['parietal-lobe'],
      activity: Math.sin(time * 0.004) * 25 + 80,
      growth: 15
    },
    {
      id: 'language-area',
      label: 'Language Center',
      x: 75, y: 45, z: 35,
      strength: 72,
      category: 'reading',
      connections: ['hippocampus'],
      activity: Math.sin(time * 0.0025) * 18 + 68,
      growth: 10
    },
    {
      id: 'math-region',
      label: 'Mathematical Reasoning',
      x: 65, y: 30, z: 45,
      strength: 88,
      category: 'math',
      connections: ['prefrontal-cortex', 'parietal-lobe'],
      activity: Math.sin(time * 0.0035) * 22 + 75,
      growth: 18
    },
    {
      id: 'parietal-lobe',
      label: 'Spatial Reasoning',
      x: 35, y: 35, z: 50,
      strength: 81,
      category: 'science',
      connections: ['visual-cortex', 'math-region'],
      activity: Math.sin(time * 0.003) * 20 + 72,
      growth: 14
    }
  ];

  // Real-time animation loop
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + 50);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'math': return { primary: '#3B82F6', glow: '#60A5FA', bg: 'bg-blue-500' };
      case 'reading': return { primary: '#10B981', glow: '#34D399', bg: 'bg-green-500' };
      case 'science': return { primary: '#8B5CF6', glow: '#A78BFA', bg: 'bg-purple-500' };
      case 'creativity': return { primary: '#EC4899', glow: '#F472B6', bg: 'bg-pink-500' };
      case 'logic': return { primary: '#F59E0B', glow: '#FBBF24', bg: 'bg-yellow-500' };
      case 'memory': return { primary: '#EF4444', glow: '#F87171', bg: 'bg-red-500' };
      default: return { primary: '#6B7280', glow: '#9CA3AF', bg: 'bg-gray-500' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'math': return Target;
      case 'reading': return BookOpen;
      case 'science': return Zap;
      case 'creativity': return Lightbulb;
      case 'logic': return TrendingUp;
      case 'memory': return Star;
      default: return Brain;
    }
  };

  const selectedNodeData = selectedNode ? brainNodes.find(n => n.id === selectedNode) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full h-[95vh] overflow-hidden"
        >
          {/* Header with Advanced Controls */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                animate={{ rotate: isAnimating ? 360 : 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">🧠 Virtual Brain Map</h2>
                <p className="text-gray-600">{childProfile?.name || 'Student'}'s Neural Activity</p>
              </div>
            </div>
            
            {/* Advanced Control Panel */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
                {viewMode.toUpperCase()} View
              </motion.button>
              
              <motion.button
                onClick={() => setIsAnimating(!isAnimating)}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAnimating ? 'Pause' : 'Play'}
              </motion.button>
              
              <motion.button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </motion.button>
              
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="flex h-full">
            {/* Main 3D Brain Visualization */}
            <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden">
              {viewMode === '3d' ? (
                <>
                  {/* 3D Brain Nodes Grid with Neural Pathways */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-full max-w-4xl h-full">
                      {/* Neural Pathway Network */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {brainNodes.map((node, i) => 
                          node.connections.map(connectionId => {
                            const targetNode = brainNodes.find(n => n.id === connectionId);
                            if (!targetNode) return null;
                            
                            const x1 = `${node.x}%`;
                            const y1 = `${node.y}%`;
                            const x2 = `${targetNode.x}%`;
                            const y2 = `${targetNode.y}%`;
                            
                            return (
                              <motion.line
                                key={`${node.id}-${connectionId}`}
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="url(#neuralGradient)"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                  pathLength: isAnimating ? [0, 1, 0] : 0.5,
                                  opacity: isAnimating ? [0.2, 0.8, 0.2] : 0.4
                                }}
                                transition={{ 
                                  duration: 3, 
                                  repeat: Infinity, 
                                  delay: Math.random() * 2,
                                  ease: "easeInOut"
                                }}
                              />
                            );
                          })
                        )}
                        <defs>
                          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Interactive Brain Nodes */}
                      {brainNodes.map((node) => {
                        const colors = getCategoryColor(node.category);
                        const IconComponent = getCategoryIcon(node.category);
                        const activityLevel = Math.sin(time * 0.003 + node.x) * 30 + 70;
                        
                        return (
                          <motion.div
                            key={node.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                            whileHover={{ scale: 1.2, z: 50 }}
                            animate={{
                              scale: selectedNode === node.id ? 1.3 : 1,
                              rotateY: isAnimating ? [0, 360] : 0
                            }}
                            transition={{ 
                              scale: { duration: 0.3 },
                              rotateY: { duration: 8, repeat: Infinity, ease: "linear" }
                            }}
                          >
                            {/* Outer Glow Ring */}
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{ 
                                width: '80px', 
                                height: '80px',
                                background: `radial-gradient(circle, ${colors.glow}40, transparent 70%)`
                              }}
                              animate={{
                                scale: isAnimating ? [1, 1.5, 1] : 1,
                                opacity: isAnimating ? [0.3, 0.8, 0.3] : 0.5
                              }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            
                            {/* Main Node */}
                            <motion.div
                              className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                              style={{ 
                                backgroundColor: colors.primary,
                                boxShadow: `0 0 30px ${colors.glow}`
                              }}
                              animate={{
                                boxShadow: isAnimating 
                                  ? [`0 0 20px ${colors.glow}`, `0 0 40px ${colors.glow}`, `0 0 20px ${colors.glow}`]
                                  : `0 0 20px ${colors.glow}`
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <IconComponent className="w-7 h-7 text-white" />
                              
                              {/* Activity Pulse */}
                              {activityLevel > 85 && (
                                <motion.div
                                  className="absolute inset-0 rounded-full border-2 border-white"
                                  animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.8, 0, 0.8]
                                  }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              )}
                            </motion.div>
                            
                            {/* Node Label */}
                            <motion.div
                              className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: selectedNode === node.id ? 1 : 0.7 }}
                            >
                              <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg text-xs font-medium text-gray-800 whitespace-nowrap">
                                {node.label}
                              </div>
                              <div className="mt-1 text-xs text-white font-semibold">
                                {node.strength}%
                              </div>
                            </motion.div>
                            
                            {/* Strength Indicator */}
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                              <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: colors.glow }}
                                  animate={{ width: `${node.strength}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* 2D List View */
                <div className="p-8 grid grid-cols-2 gap-6 h-full overflow-y-auto">
                  {brainNodes.map((node) => {
                    const colors = getCategoryColor(node.category);
                    const IconComponent = getCategoryIcon(node.category);
                    
                    return (
                      <motion.div
                        key={node.id}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer"
                        whileHover={{ scale: 1.02, y: -5 }}
                        onClick={() => setSelectedNode(node.id)}
                        style={{
                          border: selectedNode === node.id ? `2px solid ${colors.primary}` : '2px solid transparent'
                        }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{node.label}</h3>
                            <p className="text-white/60 text-sm capitalize">{node.category}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold text-lg">{node.strength}%</div>
                            <div className="text-green-400 text-sm">+{node.growth}%</div>
                          </div>
                        </div>
                        
                        {/* Strength Bar */}
                        <div className="bg-white/20 rounded-full h-2 mb-3">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: colors.glow }}
                            animate={{ width: `${node.strength}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        
                        {/* Connections */}
                        <div className="text-white/80 text-sm">
                          Connected to {node.connections.length} regions
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {/* Floating Node Details */}
              <AnimatePresence>
                {selectedNodeData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: getCategoryColor(selectedNodeData.category).primary }}
                      >
                        {React.createElement(getCategoryIcon(selectedNodeData.category), { 
                          className: "w-5 h-5 text-white" 
                        })}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{selectedNodeData.label}</h3>
                        <p className="text-gray-600 text-sm capitalize">{selectedNodeData.category} Processing</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedNodeData.strength}%</div>
                        <div className="text-xs text-gray-600">Strength</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(Math.sin(time * 0.003) * 20 + 70)}%
                        </div>
                        <div className="text-xs text-gray-600">Activity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+{selectedNodeData.growth}%</div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700">
                      <strong>Connections:</strong> {selectedNodeData.connections.length} neural pathways
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Advanced Analytics Panel */}
            <AnimatePresence>
              {showAnalytics && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 400, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l border-gray-200 bg-white overflow-hidden"
                >
                  <div className="p-6 h-full overflow-y-auto">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Cognitive Analytics
                    </h3>
                    
                    {/* Real-time Activity Monitor */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Real-time Activity</h4>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Neural Activity</span>
                          <span className="font-semibold text-purple-600">
                            {Math.round(brainNodes.reduce((sum, node) => sum + Math.sin(time * 0.003) * 20 + 70, 0) / brainNodes.length)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Active Pathways</span>
                          <span className="font-semibold text-blue-600">
                            {brainNodes.reduce((sum, node) => sum + node.connections.length, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Peak Region</span>
                          <span className="font-semibold text-green-600">
                            {brainNodes.reduce((max, node) => node.strength > max.strength ? node : max).label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cognitive Strengths Ranking */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Strength Rankings</h4>
                      <div className="space-y-3">
                        {brainNodes
                          .sort((a, b) => b.strength - a.strength)
                          .map((node, index) => {
                            const colors = getCategoryColor(node.category);
                            return (
                              <motion.div
                                key={node.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedNode(node.id)}
                                whileHover={{ x: 5 }}
                              >
                                <div className="text-lg font-bold text-gray-400 w-6">
                                  #{index + 1}
                                </div>
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: colors.primary }}
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{node.label}</div>
                                  <div className="text-xs text-gray-500 capitalize">{node.category}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold">{node.strength}%</div>
                                  <div className="text-xs text-green-600">+{node.growth}%</div>
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Learning Insights */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">AI Learning Insights</h4>
                      <div className="space-y-3">
                        <motion.div 
                          className="bg-green-50 border-l-4 border-green-400 p-3 rounded"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="text-sm font-medium text-green-800">Strong Visual Processing</div>
                          <div className="text-xs text-green-600">92% strength - excellent for visual learning</div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="text-sm font-medium text-blue-800">Mathematical Growth</div>
                          <div className="text-xs text-blue-600">18% improvement in reasoning patterns</div>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="text-sm font-medium text-purple-800">Memory Formation</div>
                          <div className="text-xs text-purple-600">Consider spaced repetition techniques</div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Performance Trends */}
                    <div>
                      <h4 className="font-semibold mb-3">Performance Trends</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-center mb-3">
                          <div className="text-2xl font-bold text-green-600">
                            +{Math.round(brainNodes.reduce((sum, node) => sum + node.growth, 0) / brainNodes.length)}%
                          </div>
                          <div className="text-sm text-gray-600">Average Growth</div>
                        </div>
                        
                        <div className="space-y-2">
                          {['Math', 'Reading', 'Memory', 'Logic'].map((subject, index) => (
                            <div key={subject} className="flex justify-between text-sm">
                              <span>{subject}:</span>
                              <span className="font-semibold text-green-600">
                                +{10 + index * 3}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
