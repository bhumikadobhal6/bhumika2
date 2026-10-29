# AssignFlow

A modern assignment management system for college students. Track coursework, deadlines,
priorities, and completion progress from a single dashboard, backed by Supabase Auth and
PostgreSQL Row Level Security.

## Features

- **Student authentication** — email/password sign up, sign in, email confirmation, and password recovery.
- **Assignment management** — create, view, edit, update status, and delete assignments.
- **Deadline intelligence** — live countdown labels (`Due today`, `Due tomorrow`, overdue warnings).
- **Dashboard analytics** — workload, pending, in progress, completed, overdue, and completion rate.
- **Search, filters, and sorting** — by title/subject, status, priority, subject, due date, or creation date.
- **Priority and status badges** — color-coded High / Medium / Low and Pending / In Progress / Completed.
- **Account settings** — update display name, change password, and inspect connection status.
- **Secure by default** — Supabase SSR cookie sessions plus RLS policies that isolate every student's rows.
- **Responsive UI** — desktop sidebar, mobile drawer, loading, empty, error, and 404 states.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Proxy) |
| UI | React 19, Tailwind CSS 4, Lucide icons |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| Language | TypeScript |
| Validation | ESLint + `tsc --noEmit` |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **Project Settings → API** and copy the project URL and the `anon`/publishable key.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The app detects placeholder values and shows a setup banner until valid keys are provided.

### 4. Run the database migration

In the Supabase dashboard, open **SQL Editor** and run:

```text
supabase/migrations/001_initial_schema.sql
```

This creates the `assignments` table, indexes, the `updated_at` trigger, and all RLS policies.

### 5. Configure auth redirect URLs

In **Authentication → URL Configuration** set:

- **Site URL:** `http://localhost:3000` for local development (your production URL when deployed)
- **Redirect URLs:** add `http://localhost:3000/auth/callback` and your production equivalent

If email confirmation is enabled, new accounts receive a link that passes through
`/auth/callback` before landing on the dashboard. Password recovery links use the same
callback and then open `/reset-password`.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Run the production build
npm run lint      # Run ESLint
npx tsc --noEmit  # Type-check the project
```

## Project structure

```text
src/
├── app/
│   ├── (app)/                 # Authenticated app shell
│   │   ├── dashboard/         # Stats, recent work, upcoming deadlines
│   │   ├── assignments/       # List, create, details, edit
│   │   └── settings/          # Profile and security settings
│   ├── auth/callback/         # Supabase PKCE code exchange
│   ├── forgot-password/       # Request a recovery email
│   ├── reset-password/        # Choose a new password
│   ├── login/ signup/         # Authentication screens
│   ├── not-found.tsx          # Global 404
│   └── page.tsx               # Marketing landing page
├── components/                # UI components (client + server)
├── lib/
│   ├── assignments.ts         # Typed assignment CRUD helpers
│   ├── auth.ts                # Auth helpers
│   ├── stats.ts               # Dashboard metrics
│   ├── supabase/              # Browser, server, middleware/proxy clients
│   └── utils.ts               # Date and class-name helpers
├── proxy.ts                   # Next.js 16 request proxy (session refresh)
└── types/database.types.ts    # Database and domain types
supabase/migrations/           # SQL schema and RLS policies
```

## Database schema

`public.assignments` stores one row per assignment:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users`, cascades on delete |
| `title` | `text` | Required, non-empty |
| `description` | `text` | Optional notes |
| `subject` | `text` | Required course name |
| `due_date` | `timestamptz` | Deadline |
| `priority` | `text` | `Low`, `Medium`, or `High` |
| `status` | `text` | `Pending`, `In Progress`, or `Completed` |
| `created_at` | `timestamptz` | Auto-set |
| `updated_at` | `timestamptz` | Auto-updated by trigger |

RLS policies allow students to select, insert, update, and delete only rows where
`auth.uid() = user_id`.

## Deployment

1. Push the repository to GitHub and import it into Vercel (or any Next.js host).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the hosting environment.
3. Add the production domain and `/auth/callback` to Supabase's redirect URLs.
4. Build with `npm run build` and start with `npm run start`.
