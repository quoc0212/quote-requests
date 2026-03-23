import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../db/database';

const router = Router();

// POST /api/tracking – Record a user interaction event
router.post(
  '/',
  [
    body('session_id').trim().notEmpty().withMessage('session_id is required'),
    body('event_type').trim().notEmpty().withMessage('event_type is required'),
    body('event_data').optional().isObject(),
    body('page').optional().trim(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { session_id, event_type, event_data, page } = req.body as {
      session_id: string;
      event_type: string;
      event_data?: Record<string, unknown>;
      page?: string;
    };

    const userAgent = req.headers['user-agent'] || null;
    // Get IP safely (X-Forwarded-For or remote address)
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const ipAddress = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : null;

    try {
      await pool.query(
        `INSERT INTO tracking_events (session_id, event_type, event_data, page, user_agent, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [session_id, event_type, event_data ? JSON.stringify(event_data) : null, page || null, userAgent, ipAddress]
      );
      res.status(201).json({ message: 'Event recorded' });
    } catch (err) {
      console.error('Tracking error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
