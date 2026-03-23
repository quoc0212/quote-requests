import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../db/database';
import { sendQuoteConfirmationEmail } from '../services/emailService';

const router = Router();

const VALID_SERVICES = ['Development', 'Web Design', 'Marketing', 'Other'];

// POST /api/quotes – Submit a new quote request
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('phone').optional().trim(),
    body('company_name').optional().trim(),
    body('services')
      .isArray({ min: 1 })
      .withMessage('At least one service must be selected')
      .custom((services: string[]) => {
        for (const s of services) {
          if (!VALID_SERVICES.includes(s)) {
            throw new Error(`Invalid service: ${s}`);
          }
        }
        return true;
      }),
    body('other_service')
      .if(body('services').custom((s: string[]) => s.includes('Other')))
      .trim()
      .notEmpty()
      .withMessage('Please specify the custom service'),
    body('timeline').optional().trim(),
    body('budget').optional().trim(),
    body('project_description').optional().trim(),
    body('additional_notes').optional().trim(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      name, email, phone, company_name,
      services, other_service,
      timeline, budget, project_description, additional_notes,
    } = req.body as {
      name: string; email: string; phone?: string; company_name?: string;
      services: string[]; other_service?: string;
      timeline?: string; budget?: string;
      project_description?: string; additional_notes?: string;
    };

    try {
      const result = await pool.query(
        `INSERT INTO quote_requests
          (name, email, phone, company_name, services, other_service,
           timeline, budget, project_description, additional_notes, email_status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')
         RETURNING *`,
        [name, email, phone || null, company_name || null,
         services, other_service || null,
         timeline || null, budget || null,
         project_description || null, additional_notes || null]
      );

      const quote = result.rows[0];

      // Trigger email send asynchronously
      triggerEmailSend(quote.id, { name, email, services, other_service, timeline, budget, project_description, additional_notes });

      res.status(201).json({ id: quote.id, email_status: quote.email_status });
    } catch (err) {
      console.error('Create quote error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/quotes/:id/email-status – Poll email send status
router.get('/:id/email-status', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, email_status, email_sent_at FROM quote_requests WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quote not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get email status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/quotes/:id/retry-email – Retry sending email
router.post('/:id/retry-email', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM quote_requests WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quote not found' });
      return;
    }

    const quote = result.rows[0];
    if (quote.email_status === 'sent') {
      res.json({ message: 'Email already sent', email_status: 'sent' });
      return;
    }

    // Reset to pending and re-trigger
    await pool.query(
      "UPDATE quote_requests SET email_status='pending', updated_at=NOW() WHERE id=$1",
      [id]
    );

    triggerEmailSend(id, {
      name: quote.name, email: quote.email,
      services: quote.services, other_service: quote.other_service,
      timeline: quote.timeline, budget: quote.budget,
      project_description: quote.project_description,
      additional_notes: quote.additional_notes,
    });

    res.json({ message: 'Email retry initiated', email_status: 'pending' });
  } catch (err) {
    console.error('Retry email error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/quotes/:id/report – Get submission report
router.get('/:id/report', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM quote_requests WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Quote not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get report error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function triggerEmailSend(
  quoteId: string,
  data: {
    name: string; email: string; services: string[]; other_service?: string;
    timeline?: string; budget?: string; project_description?: string; additional_notes?: string;
  }
): void {
  // Mark as sending immediately
  pool.query(
    "UPDATE quote_requests SET email_status='sending', updated_at=NOW() WHERE id=$1",
    [quoteId]
  ).then(() => {
    return sendQuoteConfirmationEmail(data);
  }).then(() => {
    pool.query(
      "UPDATE quote_requests SET email_status='sent', email_sent_at=NOW(), updated_at=NOW() WHERE id=$1",
      [quoteId]
    ).catch(err => console.error('Update sent status error:', err));
  }).catch((err) => {
    console.error('Send email error:', err);
    pool.query(
      "UPDATE quote_requests SET email_status='failed', updated_at=NOW() WHERE id=$1",
      [quoteId]
    ).catch(e => console.error('Update failed status error:', e));
  });
}

export default router;
