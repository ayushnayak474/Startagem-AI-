import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { generateToken, authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/schemas.js';
import { seedDemoData } from '../db/seedDemo.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const normalizedEmail = validated.email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rowCount > 0) {
      res.status(409).json({ success: false, error: 'A strategist account with this email already exists.' });
      return;
    }

    // Hash password with 12 rounds
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const insertRes = await db.query(
      `INSERT INTO users (full_name, email, password_hash, organization, role_title, default_risk_appetite)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name, email, organization, role_title, default_risk_appetite, created_at`,
      [
        validated.fullName.trim(),
        normalizedEmail,
        passwordHash,
        validated.organization?.trim() || 'Independent Workspace',
        validated.roleTitle?.trim() || 'Decision Strategist',
        validated.defaultRiskAppetite || 'BALANCED'
      ]
    );

    const user = insertRes.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          organization: user.organization,
          roleTitle: user.role_title,
          defaultRiskAppetite: user.default_risk_appetite,
          createdAt: user.created_at
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const normalizedEmail = validated.email.trim().toLowerCase();

    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (userRes.rowCount === 0) {
      res.status(401).json({ success: false, error: 'Invalid credentials. User not found.' });
      return;
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(validated.password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid credentials. Password incorrect.' });
      return;
    }

    const token = generateToken(user);
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          organization: user.organization,
          roleTitle: user.role_title,
          defaultRiskAppetite: user.default_risk_appetite,
          createdAt: user.created_at
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/demo
router.post('/demo', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    await seedDemoData();
    const demoEmail = 'demo@stratagem.ai';
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [demoEmail]);

    if (userRes.rowCount === 0) {
      res.status(500).json({ success: false, error: 'Failed to initialize demo strategist profile.' });
      return;
    }

    const user = userRes.rows[0];
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          organization: user.organization,
          roleTitle: user.role_title,
          defaultRiskAppetite: user.default_risk_appetite,
          createdAt: user.created_at
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userRes = await db.query('SELECT id, full_name, email, organization, role_title, default_risk_appetite, created_at FROM users WHERE id = $1', [req.user!.id]);
    if (userRes.rowCount === 0) {
      res.status(404).json({ success: false, error: 'User profile not found.' });
      return;
    }

    const u = userRes.rows[0];
    res.json({
      success: true,
      data: {
        user: {
          id: u.id,
          fullName: u.full_name,
          email: u.email,
          organization: u.organization,
          roleTitle: u.role_title,
          defaultRiskAppetite: u.default_risk_appetite,
          createdAt: u.created_at
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const validated = updateProfileSchema.parse(req.body);
    const updateRes = await db.query(
      `UPDATE users SET full_name = $1, organization = $2, role_title = $3, default_risk_appetite = $4, updated_at = NOW()
       WHERE id = $5 RETURNING id, full_name, email, organization, role_title, default_risk_appetite, updated_at`,
      [
        validated.fullName.trim(),
        validated.organization?.trim() || 'Independent Workspace',
        validated.roleTitle?.trim() || 'Decision Strategist',
        validated.defaultRiskAppetite,
        req.user!.id
      ]
    );

    if (updateRes.rowCount === 0) {
      res.status(404).json({ success: false, error: 'User profile not found.' });
      return;
    }

    const u = updateRes.rows[0];
    res.json({
      success: true,
      data: {
        user: {
          id: u.id,
          fullName: u.full_name,
          email: u.email,
          organization: u.organization,
          roleTitle: u.role_title,
          defaultRiskAppetite: u.default_risk_appetite,
          updatedAt: u.updated_at
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
