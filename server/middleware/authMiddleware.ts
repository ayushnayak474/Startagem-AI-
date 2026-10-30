import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'stratagem_ai_jwt_secret_key_prod_2026_secure';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  organization: string;
  roleTitle: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication required. Missing Bearer token.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, error: 'Invalid or expired session token.' });
  }
}

export function generateToken(user: { id: string; email: string; full_name?: string; fullName?: string; organization?: string; role_title?: string; roleTitle?: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.full_name || user.fullName || 'Strategist',
      organization: user.organization || 'Independent Workspace',
      roleTitle: user.role_title || user.roleTitle || 'Decision Strategist'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
