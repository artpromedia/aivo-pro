import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { database } from '../database/seed';
import { User } from '../database/types';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aivo-dev-secret-key';

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = Array.from(database.users.values()).find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if MFA is enabled
    if (user.mfa?.enabled) {
      const tempToken = jwt.sign({ userId: user.id, mfaPending: true }, JWT_SECRET, { expiresIn: '10m' });
      return res.json({
        mfaRequired: true,
        tempToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    // Update last active
    user.lastActive = new Date().toISOString();
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        children: user.children
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role = 'parent' } = req.body;
    
    // Check if user exists
    const existingUser = Array.from(database.users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser: User = {
      id: userId,
      email,
      password: hashedPassword,
      role: role as User['role'],
      profile: {
        firstName,
        lastName,
        avatar: faker.image.avatar()
      },
      children: role === 'parent' ? [] : undefined,
      students: role === 'teacher' ? [] : undefined,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    database.users.set(userId, newUser);

    // Generate token
    const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        role,
        profile: newUser.profile,
        children: newUser.children
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MFA Setup
router.post('/mfa/setup', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const user = database.users.get(userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const secret = speakeasy.generateSecret({
      name: `AIVO Learning (${user.email})`,
      issuer: 'AIVO Learning Platform'
    });

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Store MFA secret (not enabled yet)
    user.mfa = {
      secret: secret.base32,
      enabled: false,
      backupCodes
    };

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MFA Verify
router.post('/mfa/verify', async (req: Request, res: Response) => {
  try {
    const { tempToken, code } = req.body;
    
    // Verify temp token
    const decoded = jwt.verify(tempToken, JWT_SECRET) as any;
    if (!decoded.mfaPending) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = database.users.get(decoded.userId);
    if (!user || !user.mfa?.secret) {
      return res.status(404).json({ error: 'User not found or MFA not set up' });
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: user.mfa.secret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid MFA code' });
    }

    // Generate final token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    // Update last active
    user.lastActive = new Date().toISOString();
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        children: user.children
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const user = database.users.get(userId!);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        children: user.children,
        mfaEnabled: user.mfa?.enabled || false
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const role = (req as AuthenticatedRequest).user?.role;
    
    const newToken = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;