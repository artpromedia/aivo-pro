/**
 * Speech Therapy Interface - Age Appropriate
 * Engaging speech practice with real-time feedback
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Alert,
  IconButton
} from '@mui/material';
import {
  Mic,
  Stop,
  PlayArrow,
  EmojiEvents,
  VolumeUp,
  Refresh
} from '@mui/icons-material';

interface SpeechTherapyProps {
  ageGroup: 'K-2' | '3-5' | '6-8' | '9-12';
  sessionId: string;
  childId: string;
}

interface Exercise {
  id: string;
  target_word: string;
  visual_cue: string;
  audio_example: string;
  instructions: string;
}

interface Feedback {
  accuracy: number;
  message: string;
  encouragement: string;
  stars: number;
}

export const SpeechTherapyInterface: React.FC<SpeechTherapyProps> = ({
  ageGroup,
  sessionId,
  childId
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [stars, setStars] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalExercises] = useState(10);
  const [completedExercises, setCompletedExercises] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  // Age-appropriate themes
  const themes = {
    'K-2': {
      background: 'linear-gradient(135deg, #FFE5B4 0%, #FFB6C1 100%)',
      character: '🦁',
      encouragement: ['Great job!', 'You\'re amazing!', 'Keep going!', 'Wow!'],
      color: '#FF7B5C'
    },
    '3-5': {
      background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)',
      character: '🚀',
      encouragement: ['Excellent!', 'You\'re improving!', 'Fantastic!', 'Super!'],
      color: '#4169E1'
    },
    '6-8': {
      background: 'linear-gradient(135deg, #9370DB 0%, #4169E1 100%)',
      character: '🎮',
      encouragement: ['Nice!', 'Getting better!', 'Well done!', 'Awesome!'],
      color: '#9370DB'
    },
    '9-12': {
      background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
      character: '🎯',
      encouragement: ['Good work!', 'Progress!', 'Keep it up!', 'Nice job!'],
      color: '#2196F3'
    }
  };
  
  const theme = themes[ageGroup];
  
  useEffect(() => {
    loadNextExercise();
  }, []);
  
  const loadNextExercise = async () => {
    try {
      const response = await fetch('/api/v1/speech/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childId,
          age: getAgeFromGroup(ageGroup),
          session_id: sessionId
        })
      });
      
      const data = await response.json();
      setCurrentExercise({
        id: Math.random().toString(),
        target_word: data.name || 'cat',
        visual_cue: '/images/placeholder-mouth.png',
        audio_example: '',
        instructions: data.description || 'Say the word clearly'
      });
    } catch (error) {
      console.error('Failed to load exercise:', error);
    }
  };
  
  const getAgeFromGroup = (group: string): number => {
    const ages = { 'K-2': 6, '3-5': 9, '6-8': 11, '9-12': 14 };
    return ages[group] || 6;
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await submitRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Please allow microphone access to use speech therapy');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const submitRecording = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.webm');
    formData.append('child_id', childId);
    formData.append('child_age', getAgeFromGroup(ageGroup).toString());
    formData.append('concerns', JSON.stringify(['articulation']));
    
    try {
      // Simulated feedback for demo
      const simulatedFeedback: Feedback = {
        accuracy: Math.random() * 0.3 + 0.7, // 70-100%
        message: 'Good pronunciation!',
        encouragement: theme.encouragement[Math.floor(Math.random() * theme.encouragement.length)],
        stars: Math.floor(Math.random() * 2) + 3 // 3-5 stars
      };
      
      setFeedback(simulatedFeedback);
      setStars(simulatedFeedback.stars);
      setCompletedExercises(prev => prev + 1);
      setProgress((completedExercises + 1) / totalExercises * 100);
      
      // Auto-advance after 3 seconds
      setTimeout(() => {
        setFeedback(null);
        loadNextExercise();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit recording:', error);
    }
  };
  
  const playExample = () => {
    // Play audio example (TTS or pre-recorded)
    const utterance = new SpeechSynthesisUtterance(currentExercise?.target_word);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };
  
  // Render age-appropriate interface
  if (ageGroup === 'K-2') {
    return (
      <Box sx={{
        background: theme.background,
        minHeight: '100vh',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Animated character guide */}
        <Box
          sx={{
            fontSize: '100px',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        >
          {theme.character}
        </Box>
        
        <Typography variant="h3" sx={{ mt: 2, mb: 3, color: '#333', fontWeight: 'bold' }}>
          Let's Practice Speaking!
        </Typography>
        
        {/* Progress bar */}
        <Box sx={{ width: '100%', maxWidth: 500, mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
            Exercise {completedExercises} of {totalExercises}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(255,255,255,0.5)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.color
              }
            }}
          />
        </Box>
        
        {currentExercise && !feedback && (
          <Card sx={{
            mt: 3,
            p: 3,
            backgroundColor: 'white',
            borderRadius: '30px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxWidth: 600,
            width: '100%'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                Say: <span style={{ color: theme.color }}>"{currentExercise.target_word}"</span>
              </Typography>
              
              {/* Visual cue */}
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                my: 3,
                gap: 2
              }}>
                <Box
                  component="img"
                  src={currentExercise.visual_cue}
                  alt="Mouth position"
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: '20px',
                    border: `4px solid ${theme.color}`,
                    objectFit: 'cover'
                  }}
                />
                
                <IconButton
                  onClick={playExample}
                  sx={{
                    backgroundColor: theme.color,
                    color: 'white',
                    width: 80,
                    height: 80,
                    '&:hover': {
                      backgroundColor: theme.color,
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <VolumeUp sx={{ fontSize: 40 }} />
                </IconButton>
              </Box>
              
              {/* Recording button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={isRecording ? stopRecording : startRecording}
                  sx={{
                    borderRadius: '50px',
                    py: 3,
                    px: 6,
                    fontSize: '28px',
                    fontWeight: 'bold',
                    backgroundColor: isRecording ? '#ff4444' : theme.color,
                    color: 'white',
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: isRecording ? '#cc0000' : theme.color,
                      transform: 'scale(1.05)'
                    },
                    animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.7 }
                    }
                  }}
                  startIcon={isRecording ? <Stop sx={{ fontSize: '40px !important' }} /> : <Mic sx={{ fontSize: '40px !important' }} />}
                >
                  {isRecording ? 'Stop' : 'Start'}
                </Button>
              </Box>
              
              {isRecording && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#ff4444', fontWeight: 'bold' }}>
                    🎤 Recording...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Feedback display */}
        {feedback && (
          <Card sx={{
            mt: 3,
            p: 4,
            backgroundColor: 'white',
            borderRadius: '30px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxWidth: 600,
            width: '100%',
            textAlign: 'center'
          }}>
            <Box sx={{ mb: 2 }}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '60px',
                    opacity: i < stars ? 1 : 0.2,
                    transition: 'opacity 0.3s',
                    display: 'inline-block',
                    margin: '0 5px'
                  }}
                >
                  ⭐
                </span>
              ))}
            </Box>
            
            <Typography variant="h3" sx={{ mb: 2, color: theme.color, fontWeight: 'bold' }}>
              {feedback.encouragement}
            </Typography>
            
            <Typography variant="h5" sx={{ color: '#555' }}>
              {feedback.message}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <LinearProgress
                variant="determinate"
                value={feedback.accuracy * 100}
                sx={{
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: feedback.accuracy > 0.8 ? '#4CAF50' : '#FFA500'
                  }
                }}
              />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {Math.round(feedback.accuracy * 100)}% Accuracy
              </Typography>
            </Box>
          </Card>
        )}
        
        {/* Star count */}
        <Box sx={{ mt: 4 }}>
          <Chip
            icon={<EmojiEvents />}
            label={`Total Stars: ${completedExercises * 4}`}
            sx={{
              fontSize: '24px',
              py: 3,
              px: 2,
              backgroundColor: 'white',
              fontWeight: 'bold',
              color: theme.color
            }}
          />
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
      <Typography variant="h4">Speech Therapy for {ageGroup}</Typography>
      {/* Similar structure adapted for age group */}
    </Box>
  );
};

export default SpeechTherapyInterface;
