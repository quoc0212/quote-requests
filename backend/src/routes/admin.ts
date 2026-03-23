import { Router, Request, Response } from 'express';
import { pool } from '../db/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All admin routes require auth
router.use(authMiddleware);

// GET /api/admin/quotes – List all quote requests (with optional filters)
router.get('/quotes', async (req: Request, res: Response): Promise<void> => {
  const { search, service, start_date, end_date, page = '1', limit = '20' } = req.query as Record<string, string>;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (search) {
    conditions.push(`(name ILIKE $${paramIdx} OR email ILIKE $${paramIdx} OR company_name ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  if (service) {
    conditions.push(`$${paramIdx} = ANY(services)`);
    params.push(service);
    paramIdx++;
  }

  if (start_date) {
    conditions.push(`created_at >= $${paramIdx}`);
    params.push(start_date);
    paramIdx++;
  }

  if (end_date) {
    conditions.push(`DATE(created_at) <= $${paramIdx}`);
    params.push(end_date);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM quote_requests ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(limitNum, offset);
    const result = await pool.query(
      `SELECT * FROM quote_requests ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      params
    );

    res.json({
      data: result.rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        total_pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('Admin list quotes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/quotes/:id – Get single quote
router.get('/quotes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM quote_requests WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Admin get quote error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats – Dashboard summary stats
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [total, byService, byStatus, recent] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM quote_requests'),
      pool.query(`
        SELECT unnest(services) as service, COUNT(*) as count
        FROM quote_requests
        GROUP BY service ORDER BY count DESC
      `),
      pool.query(`
        SELECT email_status, COUNT(*) as count
        FROM quote_requests
        GROUP BY email_status
      `),
      pool.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM quote_requests
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) ORDER BY date
      `),
    ]);

    res.json({
      total: parseInt(total.rows[0].total),
      by_service: byService.rows,
      by_status: byStatus.rows,
      recent_30_days: recent.rows,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
