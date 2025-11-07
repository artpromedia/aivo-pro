import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, TrendingUp, Award, BookOpen, CheckCircle } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { useParentStore } from '../stores/parentStore';
import type { Activity } from '../stores/parentStore';

interface ActivityFeedProps {
  limit?: number;
  childId?: string;
}

// Mock API function
const fetchActivities = async (_childId?: string): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          childId: '1',
          childName: 'Emma Chen',
          type: 'lesson_completed',
          title: 'Mathematics Lesson Completed',
          description: 'Fractions and Decimals - 8/10 tasks correct',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          subject: 'Mathematics',
          score: 80,
          icon: '📚',
        },
        {
          id: '2',
          childId: '2',
          childName: 'Marcus Johnson',
          type: 'skill_mastered',
          title: 'New Skill Mastered',
          description: 'Reading Comprehension - 95% accuracy achieved',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
          subject: 'Language Arts',
          score: 95,
          icon: '🏆',
        },
        {
          id: '3',
          childId: '1',
          childName: 'Emma Chen',
          type: 'achievement_unlocked',
          title: 'Achievement Unlocked',
          description: 'Weekly learning goal completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          subject: 'General',
          icon: '🎖️',
        },
        {
          id: '4',
          childId: '2',
          childName: 'Marcus Johnson',
          type: 'homework_submitted',
          title: 'Homework Submitted',
          description: 'Science worksheet submitted on time',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
          subject: 'Science',
          score: 88,
          icon: '📝',
        },
        {
          id: '5',
          childId: '1',
          childName: 'Emma Chen',
          type: 'lesson_completed',
          title: 'Reading Session Completed',
          description: 'Chapter 4 - Character analysis understood',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
          subject: 'German Language',
          score: 75,
          icon: '📖',
        },
      ]);
    }, 300);
  });
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 10, childId }) => {
  const { activities, setActivities } = useParentStore();

  const { data: fetchedActivities, isLoading } = useQuery({
    queryKey: ['activities', childId],
    queryFn: () => fetchActivities(childId),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Update store when data changes
  React.useEffect(() => {
    if (fetchedActivities) {
      setActivities(fetchedActivities);
    }
  }, [fetchedActivities, setActivities]);

  const displayActivities = (fetchedActivities || activities)
    .filter(activity => !childId || activity.childId === childId)
    .slice(0, limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-600">No activities yet</p>
        <p className="text-sm text-gray-500">Activities will appear here when children start learning</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayActivities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
      
      {displayActivities.length === limit && (
        <div className="text-center pt-4">
          <Link 
            to="/analytics"
            className="bg-white/80 backdrop-blur-sm border-2 border-coral-200 text-coral-600 px-6 py-3 rounded-xl font-semibold hover:bg-coral-50 hover:border-coral-300 transition-all shadow-sm hover:shadow-md transform hover:scale-105 inline-block"
          >
            View All Activities
          </Link>
        </div>
      )}
    </div>
  );
};

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  const icon = getActivityIcon(activity.type);
  const timeAgo = formatDistance(new Date(activity.timestamp), new Date(), {
    addSuffix: true,
  });

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border">
        {React.createElement(icon.component, { 
          className: `w-4 h-4 ${icon.color}` 
        })}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.title}
          </p>
          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
            {timeAgo}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 mb-1">
          {activity.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {activity.childName} • {activity.subject || 'Allgemein'}
          </span>
          
          {activity.score && (
            <span className="text-xs font-medium text-green-600">
              {activity.score}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get activity icon
function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'lesson_completed':
      return { component: BookOpen, color: 'text-blue-600' };
    case 'skill_mastered':
      return { component: Award, color: 'text-purple-600' };
    case 'achievement_unlocked':
      return { component: Award, color: 'text-yellow-600' };
    case 'homework_submitted':
      return { component: CheckCircle, color: 'text-green-600' };
    default:
      return { component: TrendingUp, color: 'text-gray-600' };
  }
}