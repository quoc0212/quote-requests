import { pool } from './database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function migrate(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Quote requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quote_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        -- Step 1: Contact Info
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company_name VARCHAR(255),
        -- Step 2: Services
        services TEXT[] NOT NULL DEFAULT '{}',
        other_service TEXT,
        -- Step 3: Project Details
        timeline VARCHAR(100),
        budget VARCHAR(100),
        -- Step 4: Additional Info
        project_description TEXT,
        additional_notes TEXT,
        -- Status
        email_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        email_sent_at TIMESTAMPTZ,
        -- Tracking
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Tracking events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tracking_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        page VARCHAR(255),
        user_agent TEXT,
        ip_address VARCHAR(50),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Seed default admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const hash = await bcrypt.hash(adminPassword, 12);

    await client.query(`
      INSERT INTO admins (email, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (email) DO NOTHING;
    `, [adminEmail, hash]);

    await client.query('COMMIT');
    console.log('Migration completed successfully');
    console.log(`Admin seeded: ${adminEmail}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(() => process.exit(1));
