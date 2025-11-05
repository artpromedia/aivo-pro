import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Edit3, LogOut, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface ProfileMenuProps {
  childProfile: ChildProfile;
  onProfileUpdate: (profile: Partial<ChildProfile>) => void;
  onLogout: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  childProfile, 
  onProfileUpdate, 
  onLogout 
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: childProfile.name,
    age: childProfile.age,
    grade: childProfile.grade
  });

  const getThemeFromAge = (age: number): string => {
    if (age >= 5 && age <= 10) return 'K-5 Theme';
    if (age >= 11 && age <= 14) return 'Middle School Theme';
    if (age >= 15 && age <= 18) return 'High School Theme';
    return 'K-5 Theme';
  };

  const handleSave = () => {
    onProfileUpdate(editForm);
    setIsEditing(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-3 border border-gray-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800">{childProfile.name}</p>
          <p className="text-xs text-gray-600">{getThemeFromAge(childProfile.age)}</p>
        </div>
        <Settings className="w-4 h-4 text-gray-600" />
      </motion.button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50"
        >
          {!isEditing ? (
            <>
              {/* Profile Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold">{childProfile.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-semibold">{childProfile.age} years old</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-semibold">{childProfile.grade}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-semibold text-purple-600">{getThemeFromAge(childProfile.age)}</span>
                  </div>
                  {childProfile.baselineResults && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Learning Style:</span>
                        <span className="font-semibold capitalize">{childProfile.baselineResults.learningStyle}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">AI Model:</span>
                        <span className="font-semibold text-green-600">
                          {childProfile.aiModelCloned ? 'Personalized ✨' : 'Standard'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  onClick={() => {
                    navigate('/profile-insights');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-purple-50 border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-700">AI Insights & Brain Map</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-gray-50 border border-gray-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Edit Profile</span>
                </motion.button>
                
                  <motion.button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-red-50 border border-red-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-700">Back to Parent Portal</span>
                </motion.button>
              </div>
            </>
          ) : (
            <>
              {/* Edit Form */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Profile</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      min="5"
                      max="18"
                      value={editForm.age}
                      onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input
                      type="text"
                      value={editForm.grade}
                      onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {editForm.age >= 5 && editForm.age <= 18 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        Theme will automatically switch to: 
                        <span className="font-semibold text-purple-600 ml-1">
                          {getThemeFromAge(editForm.age)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Actions */}
              <div className="flex gap-2">
                <motion.button
                  onClick={handleSave}
                  className="flex-1 py-2 px-4 bg-purple-600 text-white font-medium rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  Save Changes
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: childProfile.name,
                      age: childProfile.age,
                      grade: childProfile.grade
                    });
                  }}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  Cancel
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false);
            setIsEditing(false);
            setEditForm({
              name: childProfile.name,
              age: childProfile.age,
              grade: childProfile.grade
            });
          }}
        />
      )}
    </div>
  );
};