import React from 'react';
import { useAuth, useStudents, useUI, useSync } from '@aivo/state';
import { motion } from 'framer-motion';

interface GlobalStateDemoProps {
  childProfile: any;
}

export const GlobalStateDemo: React.FC<GlobalStateDemoProps> = ({ childProfile }) => {
  const { user, setUser, logout } = useAuth();
  const { students, addStudent, updateStudent } = useStudents();
  const { theme, sidebarOpen, toggleSidebar, setTheme } = useUI();
  const { syncStatus, syncWithServer } = useSync();

  // Initialize user from child profile if not already set
  React.useEffect(() => {
    if (childProfile && !user) {
      setUser({
        id: childProfile.id,
        name: childProfile.name,
        email: `${childProfile.name.toLowerCase().replace(' ', '.')}@aivo.edu`,
        role: 'student' as any,
        avatar: undefined,
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: true,
            inApp: true,
            digest: 'daily'
          },
          accessibility: {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            screenReader: false
          }
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
    }
  }, [childProfile, user, setUser]);

  // Add current student to global state
  React.useEffect(() => {
    if (childProfile && childProfile.id && !students[childProfile.id as string]) {
      addStudent({
        id: childProfile.id,
        userId: childProfile.id,
        parentId: childProfile.parentId,
        name: childProfile.name,
        age: childProfile.age,
        grade: childProfile.grade,
        baselineResults: childProfile.baselineResults ? {
          mathLevel: childProfile.baselineResults.mathLevel,
          readingLevel: childProfile.baselineResults.readingLevel,
          scienceLevel: childProfile.baselineResults.scienceLevel,
          learningStyle: childProfile.baselineResults.learningStyle,
          interests: childProfile.baselineResults.interests,
          strengths: childProfile.baselineResults.strengths,
          needsImprovement: childProfile.baselineResults.needsImprovement,
          completedAt: new Date().toISOString()
        } : undefined,
        aiModelCloned: childProfile.aiModelCloned || false,
        personalizedContent: childProfile.personalizedContent ? {
          difficulty: childProfile.personalizedContent.difficulty,
          preferredActivities: childProfile.personalizedContent.preferredActivities,
          customCurriculum: []
        } : undefined,
        learningProgress: {
          totalTimeSpent: 0,
          subjectsProgress: {
            math: {
              subject: 'math',
              level: childProfile.baselineResults?.mathLevel || 1,
              xp: 0,
              timeSpent: 0,
              completedLessons: [],
              masteredSkills: []
            },
            reading: {
              subject: 'reading',
              level: childProfile.baselineResults?.readingLevel || 1,
              xp: 0,
              timeSpent: 0,
              completedLessons: [],
              masteredSkills: []
            },
            science: {
              subject: 'science',
              level: childProfile.baselineResults?.scienceLevel || 1,
              xp: 0,
              timeSpent: 0,
              completedLessons: [],
              masteredSkills: []
            }
          },
          streakDays: 0,
          lastActivityAt: new Date().toISOString(),
          achievements: []
        }
      });
    }
  }, [childProfile, students, addStudent]);

  const handleUpdateProgress = () => {
    const student = students[childProfile.id];
    if (student) {
      // Simulate progress update
      console.log('Updating progress for student:', student.name);
    }
  };

  const handleUpdateLevel = (subject: string) => {
    const student = students[childProfile.id];
    if (student) {
      const currentLevel = student.learningProgress.subjectsProgress[subject]?.level || 1;
      updateStudent(student.id, {
        learningProgress: {
          ...student.learningProgress,
          subjectsProgress: {
            ...student.learningProgress.subjectsProgress,
            [subject]: {
              ...student.learningProgress.subjectsProgress[subject],
              level: Math.min(10, currentLevel + 1)
            }
          }
        }
      });
    }
  };

  const currentStudent = students[childProfile.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-6 m-4"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🌐 Global State Management</h2>
        <p className="text-gray-600">
          Cross-portal synchronization demo - changes here sync across all AIVO portals
        </p>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
        <h3 className="font-semibold text-gray-800 mb-3">📡 Connection Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{syncStatus.isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${syncStatus.isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            <span>{syncStatus.isSyncing ? 'Syncing...' : 'Synced'}</span>
          </div>
          <div className="text-gray-600">
            Last sync: {syncStatus.lastSyncAt ? new Date(syncStatus.lastSyncAt).toLocaleTimeString() : 'Never'}
          </div>
          <button
            onClick={syncWithServer}
            disabled={syncStatus.isSyncing}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 disabled:opacity-50"
          >
            Force Sync
          </button>
        </div>
      </div>

      {/* User Authentication State */}
      <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
        <h3 className="font-semibold text-gray-800 mb-3">👤 Authentication State</h3>
        {user ? (
          <div className="space-y-2 text-sm">
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Role:</strong> {user.role}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <button
              onClick={logout}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-gray-500">Not logged in</div>
        )}
      </div>

      {/* Student Progress State */}
      {currentStudent && (
        <div className="mb-6 p-4 bg-green-50 rounded-2xl">
          <h3 className="font-semibold text-gray-800 mb-3">📊 Student Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Academic Levels</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span>Math: Level {currentStudent.learningProgress.subjectsProgress.math?.level || 1}</span>
                  <button
                    onClick={() => handleUpdateLevel('math')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    +1
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Reading: Level {currentStudent.learningProgress.subjectsProgress.reading?.level || 1}</span>
                  <button
                    onClick={() => handleUpdateLevel('reading')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    +1
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Science: Level {currentStudent.learningProgress.subjectsProgress.science?.level || 1}</span>
                  <button
                    onClick={() => handleUpdateLevel('science')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Student Info</h4>
              <div className="space-y-1 text-sm">
                <div>Name: {currentStudent.name}</div>
                <div>Age: {currentStudent.age}</div>
                <div>Grade: {currentStudent.grade}</div>
                <div>Streak: {currentStudent.learningProgress.streakDays} days</div>
                <button
                  onClick={handleUpdateProgress}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-xs"
                >
                  Update Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UI State */}
      <div className="mb-6 p-4 bg-purple-50 rounded-2xl">
        <h3 className="font-semibold text-gray-800 mb-3">🎨 UI State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Theme</h4>
            <div className="space-x-2">
              {['light', 'dark', 'auto'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 rounded text-xs ${
                    theme === t ? 'bg-purple-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Sidebar</h4>
            <button
              onClick={toggleSidebar}
              className={`px-3 py-1 rounded text-xs ${
                sidebarOpen ? 'bg-gray-200' : 'bg-orange-500 text-white'
              }`}
            >
              {sidebarOpen ? 'Open' : 'Closed'}
            </button>
          </div>
        </div>
      </div>

      {/* Cross-portal sync demo */}
      <div className="p-4 bg-yellow-50 rounded-2xl">
        <h3 className="font-semibold text-gray-800 mb-3">🔄 Cross-Portal Sync Demo</h3>
        <p className="text-sm text-gray-600 mb-3">
          Changes made here will automatically sync to:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-white p-2 rounded">📖 Parent Portal</div>
          <div className="bg-white p-2 rounded">👩‍🏫 Teacher Portal</div>
          <div className="bg-white p-2 rounded">🏫 District Portal</div>
          <div className="bg-white p-2 rounded">⚙️ Super Admin</div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          * Open multiple portals to see real-time synchronization
        </div>
      </div>
    </motion.div>
  );
};