# Quotify — Multi-Step Quote Request App

A responsive multi-step landing page for collecting project quote requests, with a Node.js/TypeScript backend API (PostgreSQL), and a React admin dashboard.

---

## Project Structure

```
quote-app/
├── backend/          # Node.js + TypeScript API (Express + PostgreSQL)
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   ├── db/
│   │   │   ├── database.ts   # PostgreSQL connection pool
│   │   │   └── migrate.ts    # Schema migration + admin seed
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── quotes.ts     # POST /quotes, GET /quotes/:id/email-status, POST /quotes/:id/retry-email, GET /quotes/:id/report
│   │   │   ├── auth.ts       # POST /auth/login
│   │   │   ├── admin.ts      # GET /admin/quotes, GET /admin/quotes/:id, GET /admin/stats
│   │   │   └── tracking.ts   # POST /tracking
│   │   ├── services/
│   │   │   └── emailService.ts  # Nodemailer confirmation email
│   │   └── types/
│   │       └── index.ts      # Shared TypeScript interfaces
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/         # React + TypeScript SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── Stepper.tsx
    │   │   ├── QuoteDetailModal.tsx
    │   │   └── steps/
    │   │       ├── Step1.tsx   # Contact information
    │   │       ├── Step2.tsx   # Service selection (with dynamic "Other")
    │   │       ├── Step3.tsx   # Timeline & Budget
    │   │       ├── Step4.tsx   # Project description + submit
    │   │       └── Step5.tsx   # Email status polling + report link
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── hooks/
    │   │   └── useTracking.ts
    │   ├── i18n/
    │   │   ├── en.json         # English translations
    │   │   ├── vi.json         # Vietnamese translations
    │   │   └── index.ts
    │   ├── pages/
    │   │   ├── HomePage.tsx
    │   │   ├── ReportPage.tsx
    │   │   └── admin/
    │   │       ├── AdminPage.tsx
    │   │       ├── AdminLogin.tsx
    │   │       └── AdminDashboard.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── styles/
    │   │   └── global.css      # Pure CSS (no Tailwind/Bootstrap)
    │   └── types/
    │       └── form.ts
    ├── .env.example
    ├── package.json
    └── tsconfig.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** ≥ 14 (running locally or via Docker)

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd quote-app
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in your values:

| Variable         | Description                            | Default                                     |
| ---------------- | -------------------------------------- | ------------------------------------------- |
| `PORT`           | API server port                        | `4000`                                      |
| `DB_HOST`        | PostgreSQL host                        | `localhost`                                 |
| `DB_PORT`        | PostgreSQL port                        | `5432`                                      |
| `DB_NAME`        | Database name                          | `quote_app`                                 |
| `DB_USER`        | Database user                          | `postgres`                                  |
| `DB_PASSWORD`    | Database password                      | `postgres`                                  |
| `JWT_SECRET`     | Secret for signing JWTs (change this!) | `your_jwt_secret_change_this_in_production` |
| `ADMIN_EMAIL`    | Initial admin email                    | `admin@example.com`                         |
| `ADMIN_PASSWORD` | Initial admin password                 | `Admin@1234`                                |
| `EMAIL_HOST`     | SMTP host                              | `smtp.gmail.com`                            |
| `EMAIL_PORT`     | SMTP port                              | `587`                                       |
| `EMAIL_USER`     | SMTP username / sender address         | —                                           |
| `EMAIL_PASS`     | SMTP password / app password           | —                                           |
| `EMAIL_FROM`     | From address in emails                 | same as `EMAIL_USER`                        |
| `FRONTEND_URL`   | Allowed CORS origin                    | `http://localhost:3000`                     |

#### Gmail setup (for email sending)

If using Gmail, generate an **App Password** (requires 2-Step Verification enabled):

1. Go to Google Account → Security → App Passwords
2. Generate a password for "Mail"
3. Use that password as `EMAIL_PASS`

### 3. Create the database and run migrations

```bash
# Create the database (if it doesn't exist)
psql -U postgres -c "CREATE DATABASE quote_app;"

# Run migrations (creates tables and seeds the default admin)
npm run migrate
```

The migration script creates three tables:

- `quote_requests` — stores all multi-step form submissions
- `tracking_events` — records user interaction events
- `admins` — admin accounts (seeded with credentials from `.env`)

### 4. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
```

The default `.env` points the frontend at `http://localhost:4000/api`. Change `REACT_APP_API_URL` if your backend runs on a different port or host.

