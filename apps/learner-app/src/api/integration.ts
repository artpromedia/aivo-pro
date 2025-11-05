import { Router } from 'express';

const router = Router();

// Simulate child registration from parent portal
router.post('/api/children/register', (req, res) => {
  const { parentId, childName, age, grade } = req.body;
  
  // Generate child ID
  const childId = `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create child profile
  const childProfile = {
    id: childId,
    name: childName,
    age: parseInt(age),
    grade,
    parentId,
    status: 'registered',
    createdAt: new Date().toISOString()
  };
  
  // In a real app, this would be saved to database
  console.log('Child registered:', childProfile);
  
  // Return baseline assessment URL
  const baselineAssessmentUrl = `http://localhost:5179?childId=${childId}&parentId=${parentId}&childName=${encodeURIComponent(childName)}&age=${age}&grade=${encodeURIComponent(grade)}`;
  
  res.json({
    success: true,
    childId,
    message: 'Child registered successfully',
    nextStep: 'baseline_assessment',
    redirectUrl: baselineAssessmentUrl
  });
});

// Simulate baseline assessment completion webhook
router.post('/api/baseline/complete', (req, res) => {
  const { childId, results } = req.body;
  
  console.log('Baseline assessment completed for child:', childId);
  console.log('Results:', results);
  
  // Generate learner app URL with results
  const learnerAppUrl = `http://localhost:5176?childId=${childId}&baselineComplete=true&results=${encodeURIComponent(JSON.stringify(results))}`;
  
  res.json({
    success: true,
    message: 'Baseline assessment processed',
    nextStep: 'personalized_learning',
    redirectUrl: learnerAppUrl
  });
});

// Get child profile
router.get('/api/children/:childId', (req, res) => {
  const { childId } = req.params;
  
  // In a real app, this would fetch from database
  const mockProfile = {
    id: childId,
    name: 'Demo Child',
    age: 8,
    grade: '2nd Grade',
    parentId: 'parent_123',
    baselineResults: {
      mathLevel: 7,
      readingLevel: 8,
      scienceLevel: 6,
      learningStyle: 'visual',
      interests: ['animals', 'space', 'art'],
      strengths: ['problem-solving', 'creativity'],
      needsImprovement: ['focus', 'following-instructions']
    },
    aiModelCloned: true,
    personalizedContent: {
      difficulty: 'intermediate',
      preferredActivities: ['videos', 'interactive-games', 'diagrams'],
      customCurriculum: []
    }
  };
  
  res.json(mockProfile);
});

export default router;