/**
 * Social-Emotional Learning (SEL) Interface
 * Age-appropriate emotional intelligence activities
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Slider,
  Chip,
  Grid
} from '@mui/material';
import {
  Favorite,
  SentimentSatisfied,
  SentimentDissatisfied,
  LocalFlorist,
  Star
} from '@mui/icons-material';

interface SELInterfaceProps {
  ageGroup: 'K-2' | '3-5' | '6-8' | '9-12';
  childId: string;
}

interface EmotionOption {
  emoji: string;
  label: string;
  color: string;
}

interface Activity {
  name: string;
  description: string;
  duration: number;
  instructions: string[];
}

export const SELInterface: React.FC<SELInterfaceProps> = ({ ageGroup, childId }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  
  const themes = {
    'K-2': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    '3-5': {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    },
    '6-8': {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    },
    '9-12': {
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      color: '#43e97b'
    }
  };
  
  const theme = themes[ageGroup];
  
  const emotionOptions: EmotionOption[] = [
    { emoji: '😄', label: 'Happy', color: '#FFD700' },
    { emoji: '😊', label: 'Calm', color: '#90EE90' },
    { emoji: '😐', label: 'Okay', color: '#DDA0DD' },
    { emoji: '😢', label: 'Sad', color: '#87CEEB' },
    { emoji: '😠', label: 'Angry', color: '#FF6B6B' },
    { emoji: '😨', label: 'Scared', color: '#9370DB' },
    { emoji: '😖', label: 'Frustrated', color: '#FFA500' },
    { emoji: '😴', label: 'Tired', color: '#B0C4DE' }
  ];
  
  useEffect(() => {
    loadDailyActivity();
  }, []);
  
  useEffect(() => {
    if (showBreathing) {
      animateBreathing();
    }
  }, [showBreathing]);
  
  const loadDailyActivity = async () => {
    try {
      const response = await fetch('/api/v1/sel/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_age: getAgeFromGroup(ageGroup),
          previous_activities: []
        })
      });
      
      const data = await response.json();
      setCurrentActivity(data);
    } catch (error) {
      console.error('Failed to load activity:', error);
    }
  };
  
  const getAgeFromGroup = (group: string): number => {
    const ages = { 'K-2': 6, '3-5': 9, '6-8': 11, '9-12': 14 };
    return ages[group] || 6;
  };
  
  const handleEmotionSelect = async (emotion: string) => {
    setSelectedEmotion(emotion);
    
    // Submit check-in
    try {
      await fetch('/api/v1/sel/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childId,
          age: getAgeFromGroup(ageGroup),
          emotion: emotion,
          intensity: emotionIntensity
        })
      });
    } catch (error) {
      console.error('Failed to submit check-in:', error);
    }
  };
  
  const animateBreathing = () => {
    const phases = ['in', 'hold', 'out', 'hold'];
    const durations = [4000, 7000, 8000, 2000]; // 4-7-8 breathing
    let currentPhaseIndex = 0;
    
    const cycle = () => {
      if (!showBreathing) return;
      
      setBreathingPhase(phases[currentPhaseIndex] as any);
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      
      setTimeout(cycle, durations[currentPhaseIndex]);
    };
    
    cycle();
  };
  
  // K-2 Interface (Young children)
  if (ageGroup === 'K-2') {
    return (
      <Box sx={{
        background: theme.background,
        minHeight: '100vh',
        p: 3
      }}>
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            mb: 4,
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          How Are You Feeling?
        </Typography>
        
        {/* Emotion Check-in with big emojis */}
        {!selectedEmotion && (
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: '30px',
            p: 4,
            mb: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <Grid container spacing={3}>
              {emotionOptions.slice(0, 5).map((option, index) => (
                <Grid item xs={6} sm={4} md={2.4} key={index}>
                  <Button
                    onClick={() => handleEmotionSelect(option.label)}
                    sx={{
                      width: '100%',
                      height: 150,
                      fontSize: '80px',
                      borderRadius: '20px',
                      backgroundColor: selectedEmotion === option.label ? option.color : 'transparent',
                      border: `3px solid ${option.color}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: option.color,
                        transform: 'scale(1.1)'
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}
                  >
                    <Box>{option.emoji}</Box>
                    <Typography variant="h6" sx={{ fontSize: '16px', textTransform: 'none' }}>
                      {option.label}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Card>
        )}
        
        {/* Breathing Exercise with Animation */}
        {selectedEmotion && (
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: '30px',
            p: 4,
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              Let's Take Deep Breaths Together!
            </Typography>
            
            {!showBreathing && (
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowBreathing(true)}
                sx={{
                  backgroundColor: theme.color,
                  color: 'white',
                  py: 2,
                  px: 6,
                  fontSize: '24px',
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: theme.color,
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Start Breathing
              </Button>
            )}
            
            {showBreathing && (
              <Box>
                <Box
                  sx={{
                    width: breathingPhase === 'in' ? 250 : breathingPhase === 'out' ? 100 : 200,
                    height: breathingPhase === 'in' ? 250 : breathingPhase === 'out' ? 100 : 200,
                    borderRadius: '50%',
                    backgroundColor: theme.color,
                    margin: '0 auto',
                    transition: 'all ease-in-out',
                    transitionDuration: breathingPhase === 'in' ? '4s' : breathingPhase === 'hold' ? '0s' : '8s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 50px ${theme.color}`
                  }}
                >
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {breathingPhase === 'in' ? '👃' : breathingPhase === 'out' ? '💨' : '⏸️'}
                  </Typography>
                </Box>
                
                <Typography variant="h4" sx={{ mt: 4, fontWeight: 'bold', color: theme.color }}>
                  {breathingPhase === 'in' && 'Breathe In...'}
                  {breathingPhase === 'hold' && 'Hold...'}
                  {breathingPhase === 'out' && 'Breathe Out...'}
                </Typography>
                
                <Button
                  variant="outlined"
                  onClick={() => setShowBreathing(false)}
                  sx={{ mt: 3 }}
                >
                  Stop
                </Button>
              </Box>
            )}
          </Card>
        )}
        
        {/* Daily Activity */}
        {currentActivity && selectedEmotion && !showBreathing && (
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: '30px',
            p: 4,
            mt: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Star sx={{ fontSize: 40, color: '#FFD700', mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Today's Activity
              </Typography>
            </Box>
            
            <Typography variant="h5" sx={{ mb: 2, color: theme.color }}>
              {currentActivity.name}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '18px' }}>
              {currentActivity.description}
            </Typography>
            
            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '15px' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Instructions:</Typography>
              {currentActivity.instructions?.map((instruction, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  {index + 1}. {instruction}
                </Typography>
              ))}
            </Box>
          </Card>
        )}
        
        {/* Kindness garden or reward system */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: '30px',
            p: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <LocalFlorist sx={{ fontSize: 40, color: theme.color }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Kindness Garden
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <Box key={i} sx={{ fontSize: '30px' }}>🌸</Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    );
  }
  
  // Simplified rendering for other age groups
  return (
    <Box sx={{
      background: theme.background,
      minHeight: '100vh',
      p: 3
    }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
        Social-Emotional Learning for {ageGroup}
      </Typography>
      
      {/* Mood meter for older students */}
      <Card sx={{ p: 3, borderRadius: '20px' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Check In With Your Emotions
        </Typography>
        
        <Grid container spacing={2}>
          {emotionOptions.map((option, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Button
                fullWidth
                variant={selectedEmotion === option.label ? 'contained' : 'outlined'}
                onClick={() => handleEmotionSelect(option.label)}
                sx={{
                  py: 2,
                  fontSize: '40px',
                  borderColor: option.color,
                  color: selectedEmotion === option.label ? 'white' : option.color,
                  backgroundColor: selectedEmotion === option.label ? option.color : 'transparent'
                }}
              >
                {option.emoji}
              </Button>
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                {option.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
        
        {selectedEmotion && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              How intense is this feeling?
            </Typography>
            <Slider
              value={emotionIntensity}
              onChange={(_, value) => setEmotionIntensity(value as number)}
              min={1}
              max={10}
              marks
              valueLabelDisplay="on"
              sx={{ color: theme.color }}
            />
          </Box>
        )}
      </Card>
      
      {/* Reflection area for older students */}
      {selectedEmotion && ageGroup !== 'K-2' && (
        <Card sx={{ mt: 3, p: 3, borderRadius: '20px' }}>
          <Typography variant="h6" gutterBottom>
            What's contributing to this feeling?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Write about what you're experiencing..."
            sx={{ mt: 2 }}
          />
        </Card>
      )}
    </Box>
  );
};

export default SELInterface;