### 5. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 6. Start both servers

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
# API available at http://localhost:4000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm start
# App available at http://localhost:3000
```

---

## Usage

### Public Form

Open **http://localhost:3000** in your browser. The 5-step quote request form is immediately accessible:

1. **Step 1** — Contact information (name, email, phone, company)
2. **Step 2** — Select services; choosing "Other" reveals a free-text field
3. **Step 3** — Project timeline and budget
4. **Step 4** — Project description and additional notes; click **Submit Request**
5. **Step 5** — Waits for the confirmation email to be sent (polled every 3 s); provides **Retry** on failure and **View Report** once sent

### Report Page

After a successful submission, navigate to **/report/:id** to view the full submission summary.

### Admin Dashboard

Navigate to **http://localhost:3000/admin**. Log in with the credentials set in `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

- **Quotes tab** — paginated table with search (name/email/company), service filter, and date range. Click **View** for the full detail modal.
- **Stats tab** — total submissions, emails sent, top service, service breakdown bar chart, and last-30-days activity chart.
- **Language toggle** — switch between English and Vietnamese.

---

## API Reference

All endpoints are prefixed with `/api`.

### Public

| Method | Path                       | Description                     |
| ------ | -------------------------- | ------------------------------- |
| `POST` | `/quotes`                  | Submit a new quote request      |
| `GET`  | `/quotes/:id/email-status` | Poll email delivery status      |
| `POST` | `/quotes/:id/retry-email`  | Retry email delivery            |
| `GET`  | `/quotes/:id/report`       | Retrieve the submission report  |
| `POST` | `/tracking`                | Record a user interaction event |
| `POST` | `/auth/login`              | Admin login → returns JWT       |

### Admin (requires `Authorization: Bearer <token>`)

| Method | Path                | Description                                |
| ------ | ------------------- | ------------------------------------------ |
| `GET`  | `/admin/quotes`     | List all quotes (search, filter, paginate) |
| `GET`  | `/admin/quotes/:id` | Get a single quote                         |
| `GET`  | `/admin/stats`      | Dashboard statistics                       |

### `POST /api/quotes` — Request body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555 0000",
  "company_name": "Acme Inc.",
  "services": ["Development", "Web Design"],
  "other_service": "",
  "timeline": "1-3 months",
  "budget": "$5,000 - $15,000",
  "project_description": "We need a new website...",
  "additional_notes": ""
}
```

---

## Database Schema

```sql
-- Quote requests
CREATE TABLE quote_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(50),
  company_name     VARCHAR(255),
  services         TEXT[]       NOT NULL DEFAULT '{}',
  other_service    TEXT,
  timeline         VARCHAR(100),
  budget           VARCHAR(100),
  project_description TEXT,
  additional_notes TEXT,
  email_status     VARCHAR(50)  NOT NULL DEFAULT 'pending',
  email_sent_at    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Tracking events
CREATE TABLE tracking_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   VARCHAR(255) NOT NULL,
  event_type   VARCHAR(100) NOT NULL,
  event_data   JSONB,
  page         VARCHAR(255),
  user_agent   TEXT,
  ip_address   VARCHAR(50),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admins
CREATE TABLE admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Build for Production

### Backend

```bash
cd backend
npm run build          # compiles TypeScript to dist/
npm start              # runs dist/index.js
```

### Frontend

```bash
cd frontend
npm run build          # produces an optimised build/ folder
```

Serve the `build/` folder with any static file server (nginx, serve, etc.).

---

## Environment Variables Summary

### Backend (`backend/.env`)

```
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=quote_app
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=change_this_secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@1234

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=you@gmail.com

FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)

```
REACT_APP_API_URL=http://localhost:4000/api
```

---

## Features

- **Multi-step form** (5 steps) with client-side validation (react-hook-form)
- **Dynamic "Other" service field** — appears only when "Other" is selected
- **Email polling** — Step 5 polls `/quotes/:id/email-status` every 3 s; retry button on failure
- **Bilingual UI** — English / Vietnamese (i18next with browser language detection)
- **User tracking** — page views, step completions, CTA clicks stored via `/api/tracking`
- **Admin dashboard** — protected by JWT; search, filter, paginate quotes; stats & charts
- **Pure CSS** — no CSS framework; fully responsive (mobile-first media queries)
- **PostgreSQL** — relational schema with UUID primary keys
- **Secure auth** — bcrypt password hashing, JWT tokens (8 h expiry), CORS restriction
