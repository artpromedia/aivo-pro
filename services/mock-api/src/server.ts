import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/courses', (req, res) => {
  res.json({
    data: [
      {
        id: '1',
        title: 'Elementary Math Foundations',
        level: 'K5',
        subject: 'Math',
        lessonsCount: 24,
        progress: 65,
        mentor: {
          name: 'Ms. Johnson',
          avatar: '/avatars/teacher1.jpg'
        }
      },
      {
        id: '2',
        title: 'Reading Comprehension',
        level: 'K5',
        subject: 'English',
        lessonsCount: 18,
        progress: 42,
        mentor: {
          name: 'Mr. Smith',
          avatar: '/avatars/teacher2.jpg'
        }
      }
    ]
  });
});

app.get('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({
    data: {
      userId,
      totalTimeSpent: 1250,
      lessonsCompleted: 15,
      assessmentsCompleted: 8,
      averageScore: 85,
      streak: 7,
      focusTime: 45
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});