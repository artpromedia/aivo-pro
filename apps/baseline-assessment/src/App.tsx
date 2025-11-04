import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams } from 'react-router-dom';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  RotateCcw,
  Sparkles,
  Target,
  BookOpen,
  Calculator,
  Palette,
  Music,
  Globe,
  Beaker
} from 'lucide-react';

interface ChildData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  zipCode: string;
  grade: string;
  createdAt: string;
  assessmentStatus: 'pending' | 'in-progress' | 'completed';
  modelStatus: 'pending' | 'cloning' | 'ready';
}

interface AssessmentQuestion {
  id: string;
  subject: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'drawing';
  options?: string[];
  correctAnswer: string | number;
  difficulty: number; // 1-5
  ageRange: string;
}

const AssessmentHome: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const [searchParams] = useSearchParams();
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const source = searchParams.get('source');

  useEffect(() => {
    if (childId) {
      // Load child data from localStorage (in real app, this would be an API call)
      const storedChild = localStorage.getItem(`aivo_child_${childId}`);
      if (storedChild) {
        setChildData(JSON.parse(storedChild));
      }
    }
    setLoading(false);
  }, [childId]);

  const startAssessment = () => {
    if (childData) {
      // Update assessment status
      const updatedChild = { ...childData, assessmentStatus: 'in-progress' as const };
      localStorage.setItem(`aivo_child_${childId}`, JSON.stringify(updatedChild));
      setChildData(updatedChild);
      
      // In a real app, this would navigate to the assessment component
      window.location.href = `/assessment/${childId}/start`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-purple-50 to-salmon-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-purple-50 to-salmon-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-coral-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-64 h-64 bg-salmon-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <main className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-coral-600" />
            <span className="text-sm font-medium text-gray-700">AIVO Baseline Assessment</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Personalized Learning Assessment
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your unique learning profile and unlock your potential with AI-powered personalization
          </p>
        </div>

        {/* Child Info Card */}
        {childData && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 max-w-4xl mx-auto mb-12 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome, {childData.firstName}! 👋
                </h2>
                <p className="text-gray-600">
                  Grade {childData.grade === 'K' ? 'Kindergarten' : childData.grade} • ZIP {childData.zipCode}
                </p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  15-30 minutes
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Target className="w-4 h-4" />
                  Adaptive difficulty
                </div>
              </div>
            </div>

            {/* Assessment Subjects */}
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { icon: BookOpen, name: 'Reading', color: 'coral' },
                { icon: Calculator, name: 'Math', color: 'purple' },
                { icon: Beaker, name: 'Science', color: 'salmon' },
                { icon: Globe, name: 'Social Studies', color: 'teal' },
                { icon: Palette, name: 'Art & Creativity', color: 'pink' },
                { icon: Music, name: 'Logic & Reasoning', color: 'indigo' },
              ].map((subject, index) => (
                <div key={subject.name} className="text-center p-4 bg-white/50 rounded-2xl border border-white/30 hover:scale-105 transition-transform">
                  <subject.icon className={`w-8 h-8 mx-auto mb-2 text-${subject.color}-600`} />
                  <p className="text-sm font-medium text-gray-700">{subject.name}</p>
                </div>
              ))}
            </div>

            {/* Assessment Info */}
            <div className="bg-gradient-to-r from-purple-50 to-coral-50 rounded-2xl p-6 border border-purple-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                How This Assessment Works
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Adaptive Questions</p>
                    <p className="text-sm text-purple-700">Questions adjust based on your responses</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-coral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-coral-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-coral-900">Skill Mapping</p>
                    <p className="text-sm text-coral-700">Identify strengths and growth areas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-salmon-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-salmon-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-salmon-900">AI Model Creation</p>
                    <p className="text-sm text-salmon-700">Build your personalized learning AI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startAssessment}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-coral-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-coral-600 hover:to-purple-600 transition-all hover:scale-105 hover:shadow-lg"
              >
                <Play className="w-5 h-5" />
                Begin Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                You can pause and resume at any time • All progress is automatically saved
              </p>
            </div>
          </div>
        )}

        {/* No Child Data */}
        {!childData && childId && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-coral-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Child Profile Not Found
            </h2>
            
            <p className="text-gray-600 mb-6">
              The child profile for ID "{childId}" could not be found. Please make sure you're using the correct link from the parent portal.
            </p>
            
            <button
              onClick={() => window.close()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Close Window
            </button>
          </div>
        )}

        {/* Generic Landing */}
        {!childId && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-coral-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              AIVO Baseline Assessment
            </h2>
            
            <p className="text-gray-600 mb-6">
              This assessment is typically accessed through the AIVO parent portal after creating a child profile.
            </p>
            
            <p className="text-sm text-gray-500">
              If you're a developer, you can test with: 
              <code className="bg-gray-100 px-2 py-1 rounded ml-2">
                /assessment/test_child_123
              </code>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssessmentHome />} />
        <Route path="/assessment/:childId" element={<AssessmentHome />} />
        <Route path="/assessment/:childId/start" element={<div>Assessment Started - Implementation Pending</div>} />
      </Routes>
    </Router>
  );
}

export default App