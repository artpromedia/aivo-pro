# AIVO Mock API Service

A comprehensive mock backend service for the AIVO Learning Platform that provides realistic data and WebSocket support for development and testing.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.4+
- pnpm (installed via Turborepo)

### Installation & Running

```bash
# From the monorepo root
cd services/mock-api

# Install dependencies (handled by monorepo)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The API server will start on **http://localhost:3001** by default.

## 📋 API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/mfa/setup` - Setup MFA
- `POST /api/auth/mfa/verify` - Verify MFA code
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Children Management
- `GET /api/children` - Get all children for authenticated parent
- `POST /api/children` - Create new child
- `GET /api/children/:childId` - Get specific child
- `PUT /api/children/:childId` - Update child profile
- `PUT /api/children/:childId/learning-profile` - Update learning profile
- `GET /api/children/:childId/progress` - Get child progress

### Development Endpoints
- `GET /api/courses` - Sample courses data
- `GET /api/progress/:userId` - Sample progress data

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in requests:

```http
Authorization: Bearer <jwt_token>
```

### Default Test Accounts

**Admin Account:**
- Email: `admin@aivo.ai`
- Password: `admin123`

**Parent Accounts:**
- Email: `parent1@example.com` through `parent5@example.com`
- Password: `password123`

## 📊 Database

The service uses an in-memory database with realistic seed data:

- **Users**: 6 total (1 admin + 5 parents)
- **Children**: 9 total (1-3 children per parent)
- **Progress History**: 30 days of simulated learning data per child
- **Skill Vectors**: Detailed skill tracking across subjects

### Subjects & Skills

**Math**: addition, subtraction, multiplication, division, fractions, geometry
**Reading**: phonics, vocabulary, comprehension, fluency, decoding
**Science**: observation, hypothesis, experiments, classification, measurement
**Writing**: grammar, spelling, composition, handwriting, editing
**Social Studies**: geography, history, civics, economics, culture

## 🔌 WebSocket Support

The server provides real-time features via WebSocket connections at `ws://localhost:3001`.

### WebSocket Events

**Client → Server:**
```javascript
// Real-time focus tracking
{
  type: 'focus-update',
  focusScore: 0.85
}

// Progress updates
{
  type: 'progress-update',
  progress: { skillsImproved: ['math.addition'], timeSpent: 120 }
}

// Join collaborative session
{
  type: 'join-session',
  sessionId: 'session-123'
}
```

**Server → Client:**
```javascript
// Focus update broadcast
{
  type: 'focus-update',
  data: { userId: 'user-123', focusScore: 0.85, timestamp: '2024-01-01T00:00:00Z' }
}

// Progress update broadcast
{
  type: 'progress-update',
  data: { userId: 'user-123', progress: {...}, timestamp: '2024-01-01T00:00:00Z' }
}

// Session joined confirmation
{
  type: 'session-joined',
  sessionId: 'session-123'
}
```

## 📁 Project Structure

```
src/
├── server.ts              # Main server file
├── database/
│   ├── types.ts          # TypeScript interfaces
│   └── seed.ts           # Database initialization & seed data
├── routes/
│   ├── auth.ts           # Authentication endpoints
│   └── children.ts       # Children management endpoints
└── middleware/
    └── auth.ts           # Authentication middleware
```

## 🔧 Configuration

### Environment Variables

