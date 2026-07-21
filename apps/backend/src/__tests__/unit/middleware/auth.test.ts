import { describe, it, expect, vi } from 'vitest';
import { authMiddleware, requireRole } from '../../../../middleware/auth';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };
  const next = vi.fn();

  it('Allows valid JWT', () => {
    process.env.JWT_SECRET = 'secret';
    const token = jwt.sign({ id: 'user1', role: 'ADMIN' }, 'secret');
    const req: any = { headers: { authorization: `Bearer ${token}` } };

    authMiddleware(req, res, next);
    expect(req.user.id).toBe('user1');
    expect(next).toHaveBeenCalled();
  });

  it('Rejects expired JWT', () => {
    process.env.JWT_SECRET = 'secret';
    const token = jwt.sign({ id: 'user1' }, 'secret', { expiresIn: '-1h' });
    const req: any = { headers: { authorization: `Bearer ${token}` } };

    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Rejects invalid JWT', () => {
    const req: any = { headers: { authorization: `Bearer invalid.token.here` } };
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('requireRole allows matching role', () => {
    const req: any = { user: { role: 'ADMIN' } };
    const middleware = requireRole(['ADMIN']);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('requireRole rejects non-matching role', () => {
    const req: any = { user: { role: 'USER' } };
    const middleware = requireRole(['ADMIN']);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
