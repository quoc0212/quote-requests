# Quotify

> A full-stack, multi-step project quote request application with an admin dashboard, i18n support (EN / VI / FR), and analytics tracking.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518-339933?logo=nodedotjs)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%E2%89%A514-4169E1?logo=postgresql)](https://www.postgresql.org)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Configure the backend](#2-configure-the-backend)
  - [3. Set up the database](#3-set-up-the-database)
  - [4. Configure the frontend](#4-configure-the-frontend)
  - [5. Install dependencies](#5-install-dependencies)
  - [6. Run in development](#6-run-in-development)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Production Build](#production-build)
- [Features](#features)
- [Contributing](#contributing)

---

## Overview

Quotify lets potential clients submit a detailed project brief through a guided 4-step form. On submission, the backend stores the quote in PostgreSQL, sends a confirmation email, and exposes a shareable report link. A protected admin dashboard lets you search, filter, and analyse all incoming requests.

---

## Tech Stack

| Layer    | Technology                                                            |
| -------- | --------------------------------------------------------------------- |
| Frontend | React 18, TypeScript, react-hook-form, react-i18next, React Router v6 |
| Backend  | Node.js 18+, Express, TypeScript, express-validator                   |
| Database | PostgreSQL 14+ (UUID PKs, JSONB tracking data)                        |
| Auth     | bcrypt (password hashing), JSON Web Tokens (8 h)                      |
| Testing  | Jest, React Testing Library                                           |
| Styling  | Pure CSS — no framework, mobile-first                                 |

---

## Project Structure

```
quote-app/
├── backend/                    # Express + TypeScript API
│   ├── src/
│   │   ├── index.ts            # Server entry point
│   │   ├── db/
│   │   │   ├── database.ts     # PostgreSQL connection pool
│   │   │   └── migrate.ts      # Schema migrations & admin seed
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.ts         # POST /auth/login
│   │   │   ├── quotes.ts       # Quote CRUD + email-status polling
│   │   │   ├── admin.ts        # Protected admin endpoints
│   │   │   └── tracking.ts     # Analytics event ingestion
│   │   ├── services/
│   │   │   └── emailService.ts # Confirmation email (Nodemailer)
│   │   └── types/
│   │       └── index.ts        # Shared TypeScript interfaces
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # React SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Stepper.tsx
    │   │   ├── QuoteDetailModal.tsx
    │   │   └── steps/
    │   │       ├── Step1.tsx         # Contact information
    │   │       ├── Step2.tsx         # Service selection
    │   │       ├── Step3.tsx         # Timeline & budget
    │   │       ├── Step4.tsx         # Project description + submit
    │   │       └── useStepForm.ts    # Unified step hook
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── hooks/
    │   │   └── useTracking.ts
    │   ├── i18n/
    │   │   ├── en.json           # English
    │   │   ├── vi.json           # Vietnamese
    │   │   └── fr.json           # French
    │   ├── pages/
    │   │   ├── home/
    │   │   │   ├── HomePage.tsx
    │   │   │   └── useHomePage.ts
    │   │   ├── report/
    │   │   │   ├── ReportPage.tsx
    │   │   │   └── useReportPage.ts
    │   │   └── admin/
    │   │       ├── AdminPage.tsx
    │   │       ├── useAdminPage.ts
    │   │       ├── login/
    │   │       │   ├── AdminLogin.tsx
    │   │       │   └── useAdminLogin.ts
    │   │       └── dashboard/
    │   │           ├── AdminDashboard.tsx
    │   │           └── useAdminDashboard.ts
    │   ├── services/
    │   │   └── api.ts
    │   ├── styles/
    │   │   └── global.css
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
- **PostgreSQL** ≥ 14 (local install or Docker)

```bash
# Quick PostgreSQL via Docker
docker run -d \
  --name quotify-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=quote_app \
  -p 5432:5432 \
  postgres:16
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/quote-app.git
cd quote-app
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and update the values for your environment. See [Environment Variables](#environment-variables) for a full reference.

> **Security:** Never commit `.env` files. The `.gitignore` already excludes them.

### 3. Set up the database

```bash
# Create the database (skip if it already exists)
psql -U postgres -c "CREATE DATABASE quote_app;"

# Run migrations — creates tables and seeds the default admin account
npm run migrate
```

This creates three tables: `quote_requests`, `tracking_events`, and `admins`.

### 4. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
```

The default `.env` points to `http://localhost:4000/api`. Adjust `REACT_APP_API_URL` if your backend runs on a different port or host.

### 5. Install dependencies

```bash
# From the repo root, or individually:
cd backend && npm install
cd ../frontend && npm install
```

### 6. Run in development

Open two terminal tabs:

**Terminal 1 — Backend (with hot reload):**

```bash
cd backend
npm run dev
# API running at http://localhost:4000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm start
# App running at http://localhost:3000
```

Navigate to **http://localhost:3000** to see the quote form, and **http://localhost:3000/admin** to access the dashboard.

---

## Environment Variables

### Backend — `backend/.env`

| Variable         | Description                                         | Default                 |
| ---------------- | --------------------------------------------------- | ----------------------- |
| `PORT`           | API server port                                     | `4000`                  |
| `NODE_ENV`       | Environment mode                                    | `development`           |
| `DB_HOST`        | PostgreSQL host                                     | `localhost`             |
| `DB_PORT`        | PostgreSQL port                                     | `5432`                  |
| `DB_NAME`        | Database name                                       | `quote_app`             |
| `DB_USER`        | Database user                                       | `postgres`              |
| `DB_PASSWORD`    | Database password                                   | `postgres`              |
| `JWT_SECRET`     | Secret for signing JWTs (**change in production!**) | —                       |
| `ADMIN_EMAIL`    | Seeded admin email                                  | `admin@example.com`     |
| `ADMIN_PASSWORD` | Seeded admin password                               | `Admin@1234`            |
| `EMAIL_HOST`     | SMTP host                                           | `smtp.gmail.com`        |
| `EMAIL_PORT`     | SMTP port                                           | `587`                   |
| `EMAIL_USER`     | SMTP username / sender address                      | —                       |
| `EMAIL_PASS`     | SMTP password / app password                        | —                       |
| `EMAIL_FROM`     | From address shown in emails                        | same as `EMAIL_USER`    |
| `FRONTEND_URL`   | Allowed CORS origin                                 | `http://localhost:3000` |

**Gmail app password setup:**

1. Enable 2-Step Verification on your Google Account.
2. Go to **Google Account → Security → App Passwords**.
3. Generate a password for "Mail" and use it as `EMAIL_PASS`.

### Frontend — `frontend/.env`

| Variable            | Description          | Default                     |
| ------------------- | -------------------- | --------------------------- |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:4000/api` |

---

## Available Scripts

### Backend

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start with ts-node-dev (hot reload)  |
| `npm run build`   | Compile TypeScript → `dist/`         |
| `npm start`       | Run compiled output from `dist/`     |
| `npm run migrate` | Run database migrations & seed admin |

### Frontend

| Script          | Description                                   |
| --------------- | --------------------------------------------- |
| `npm start`     | Start CRA development server on port 3000     |
| `npm test`      | Run Jest test suite (watch mode)              |
| `npm run build` | Create optimised production build in `build/` |

---

## API Reference

All endpoints are prefixed with `/api`.

### Public endpoints

| Method | Path                       | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| `POST` | `/quotes`                  | Submit a new quote request          |
| `GET`  | `/quotes/:id/email-status` | Poll email delivery status          |
| `POST` | `/quotes/:id/retry-email`  | Retry a failed confirmation email   |
| `GET`  | `/quotes/:id/report`       | Retrieve the full submission report |
| `POST` | `/tracking`                | Record a user interaction event     |
| `POST` | `/auth/login`              | Admin login — returns a JWT         |

### Admin endpoints

Require `Authorization: Bearer <token>` header.

| Method | Path                | Description                                                                           |
| ------ | ------------------- | ------------------------------------------------------------------------------------- |
| `GET`  | `/admin/quotes`     | List quotes (supports `search`, `service`, `start_date`, `end_date`, `page`, `limit`) |
| `GET`  | `/admin/quotes/:id` | Get a single quote by ID                                                              |
| `GET`  | `/admin/stats`      | Dashboard statistics (totals, by-service, by-status, 30-day chart)                    |

### Example — `POST /api/quotes`

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1 555 0000",
  "company_name": "Acme Inc.",
  "services": ["Development", "Web Design"],
  "other_service": "",
  "timeline": "1–3 months",
  "budget": "$5,000–$15,000",
  "project_description": "We need a redesigned e-commerce site...",
  "additional_notes": ""
}
```

**Response `201`:**

```json
{
  "id": "b3d2e1f0-...",
  "email_status": "pending"
}
```

---

## Database Schema

```sql
-- Quote requests
CREATE TABLE quote_requests (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(255) NOT NULL,
  email               VARCHAR(255) NOT NULL,
  phone               VARCHAR(50),
  company_name        VARCHAR(255),
  services            TEXT[]       NOT NULL DEFAULT '{}',
  other_service       TEXT,
  timeline            VARCHAR(100),
  budget              VARCHAR(100),
  project_description TEXT,
  additional_notes    TEXT,
  email_status        VARCHAR(50)  NOT NULL DEFAULT 'pending',
  email_sent_at       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Analytics / tracking events
CREATE TABLE tracking_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  VARCHAR(255) NOT NULL,
  event_type  VARCHAR(100) NOT NULL,
  event_data  JSONB,
  page        VARCHAR(255),
  user_agent  TEXT,
  ip_address  VARCHAR(50),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Admin accounts
CREATE TABLE admins (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

## Testing

The frontend has a full Jest + React Testing Library test suite covering each page and its logic hook.

```bash
cd frontend

# Run all tests once
npm test -- --watchAll=false

# Run in watch mode
npm test

# Run a specific file
npm test -- --testPathPattern="useAdminLogin"
```

**Coverage summary:**

| Area                    | Test files                                             |
| ----------------------- | ------------------------------------------------------ |
| `pages/home`            | `HomePage.test.tsx`, `useHomePage.test.ts`             |
| `pages/report`          | `ReportPage.test.tsx`, `useReportPage.test.ts`         |
| `pages/admin`           | `AdminPage.test.tsx`                                   |
| `pages/admin/login`     | `AdminLogin.test.tsx`, `useAdminLogin.test.ts`         |
| `pages/admin/dashboard` | `AdminDashboard.test.tsx`, `useAdminDashboard.test.ts` |

---

## Production Build

### Backend

```bash
cd backend
npm run build   # Compiles TypeScript → dist/
npm start       # Serves dist/index.js
```

### Frontend

```bash
cd frontend
npm run build   # Outputs optimised static files to build/
```

Serve the `build/` directory with any static file server — nginx, `serve`, or a CDN. Configure your web server to proxy `/api/*` requests to the backend.

**nginx example:**

```nginx
location /api/ {
  proxy_pass http://localhost:4000;
}

location / {
  root /var/www/quotify/build;
  try_files $uri /index.html;
}
```

---

## Features

- **4-step guided form** with client-side validation via react-hook-form
- **Dynamic "Other" field** — text input shown only when "Other" service is selected
- **Email status polling** — polls `/email-status` every 3 s post-submit; retry on failure; shareable report link on success
- **Multilingual UI** — English, Vietnamese, and French via react-i18next with browser language detection
- **User analytics** — page views, step completions, and CTA clicks tracked via `/api/tracking`
- **Admin dashboard** — JWT-protected; search, filter, paginate quotes; bar chart breakdowns; 30-day activity sparkline
- **Pure CSS** — no CSS framework; fully responsive with mobile-first media queries
- **Secure authentication** — bcrypt password hashing, 8-hour JWT expiry, CORS origin restriction
- **Separation of concerns** — every page and complex component has a co-located `use*.ts` hook; components are pure render

---

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes and ensure all tests pass: `npm test -- --watchAll=false`
3. Commit with a conventional message: `git commit -m "feat: add dark mode toggle"`
4. Push and open a Pull Request against `main`

Please keep PRs focused — one feature or fix per PR.

---

> Built with React, Express, and PostgreSQL.