```bash
# Optional - defaults provided
PORT=3001
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

### CORS Configuration

The server is configured to accept requests from:
- http://localhost:5173 (Web app)
- http://localhost:5174 (Parent portal)
- http://localhost:5175 (Teacher portal) 
- http://localhost:5176 (Learner app)
- http://localhost:5179 (Baseline assessment)

## 📈 Features

### 🎯 Adaptive Assessment Engine
- **Baseline Assessments**: Grade-appropriate initial evaluations
- **Skill Vector Tracking**: Detailed progress across 25+ skill areas
- **Adaptive Questioning**: Dynamic difficulty adjustment
- **Confidence Scoring**: Response time and focus metrics

### 👥 Multi-Role Support
- **Parents**: Child management, progress tracking, learning profiles
- **Teachers**: Student oversight, assessment creation
- **Learners**: Personalized learning experiences
- **Admins**: System-wide management

### 🎮 Personalized Learning
- **Interest-Based Suggestions**: Activities tailored to child interests
- **Learning Style Adaptation**: Visual, auditory, kinesthetic, mixed
- **Focus Level Tracking**: Real-time engagement monitoring
- **Motivation Mapping**: Achievement, social, exploration, mastery, creativity

### 📊 Real-Time Analytics
- **Progress Tracking**: Daily learning metrics
- **Focus Monitoring**: Distraction detection and engagement scoring
- **Skill Development**: Granular progress across subjects
- **Trend Analysis**: Improving, stable, or declining patterns

## 🧪 Testing

### Manual Testing

**Login Test:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent1@example.com","password":"password123"}'
```

**Get Children Test:**
```bash
curl -X GET http://localhost:3001/api/children \
  -H "Authorization: Bearer <token_from_login>"
```

**Health Check:**
```bash
curl http://localhost:3001/health
```

### Response Examples

**Login Success:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "parent-1",
    "email": "parent1@example.com",
    "role": "parent",
    "profile": {
      "firstName": "John",
      "lastName": "Smith",
      "avatar": "https://cloudflare-ipfs.com/ipfs/..."
    },
    "children": ["child-parent-1-1", "child-parent-1-2"]
  }
}
```

**Children List:**
```json
{
  "data": [
    {
      "id": "child-parent-1-1",
      "firstName": "Emma",
      "lastName": "Smith",
      "grade": "Grade 3",
      "learningProfile": {
        "interests": ["dinosaurs", "art", "music"],
        "learningStyle": "visual",
        "focusLevel": 7,
        "motivation": ["achievements", "exploration"]
      },
      "currentAssessment": {
        "progress": 75,
        "skillVector": {
          "math.addition": 0.8,
          "reading.comprehension": 0.7
        }
      }
    }
  ]
}
```

## 🎨 Integration with Frontend

### Parent Portal Integration
```typescript
// Login example
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token, user } = await response.json();
localStorage.setItem('authToken', token);
```

### WebSocket Integration
```typescript
const ws = new WebSocket('ws://localhost:3001?userId=parent-1');

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  
  if (type === 'progress-update') {
    // Update UI with real-time progress
    updateProgressDisplay(data.progress);
  }
};

// Send focus updates
ws.send(JSON.stringify({
  type: 'focus-update',
  focusScore: 0.85
}));
```

## 📝 Development Notes

### Adding New Endpoints
1. Add route handler in appropriate file (`routes/auth.ts`, `routes/children.ts`)
2. Import and register route in `server.ts`
3. Update this README with endpoint documentation

### Database Modifications
- Modify interfaces in `database/types.ts`
- Update seed data generation in `database/seed.ts`
- Ensure migrations are handled for existing data

### Real-Time Features
- Add new WebSocket message types in `handleWebSocketMessage`
- Update client documentation for new events
- Test with multiple concurrent connections

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Check what's using the port
netstat -ano | findstr :3001

# Kill the process
taskkill /PID <process_id> /F
```

**CORS Errors:**
- Verify frontend URL is in CORS whitelist
- Check that requests include proper headers

**Authentication Failures:**
- Ensure JWT_SECRET matches across services
- Check token expiration (7 days default)
- Verify Authorization header format: `Bearer <token>`

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [WebSocket API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [Faker.js](https://fakerjs.dev/) - Test data generation

## 🤝 Contributing

When contributing to the mock API service:

1. Follow TypeScript strict mode requirements
2. Maintain realistic seed data patterns  
3. Document new endpoints in this README
4. Test WebSocket functionality with multiple clients
5. Ensure proper error handling and validation

---

**🎯 Ready for Development!** 

The mock API provides a complete backend simulation for the AIVO Learning Platform with authentication, real-time features, and extensive test data. Perfect for frontend development and integration testing.