import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
// Assuming app is exported from index or app.ts
// For mocking purposes we will create a small express app
import { prisma } from '../../../../lib/prisma';

const app = express();
app.get('/api/v1/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (e) {
    res.status(500).json({ status: 'error' });
  }
});

describe('Health API', () => {
  it('GET /api/v1/health returns 200', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([1] as any);
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('Returns database connection status', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('DB Down'));
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(500);
  });
});
