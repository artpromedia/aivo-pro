import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calculator, 
  Beaker, 
  Globe2, 
  BarChart3, 
  Calendar, 
  Target,
  Clock,
  TrendingUp,
  Award,
  Users,
  GraduationCap,
  CheckCircle2,
  PenTool,
  HelpCircle,
  Gamepad2,
  FileText
} from 'lucide-react';
import { FocusMonitor } from '../components/FocusMonitor';
import { HomeworkHelper } from '../pages/HomeworkHelper';
import { AdvancedWritingPad } from '../components/WritingPad';
import { GameBreak } from '../pages/GameBreak';
import { TestCenter } from '../pages/TestCenter';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  parentId: string;
  baselineResults?: {
    mathLevel: number;
    readingLevel: number;
    scienceLevel: number;
    learningStyle: 'visual' | 'auditory' | 'kinesthetic';
    interests: string[];
    strengths: string[];
    needsImprovement: string[];
  };
  aiModelCloned: boolean;
}

interface HSDashboardProps {
  childProfile: ChildProfile;
}

export const HSDashboard: React.FC<HSDashboardProps> = ({ childProfile }) => {
  const navigate = useNavigate();
  const [showHomeworkHelper, setShowHomeworkHelper] = useState(false);
  const [showWritingPad, setShowWritingPad] = useState(false);
  const [showGameBreak, setShowGameBreak] = useState(false);
  const [showTestCenter, setShowTestCenter] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const subjects = [
    { 
      id: 'calculus', 
      name: 'AP Calculus', 
      icon: Calculator, 
      bgGradient: 'from-slate-600 to-slate-800',
      progress: 85,
      grade: 'A-',
      nextAssignment: 'Derivatives Quiz',
      dueDate: '2 days',
      difficulty: 'Advanced'
    },
    { 
      id: 'chemistry', 
      name: 'AP Chemistry', 
      icon: Beaker, 
      bgGradient: 'from-emerald-600 to-emerald-800',
      progress: 78,
      grade: 'B+', 
      nextAssignment: 'Organic Compounds Lab',
      dueDate: '5 days',
      difficulty: 'Advanced'
    },
    { 
      id: 'literature', 
      name: 'AP Literature', 
      icon: BookOpen, 
      bgGradient: 'from-indigo-600 to-indigo-800',
      progress: 92,
      grade: 'A',
      nextAssignment: 'Poetry Analysis Essay',
      dueDate: '1 week',
      difficulty: 'Advanced'
    },
    { 
      id: 'history', 
      name: 'World History', 
      icon: Globe2, 
      bgGradient: 'from-amber-600 to-amber-800',
      progress: 88,
      grade: 'A-',
      nextAssignment: 'Modern Era Research',
      dueDate: '3 days',
      difficulty: 'Intermediate'
    },
  ];

  const upcomingDeadlines = [
    { subject: 'Calculus', task: 'Derivatives Quiz', date: '2024-11-06', urgent: true },
    { subject: 'Chemistry', task: 'Lab Report #3', date: '2024-11-08', urgent: false },
    { subject: 'Literature', task: 'Poetry Analysis', date: '2024-11-12', urgent: false },
    { subject: 'History', task: 'Research Paper', date: '2024-11-07', urgent: true },
  ];

  const studyStats = [
    { label: 'GPA', value: '3.85', icon: GraduationCap, color: 'text-green-600' },
    { label: 'Study Hours', value: '28h', icon: Clock, color: 'text-blue-600' },
    { label: 'Assignments', value: '12/15', icon: CheckCircle2, color: 'text-purple-600' },
    { label: 'Class Rank', value: '#23', icon: Award, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-system">
      
      <div className="container mx-auto px-8 py-8 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {childProfile.name}'s Academic Dashboard
            </h1>
            <p className="text-lg text-gray-600">{childProfile.grade} • Fall Semester 2024</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Current GPA</p>
            <p className="text-3xl font-bold text-green-600">3.85</p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {studyStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          
          {/* Subjects Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Courses</h2>
              
              <div className="grid gap-6">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onHoverStart={() => setHoveredCard(subject.id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    onClick={() => navigate(`/learn/${subject.id}`)}
                    className="cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${subject.bgGradient} rounded-xl flex items-center justify-center shadow-sm`}>
                              <subject.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{subject.name}</h3>
                              <p className="text-sm text-gray-600">{subject.difficulty}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{subject.grade}</p>
                            <p className="text-sm text-gray-500">{subject.progress}% Complete</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${subject.bgGradient} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${subject.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                            />
                          </div>
                        </div>
                        
                        {/* Assignment Info */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Next: {subject.nextAssignment}</p>
                            <p className="text-xs text-gray-500">Due in {subject.dueDate}</p>
                          </div>
                          
                          <motion.button
                            onClick={() => {
                              alert(`📚 ${subject.name} Study Session\n\nCurrent grade: ${subject.grade}\nProgress: ${subject.progress}%\nNext: ${subject.nextAssignment}\nDue: ${subject.dueDate}\n\nTime to focus and achieve academic excellence! 🎯`);
                              navigate(`/learn/${subject.id}`);
                            }}
                            whileHover={{ scale: 1.05 }}
                            className={`px-4 py-2 bg-gradient-to-r ${subject.bgGradient} text-white text-sm font-medium rounded-lg`}
                          >
                            Study Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Deadlines
              </h3>
              
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded-xl border ${
                      deadline.urgent 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{deadline.task}</p>
                        <p className="text-xs text-gray-600">{deadline.subject}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        deadline.urgent 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {new Date(deadline.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Study Goals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weekly Goals
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Study Hours</span>
                    <span className="text-sm font-medium">28/30h</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '93%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Assignments</span>
                    <span className="text-sm font-medium">12/15</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Reading</span>
                    <span className="text-sm font-medium">245/300 pages</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '82%'}}></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Study Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Tools</h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowWritingPad(true)}
                  className="w-full p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-colors flex items-center gap-3"
                >
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <PenTool className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Digital Notebook</div>
                    <div className="text-sm text-gray-600">Advanced note-taking and organization</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowHomeworkHelper(true)}
                  className="w-full p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-colors flex items-center gap-3"
                >
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Assignment Assistant</div>
                    <div className="text-sm text-gray-600">Complex problem solving and guidance</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowGameBreak(true)}
                  className="w-full p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-colors flex items-center gap-3"
                >
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Gamepad2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Cognitive Breaks</div>
                    <div className="text-sm text-gray-600">Strategic brain training games</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTestCenter(true)}
                  className="w-full p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:from-indigo-100 hover:to-indigo-200 transition-colors flex items-center gap-3"
                >
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Test Center</div>
                    <div className="text-sm text-gray-600">AP practice tests and assessments</div>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Study Planner', icon: Calendar },
                  { label: 'Grade Calculator', icon: Calculator },
                  { label: 'Study Groups', icon: Users },
                  { label: 'Performance Analytics', icon: BarChart3 },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      const messages = {
                        'Study Planner': '📅 Study Planner\n\nOrganize your study schedule:\n• Set study goals\n• Schedule sessions\n• Track progress\n• Manage deadlines\n\nStay organized and succeed!',
                        'Grade Calculator': '🧮 Grade Calculator\n\nCalculate your grades:\n• Assignment weights\n• Test scores\n• Final grade predictions\n• GPA tracking\n\nKnow where you stand!',
                        'Study Groups': '👥 Study Groups\n\nConnect with classmates:\n• Join study sessions\n• Share resources\n• Collaborate on projects\n• Help each other learn\n\nLearning together!',
                        'Performance Analytics': '📈 Performance Analytics\n\nTrack your academic performance:\n• Grade trends\n• Study time analysis\n• Subject comparisons\n• Progress insights\n\nData-driven success!'
                      };
                      alert(messages[action.label as keyof typeof messages] || `${action.label} feature coming soon!`);
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-gray-50 border border-gray-200"
                  >
                    <action.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Academic Performance Trends
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">+0.15</div>
              <p className="text-sm text-gray-600">GPA Improvement</p>
              <p className="text-xs text-green-600">vs last semester</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
              <p className="text-sm text-gray-600">Assignment Completion</p>
              <p className="text-xs text-blue-600">Above class average</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">156h</div>
              <p className="text-sm text-gray-600">Total Study Time</p>
              <p className="text-xs text-purple-600">This semester</p>
            </div>
          </div>
        </motion.div>
        
      </div>

      {/* Focus Monitor */}
      <FocusMonitor 
        onGameBreakNeeded={() => setShowGameBreak(true)}
        isVisible={!showHomeworkHelper && !showWritingPad && !showGameBreak && !showTestCenter}
        position="top-right"
      />

      {/* Feature Modals */}
      {showHomeworkHelper && (
        <HomeworkHelper
          childName={childProfile.name}
          childAge={childProfile.age}
          onClose={() => setShowHomeworkHelper(false)}
        />
      )}

      {showWritingPad && (
        <AdvancedWritingPad
          childName={childProfile.name}
          onClose={() => setShowWritingPad(false)}
        />
      )}

      {showGameBreak && (
        <GameBreak
          childAge={childProfile.age}
          onGameComplete={() => {}}
          onBackToLearning={() => setShowGameBreak(false)}
        />
      )}

      {showTestCenter && (
        <TestCenter
          childName={childProfile.name}
          childAge={childProfile.age}
          childGrade={childProfile.grade}
          onClose={() => setShowTestCenter(false)}
        />
      )}
    </div>
  );
};