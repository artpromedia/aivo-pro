import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { database } from '../database/seed';
import { Child } from '../database/types';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';

const router = Router();

// Get all children for authenticated parent
router.get('/', authenticateToken, requireRole('parent'), (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const user = database.users.get(userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const children = user.children?.map(childId => {
      const child = database.children.get(childId);
      return child;
    }).filter(Boolean) || [];

    res.json({ data: children });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific child
router.get('/:childId', authenticateToken, (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const userId = (req as AuthenticatedRequest).user?.userId;
    const user = database.users.get(userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has access to this child
    if (user.role === 'parent' && !user.children?.includes(childId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const child = database.children.get(childId);
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    res.json({ data: child });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new child
router.post('/', authenticateToken, requireRole('parent'), (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const user = database.users.get(userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { firstName, lastName, dateOfBirth, grade } = req.body;
    const childId = uuidv4();

    const newChild: Child = {
      id: childId,
      parentId: userId!,
      firstName,
      lastName,
      dateOfBirth,
      grade,
      avatar: faker.image.avatar(),
      learningProfile: {
        interests: [],
        learningStyle: 'mixed',
        focusLevel: 7,
        motivation: []
      },
      progressHistory: []
    };

    database.children.set(childId, newChild);
    user.children?.push(childId);

    res.status(201).json({ data: newChild });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update child profile
router.put('/:childId', authenticateToken, requireRole('parent'), (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const userId = (req as AuthenticatedRequest).user?.userId;
    const user = database.users.get(userId!);
    
    if (!user || !user.children?.includes(childId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const child = database.children.get(childId);
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Update child data
    const updatedChild = {
      ...child,
      ...req.body,
      id: childId, // Ensure ID cannot be changed
      parentId: userId // Ensure parent cannot be changed
    };

    database.children.set(childId, updatedChild);

    res.json({ data: updatedChild });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update learning profile
router.put('/:childId/learning-profile', authenticateToken, requireRole('parent'), (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const userId = (req as AuthenticatedRequest).user?.userId;
    const user = database.users.get(userId!);
    
    if (!user || !user.children?.includes(childId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const child = database.children.get(childId);
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Update learning profile
    child.learningProfile = {
      ...child.learningProfile,
      ...req.body
    };

    database.children.set(childId, child);

    res.json({ data: child });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get child's progress summary
router.get('/:childId/progress', authenticateToken, (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const { timeframe = '30d' } = req.query;
    
    const child = database.children.get(childId);
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    const days = parseInt(timeframe.toString().replace('d', ''));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentProgress = child.progressHistory.filter(
      entry => new Date(entry.date) >= cutoffDate
    );

    const progress = {
      totalTimeSpent: recentProgress.reduce((sum, entry) => sum + entry.timeSpent, 0),
      averageFocusScore: recentProgress.length > 0 
        ? recentProgress.reduce((sum, entry) => sum + entry.focusScore, 0) / recentProgress.length
        : 0,
      skillsImproved: [...new Set(recentProgress.flatMap(entry => entry.skillsImproved))],
      activitiesCompleted: recentProgress.reduce((sum, entry) => sum + entry.activitiesCompleted, 0),
      progressTrend: calculateTrend(recentProgress),
      subjectBreakdown: calculateSubjectBreakdown(recentProgress),
      weeklyProgress: calculateWeeklyProgress(recentProgress)
    };

    res.json({ data: progress });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
const calculateTrend = (progress: any[]) => {
  if (progress.length < 2) return 'stable';
  
  const recent = progress.slice(-7);
  const earlier = progress.slice(-14, -7);
  
  if (recent.length === 0 || earlier.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum: number, entry: any) => sum + entry.focusScore, 0) / recent.length;
  const earlierAvg = earlier.reduce((sum: number, entry: any) => sum + entry.focusScore, 0) / earlier.length;
  
  if (recentAvg > earlierAvg + 0.1) return 'improving';
  if (recentAvg < earlierAvg - 0.1) return 'declining';
  return 'stable';
};

const calculateSubjectBreakdown = (progress: any[]) => {
  const breakdown: Record<string, any> = {};
  
  progress.forEach(entry => {
    if (!breakdown[entry.subject]) {
      breakdown[entry.subject] = {
        timeSpent: 0,
        activities: 0,
        averageFocus: 0,
        sessions: 0
      };
    }
    
    breakdown[entry.subject].timeSpent += entry.timeSpent;
    breakdown[entry.subject].activities += entry.activitiesCompleted;
    breakdown[entry.subject].averageFocus += entry.focusScore;
    breakdown[entry.subject].sessions += 1;
  });
  
  // Calculate averages
  Object.values(breakdown).forEach((subject: any) => {
    subject.averageFocus /= subject.sessions;
  });
  
  return breakdown;
};

const calculateWeeklyProgress = (progress: any[]) => {
  const weeks: Record<string, any> = {};
  
  progress.forEach(entry => {
    const date = new Date(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        week: weekKey,
        timeSpent: 0,
        activities: 0,
        averageFocus: 0,
        sessions: 0
      };
    }
    
    weeks[weekKey].timeSpent += entry.timeSpent;
    weeks[weekKey].activities += entry.activitiesCompleted;
    weeks[weekKey].averageFocus += entry.focusScore;
    weeks[weekKey].sessions += 1;
  });
  
  // Calculate averages and convert to array
  return Object.values(weeks).map((week: any) => ({
    ...week,
    averageFocus: week.averageFocus / week.sessions
  })).sort((a, b) => a.week.localeCompare(b.week));
};

export default router;