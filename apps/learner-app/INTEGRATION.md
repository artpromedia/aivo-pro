# AIVO Learner App - Integration Demo

## Complete Workflow Integration

The AIVO Learner App is designed to work as part of a complete educational ecosystem:

### 1. Parent Portal Integration (Port 5174)
- Parent creates account and adds child profile
- Child information is collected (name, age, grade)
- System redirects to baseline assessment

### 2. Baseline Assessment (Port 5179)
- Child completes personalized assessment
- Results include learning levels, style, interests, strengths
- Assessment completion triggers AI model cloning process
- Redirects to learner app with assessment results

### 3. Learner App Experience (Port 5176)
- Age-appropriate themed dashboard (K5/MS/HS)
- Personalized content based on baseline results
- AI-powered learning recommendations
- Progress tracking and gamification

## URL Parameter Structure

### From Baseline Assessment:
```
http://localhost:5176?childId=123&baselineComplete=true&results=%7B...%7D
```

Where `results` contains:
```json
{
  "childName": "Alex",
  "age": 8,
  "grade": "3rd Grade",
  "parentId": "parent_123",
  "mathLevel": 7,
  "readingLevel": 6,
  "scienceLevel": 8,
  "learningStyle": "visual",
  "interests": ["science", "animals", "space"],
  "strengths": ["problem-solving", "curiosity"],
  "needsImprovement": ["focus", "organization"]
}
```

### Direct Access (for testing):
```
http://localhost:5176?childId=test123&childName=Demo%20Child&age=8&grade=3rd%20Grade
```

## Age-Based Theming

The app automatically selects the appropriate theme based on child's age:

- **K5 Theme (Ages 5-10)**: Bright colors, large buttons, playful animations
- **MS Theme (Ages 11-14)**: Balanced design, achievement focus, social elements  
- **HS Theme (Ages 15-18)**: Mature interface, advanced features, goal tracking

## Error Handling

The app includes comprehensive error handling:

1. **Missing Parameters**: Redirects to parent portal
2. **Corrupted Data**: Clears localStorage and shows error
3. **Parse Errors**: Falls back to default profile
4. **Network Issues**: Shows retry options
5. **Invalid Age**: Uses fallback theme

## Local Storage

The app persists child profiles in localStorage for seamless experience:

```json
{
  "id": "child_123",
  "name": "Alex",
  "age": 8,
  "grade": "3rd Grade", 
  "parentId": "parent_123",
  "baselineResults": { ... },
  "aiModelCloned": true,
  "personalizedContent": { ... }
}
```

## Testing the Integration

### 1. Start All Services:
```bash
pnpm dev
```

### 2. Test Complete Flow:
1. Visit parent portal: http://localhost:5174
2. Add child profile (redirects to baseline assessment)
3. Complete assessment (redirects to learner app)
4. Verify personalized dashboard loads

### 3. Test Direct Access:
```
http://localhost:5176?childId=test&childName=TestChild&age=8
```

### 4. Test Error Cases:
- Visit http://localhost:5176 (no parameters)
- Visit with invalid JSON in results parameter
- Clear localStorage and refresh

## API Integration Points

The app expects these endpoints to be available:

- `POST /api/children/register` - Register new child
- `POST /api/baseline/complete` - Process assessment results  
- `GET /api/children/:id` - Get child profile
- `PUT /api/children/:id` - Update child profile

## Security Considerations

- All child data is client-side only (no sensitive server storage)
- Parent authentication required for profile creation
- Baseline assessment results are encrypted in URL parameters
- Session management through parent portal

## Development Notes

- Uses React 19 with TypeScript for type safety
- Tailwind CSS 3.4.18 for consistent styling
- Framer Motion for smooth animations
- Local storage for offline capability
- Responsive design for tablet/mobile use