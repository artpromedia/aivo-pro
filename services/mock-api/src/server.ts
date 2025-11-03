import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import childrenRoutes from './routes/children.js';

// Import middleware
import { errorHandler, requestLogger } from './middleware/auth.js';

// Import database
import { initializeDatabase } from './database/seed.js';

// Load environment variables
dotenv.config();

// WebSocket connections
const wsConnections = new Map<string, WebSocket>();

// Initialize Express app
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5179'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// WebSocket handling
wss.on('connection', (ws: WebSocket, req) => {
  const url = new URL(req.url || '', 'http://localhost');
  const userId = url.searchParams.get('userId');
  
  if (userId) {
    wsConnections.set(userId, ws);
    console.log(`WebSocket connected for user: ${userId}`);
  }

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleWebSocketMessage(ws, message, userId || undefined);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    if (userId) {
      wsConnections.delete(userId);
      console.log(`WebSocket disconnected for user: ${userId}`);
    }
  });
});

const handleWebSocketMessage = (ws: WebSocket, message: any, userId?: string) => {
  switch (message.type) {
    case 'focus-update':
      broadcast('focus-update', {
        userId,
        focusScore: message.focusScore,
        timestamp: new Date().toISOString()
      });
      break;
    
    case 'progress-update':
      broadcast('progress-update', {
        userId,
        progress: message.progress,
        timestamp: new Date().toISOString()
      });
      break;
    
    case 'join-session':
      ws.send(JSON.stringify({
        type: 'session-joined',
        sessionId: message.sessionId
      }));
      break;
  }
};

const broadcast = (type: string, data: any) => {
  const message = JSON.stringify({ type, data });
  wsConnections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: 'connected',
      websocket: 'active'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);

// Additional API endpoints for quick testing
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

// Error handling middleware
app.use(errorHandler);

// Initialize database
initializeDatabase();

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 AIVO Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/mfa/setup`);
  console.log(`   GET  /api/auth/me`);
  console.log(`   GET  /api/children`);
  console.log(`   POST /api/children`);
  console.log(`   GET  /api/children/:childId`);
  console.log(`   GET  /api/children/:childId/progress`);
  console.log(`   GET  /api/courses`);
  console.log(`   GET  /api/progress/:userId`);
});

