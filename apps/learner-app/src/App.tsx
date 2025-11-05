import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, Navigate } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { K5Dashboard } from './pages/K5Dashboard';
import { MSDashboard } from './pages/MSDashboard';
import { HSDashboard } from './pages/HSDashboard';
import { SubjectLearning } from './pages/SubjectLearning';
import { ProfileInsights } from './pages/ProfileInsights';
import { LoadingScreen } from './components/LoadingScreen';
import { ProfileMenu } from './components/ProfileMenu';

export type AgeGroup = 'K5' | 'MS' | 'HS';

// Extended child profile from parent dashboard and baseline assessment
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
  personalizedContent?: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    preferredActivities: string[];
    customCurriculum: any[];
  };
}

function AppRouter() {
  const [searchParams] = useSearchParams();
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [currentTheme, setCurrentTheme] = useState<AgeGroup>('K5');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  // Auto-determine theme based on age
  const getThemeFromAge = (age: number): AgeGroup => {
    if (age >= 5 && age <= 10) return 'K5';
    if (age >= 11 && age <= 14) return 'MS';
    if (age >= 15 && age <= 18) return 'HS';
    return 'K5'; // Default fallback
  };

  // Update theme when child profile changes
  useEffect(() => {
    if (childProfile) {
      const newTheme = getThemeFromAge(childProfile.age);
      setCurrentTheme(newTheme);
    }
  }, [childProfile]);

  // Initialize child profile from URL parameters or localStorage
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoadingMessage('Loading your learning profile...');
        
        // Check if coming from baseline assessment with results
        const childId = searchParams.get('childId');
        const childName = searchParams.get('childName');
        const age = searchParams.get('age');
        const grade = searchParams.get('grade');
        const baselineComplete = searchParams.get('baselineComplete');
        const results = searchParams.get('results');
        
        if (childId && baselineComplete === 'true' && results) {
          setLoadingMessage('Processing baseline assessment results...');
          
          try {
            // Parse baseline results
            const baselineResults = JSON.parse(decodeURIComponent(results));
            
            // Simulate fetching full child profile from API
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoadingMessage('Creating your personalized learning model...');
            
            // Simulate AI model cloning process
            await new Promise(resolve => setTimeout(resolve, 3000));
            setLoadingMessage('Setting up your learning dashboard...');
            
            // Create complete child profile
            const profile: ChildProfile = {
              id: childId,
              name: baselineResults.childName || 'Student',
              age: baselineResults.age || 8,
              grade: baselineResults.grade || 'Grade 3',
              parentId: baselineResults.parentId || 'parent_123',
              baselineResults: {
                mathLevel: baselineResults.mathLevel || 5,
                readingLevel: baselineResults.readingLevel || 5,
                scienceLevel: baselineResults.scienceLevel || 5,
                learningStyle: baselineResults.learningStyle || 'visual',
                interests: baselineResults.interests || ['math', 'science'],
                strengths: baselineResults.strengths || ['problem-solving'],
                needsImprovement: baselineResults.needsImprovement || ['focus']
              },
              aiModelCloned: true,
              personalizedContent: {
                difficulty: (baselineResults.mathLevel || 5) >= 8 ? 'advanced' : (baselineResults.mathLevel || 5) >= 5 ? 'intermediate' : 'beginner',
                preferredActivities: (baselineResults.learningStyle || 'visual') === 'visual' ? ['videos', 'diagrams', 'interactive-games'] :
                                   (baselineResults.learningStyle || 'visual') === 'auditory' ? ['audio-lessons', 'discussions', 'music'] :
                                   ['hands-on-activities', 'experiments', 'building-games'],
                customCurriculum: [] // Would be generated based on baseline results
              }
            };
            
            setChildProfile(profile);
            localStorage.setItem('aivoChildProfile', JSON.stringify(profile));
            
          } catch (parseError) {
            console.error('Error parsing baseline results:', parseError);
            setLoadingMessage('Error processing assessment results. Using default profile...');
            
            // Create fallback profile with URL parameters if available
            if (childId && childName && age) {
              const fallbackProfile: ChildProfile = {
                id: childId,
                name: decodeURIComponent(childName),
                age: parseInt(age),
                grade: grade ? decodeURIComponent(grade) : `Grade ${Math.max(1, parseInt(age) - 4)}`,
                parentId: 'parent_fallback',
                baselineResults: {
                  mathLevel: 5,
                  readingLevel: 5,
                  scienceLevel: 5,
                  learningStyle: 'visual',
                  interests: ['math', 'science', 'reading'],
                  strengths: ['curiosity'],
                  needsImprovement: ['focus']
                },
                aiModelCloned: true,
                personalizedContent: {
                  difficulty: 'intermediate',
                  preferredActivities: ['videos', 'games', 'quizzes'],
                  customCurriculum: []
                }
              };
              
              setChildProfile(fallbackProfile);
              localStorage.setItem('aivoChildProfile', JSON.stringify(fallbackProfile));
            }
          }
        } else if (childId && childName && age) {
          // Direct URL parameters without baseline assessment
          setLoadingMessage('Setting up your learning profile...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const profile: ChildProfile = {
            id: childId,
            name: decodeURIComponent(childName),
            age: parseInt(age),
            grade: grade ? decodeURIComponent(grade) : `Grade ${Math.max(1, parseInt(age) - 4)}`,
            parentId: 'parent_direct',
            baselineResults: {
              mathLevel: Math.max(1, Math.min(10, parseInt(age) - 3)),
              readingLevel: Math.max(1, Math.min(10, parseInt(age) - 3)),
              scienceLevel: Math.max(1, Math.min(10, parseInt(age) - 4)),
              learningStyle: 'visual',
              interests: ['math', 'science', 'reading', 'art'],
              strengths: ['curiosity', 'creativity'],
              needsImprovement: ['focus', 'organization']
            },
            aiModelCloned: false, // Will need baseline assessment
            personalizedContent: {
              difficulty: 'intermediate',
              preferredActivities: ['videos', 'games', 'quizzes'],
              customCurriculum: []
            }
          };
          
          setChildProfile(profile);
          localStorage.setItem('aivoChildProfile', JSON.stringify(profile));
        } else {
          // Try to load existing profile from localStorage
          const savedProfile = localStorage.getItem('aivoChildProfile');
          if (savedProfile) {
            try {
              const profile = JSON.parse(savedProfile);
              setChildProfile(profile);
              setLoadingMessage('Welcome back!');
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
              console.error('Error loading saved profile:', error);
              localStorage.removeItem('aivoChildProfile'); // Clear corrupted data
            }
          }
        }
        
      } catch (error) {
        console.error('Unexpected error during initialization:', error);
        setLoadingMessage('Something went wrong. Please try again.');
        // Clear any corrupted data
        localStorage.removeItem('aivoChildProfile');
      }
      
      setIsLoading(false);
    };

    initializeProfile();
  }, [searchParams]);

  const handleProfileUpdate = (updatedProfile: Partial<ChildProfile>) => {
    if (childProfile) {
      const newProfile = { ...childProfile, ...updatedProfile };
      setChildProfile(newProfile);
      localStorage.setItem('aivoChildProfile', JSON.stringify(newProfile));
    }
  };

  const handleLogout = () => {
    setChildProfile(null);
    localStorage.removeItem('aivoChildProfile');
    // Redirect back to parent dashboard
    window.location.href = 'http://localhost:5174'; // Parent portal URL
  };

  const getDashboardComponent = () => {
    if (!childProfile) return <Navigate to="/" replace />;
    
    switch (currentTheme) {
      case 'K5':
        return <K5Dashboard childProfile={childProfile} />;
      case 'MS':
        return <MSDashboard childProfile={childProfile} />;
      case 'HS':
        return <HSDashboard childProfile={childProfile} />;
      default:
        return <K5Dashboard childProfile={childProfile} />;
    }
  };

  // Show loading screen during initialization
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  // If no child profile and not coming from baseline assessment, redirect to parent portal
  if (!childProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-4xl shadow-2xl p-10 max-w-2xl w-full text-center">
          <div className="text-8xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Required</h1>
          <p className="text-lg text-gray-600 mb-8">
            This learning dashboard requires setup through the parent portal and baseline assessment.
          </p>
          <button
            onClick={() => window.location.href = 'http://localhost:5174'}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg"
          >
            Go to Parent Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <div className="min-h-screen relative">
        {/* Profile Menu - Fixed position */}
        <div className="fixed top-6 right-6 z-50">
          <ProfileMenu 
            childProfile={childProfile} 
            onProfileUpdate={handleProfileUpdate}
            onLogout={handleLogout}
          />
        </div>

        <Routes>
          <Route path="/" element={getDashboardComponent()} />
          <Route path="/learn/:subject" element={<SubjectLearning childProfile={childProfile} />} />
          <Route path="/profile-insights" element={<ProfileInsights childProfile={childProfile} onBack={() => window.history.back()} />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;