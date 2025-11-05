import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { 
  User, 
  Child, 
  Assessment, 
  LearningSession,
  ProgressEntry
} from './types.js';

// In-memory database
export const database = {
  users: new Map<string, User>(),
  children: new Map<string, Child>(),
  assessments: new Map<string, Assessment>(),
  sessions: new Map<string, LearningSession>(),
  suggestions: new Map<string, any[]>(),
};

// Initialize seed data
export const initializeDatabase = () => {
  // Create admin user
  const adminUser: User = {
    id: 'admin-1',
    email: 'admin@aivo.ai',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    profile: {
      firstName: 'System',
      lastName: 'Administrator',
      avatar: faker.image.avatar()
    },
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
  database.users.set(adminUser.id, adminUser);

  // Create test parent user
  const testParent: User = {
    id: 'parent-test',
    email: 'parent@example.com',
    password: bcrypt.hashSync('password', 10),
    role: 'parent',
    profile: {
      firstName: 'Maria',
      lastName: 'Schmidt',
      avatar: faker.image.avatar(),
      phone: '+1-555-123-4567',
      timezone: 'UTC-5'
    },
    children: [],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
  database.users.set(testParent.id, testParent);

  // Create sample parent users
  for (let i = 1; i <= 5; i++) {
    const parentUser: User = {
      id: `parent-${i}`,
      email: `parent${i}@example.com`,
      password: bcrypt.hashSync('password123', 10),
      role: 'parent',
      profile: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatar: faker.image.avatar(),
        phone: faker.phone.number(),
        timezone: 'UTC-5'
      },
      children: [],
      createdAt: faker.date.past().toISOString(),
      lastActive: faker.date.recent().toISOString()
    };
    database.users.set(parentUser.id, parentUser);
  }

  // Create sample children
  const subjects = ['math', 'reading', 'science', 'writing', 'social-studies'];
  const skills = {
    math: ['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'geometry'],
    reading: ['phonics', 'vocabulary', 'comprehension', 'fluency', 'decoding'],
    science: ['observation', 'hypothesis', 'experiments', 'classification', 'measurement'],
    writing: ['grammar', 'spelling', 'composition', 'handwriting', 'editing'],
    'social-studies': ['geography', 'history', 'civics', 'economics', 'culture']
  };

  database.users.forEach((user) => {
    if (user.role === 'parent') {
      // Create 1-3 children per parent
      const numChildren = faker.number.int({ min: 1, max: 3 });
      
      for (let j = 0; j < numChildren; j++) {
        const childId = `child-${user.id}-${j + 1}`;
        const gradeLevel = faker.number.int({ min: 1, max: 5 });
        
        // Generate skill vector
        const skillVector: Record<string, number> = {};
        subjects.forEach(subject => {
          skills[subject as keyof typeof skills].forEach(skill => {
            skillVector[`${subject}.${skill}`] = faker.number.float({ min: 0.2, max: 0.9, fractionDigits: 1 });
          });
        });

        const child: Child = {
          id: childId,
          parentId: user.id,
          firstName: faker.person.firstName(),
          lastName: user.profile.lastName,
          dateOfBirth: faker.date.birthdate({ min: 5, max: 12, mode: 'age' }).toISOString(),
          grade: `Grade ${gradeLevel}`,
          avatar: faker.image.avatar(),
          learningProfile: {
            interests: faker.helpers.arrayElements([
              'dinosaurs', 'space', 'animals', 'art', 'music', 'sports', 'cooking', 'nature', 'technology', 'books'
            ], { min: 2, max: 4 }),
            learningStyle: faker.helpers.arrayElement(['visual', 'auditory', 'kinesthetic', 'mixed']),
            focusLevel: faker.number.int({ min: 4, max: 9 }),
            motivation: faker.helpers.arrayElements([
              'achievements', 'social', 'exploration', 'mastery', 'creativity'
            ], { min: 1, max: 3 })
          },
          currentAssessment: {
            id: `assessment-${childId}`,
            progress: faker.number.int({ min: 20, max: 100 }),
            skillVector,
            recommendations: [
              'Focus on multiplication tables',
              'Practice reading comprehension',
              'Strengthen geometric concepts'
            ]
          },
          iepGoals: [],
          progressHistory: []
        };

        // Generate progress history
        for (let k = 0; k < 30; k++) {
          child.progressHistory.push({
            date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
            subject: faker.helpers.arrayElement(subjects),
            skillsImproved: faker.helpers.arrayElements(
              skills[faker.helpers.arrayElement(subjects) as keyof typeof skills], 
              { min: 1, max: 3 }
            ),
            timeSpent: faker.number.int({ min: 15, max: 120 }),
            activitiesCompleted: faker.number.int({ min: 1, max: 8 }),
            focusScore: faker.number.float({ min: 0.6, max: 1.0, fractionDigits: 1 })
          });
        }

        database.children.set(childId, child);
        user.children?.push(childId);
      }
    }
  });

  console.log('✅ Database initialized with seed data');
  console.log(`👥 Users: ${database.users.size}`);
  console.log(`👶 Children: ${database.children.size}`);
};