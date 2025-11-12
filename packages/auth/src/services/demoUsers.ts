/**
 * Demo Users for Testing and Investor Demos
 * Pre-seeded users for quick access without registration
 */

import { UserRole } from '../types/auth.types';

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo_parent_1',
    email: 'parent@demo.com',
    password: 'demo1234',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: UserRole.PARENT,
    emailVerified: true,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_teacher_1',
    email: 'teacher@demo.com',
    password: 'demo1234',
    firstName: 'Michael',
    lastName: 'Chen',
    role: UserRole.TEACHER,
    emailVerified: true,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_district_1',
    email: 'district@demo.com',
    password: 'demo1234',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: UserRole.DISTRICT_ADMIN,
    emailVerified: true,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_admin_1',
    email: 'admin@demo.com',
    password: 'demo1234',
    firstName: 'David',
    lastName: 'Smith',
    role: UserRole.SYSTEM_ADMIN,
    emailVerified: true,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Initialize demo users in local storage
 */
export function seedDemoUsers(): void {
  if (typeof window === 'undefined') return;
  
  const existingUsers = localStorage.getItem('aivo_users');
  if (!existingUsers) {
    localStorage.setItem('aivo_users', JSON.stringify(DEMO_USERS));
    console.log('✅ Demo users seeded successfully');
    console.log('Demo credentials:');
    DEMO_USERS.forEach(user => {
      console.log(`  ${user.role}: ${user.email} / ${user.password}`);
    });
  }
}

/**
 * Get demo credentials for display
 */
export function getDemoCredentials() {
  return DEMO_USERS.map(user => ({
    role: user.role,
    email: user.email,
    password: user.password,
    name: `${user.firstName} ${user.lastName}`,
  }));
}
