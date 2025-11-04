import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Award, MoreHorizontal, Play, Users, Eye, FileText } from 'lucide-react';
import type { Child } from '../stores/parentStore';
import { Button } from '@aivo/ui';

interface ChildCardProps {
  child: Child;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child }) => {
  const progressColor = getProgressColor(child.progress.overall);
  const gradeDisplay = child.grade === 0 ? 'K' : child.grade.toString();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02] group">
      <div className="block">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${progressColor.bg}`}>
              {child.avatar || '👤'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {child.firstName} {child.lastName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Grade {gradeDisplay}</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{getClassSize(child.grade)} Students</span>
                </div>
              </div>
            </div>
          </div>
          
          <Link 
            to={`/children/${child.id}/settings`}
            className="p-2.5 hover:bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-coral-300 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md group inline-block"
            title="Child Settings"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500 group-hover:text-coral-600" />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-900">
              {child.progress.overall}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${progressColor.bar} transition-all duration-1000`}
              style={{ width: `${child.progress.overall}%` }}
            />
          </div>
        </div>

        {/* Current Activity */}
        {child.currentActivity && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {child.currentActivity.subject}
                </p>
                <p className="text-xs text-blue-700">
                  {child.currentActivity.lesson}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  {child.currentActivity.timeSpent}m
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Clock}
            value={`${child.weeklyStats.hoursLearned}h`}
            label="This week"
            color="blue"
          />
          <StatCard
            icon={Award}
            value={child.weeklyStats.skillsMastered.toString()}
            label="Skills"
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            value={`${child.weeklyStats.avgScore}%`}
            label="Avg Score"
            color="green"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
          <Link 
            to={`/learner-app?childId=${child.id}`}
            className="flex-1 bg-gradient-to-r from-coral-500 to-purple-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:from-coral-600 hover:to-purple-600 flex items-center justify-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              // Navigate to learning app for this child
              window.open(`/learner-app?childId=${child.id}`, '_blank');
            }}
          >
            <Play className="w-4 h-4" />
            Start Learning
          </Link>
          
          <div className="flex gap-2">
            <Link 
              to={`/children/${child.id}/iep`}
              className="flex items-center justify-center bg-white border-2 border-purple-200 text-purple-600 px-4 py-3 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all hover:scale-105 shadow-sm hover:shadow-md"
              title="IEP Dashboard"
            >
              <FileText className="w-5 h-5" />
            </Link>
            
            <Link 
              to={`/children/${child.id}`}
              className="flex items-center justify-center bg-white border-2 border-coral-200 text-coral-600 px-4 py-3 rounded-xl hover:bg-coral-50 hover:border-coral-300 transition-all hover:scale-105 shadow-sm hover:shadow-md"
              title="View Profile"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard: React.FC<{
  icon: any;
  value: string;
  label: string;
  color: 'blue' | 'purple' | 'green';
}> = ({ icon: Icon, value, label, color }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-1">
        <Icon className={`w-4 h-4 ${colorClasses[color]}`} />
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
};

// Helper Functions
function getProgressColor(progress: number) {
  if (progress >= 90) {
    return { bg: 'bg-green-100', bar: 'bg-gradient-to-r from-green-500 to-emerald-500' };
  } else if (progress >= 70) {
    return { bg: 'bg-coral-100', bar: 'bg-gradient-to-r from-coral-500 to-salmon-500' };
  } else if (progress >= 50) {
    return { bg: 'bg-yellow-100', bar: 'bg-gradient-to-r from-yellow-500 to-orange-500' };
  } else {
    return { bg: 'bg-red-100', bar: 'bg-gradient-to-r from-red-500 to-pink-500' };
  }
}

function getClassSize(grade: number): number {
  // Mock class sizes based on grade
  const classSizes: Record<number, number> = {
    0: 18,  // Kindergarten
    1: 20,
    2: 22,
    3: 24,
    4: 25,
    5: 26,
    6: 27,
    7: 28,
    8: 28,
    9: 30,
    10: 28,
    11: 26,
    12: 24,
  };
  
  return classSizes[grade] || 25;
}