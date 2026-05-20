# SnapLink architecture

## Overview

SnapLink is a monorepo with a clear split between the React frontend, a placeholder API server, and shared constants.

```
project-root/
├── client/     # React + Vite app (production UI today)
├── server/     # Express API (health check only for now)
├── shared/     # Constants used by client and server
└── docs/       # Documentation
```

The app still talks to **Supabase** directly from the client (`client/src/services/api/`). The server folder is ready for future routes (webhooks, server-side redirects, rate limits, etc.) without changing the frontend layout.

## Client (`client/`)

| Path | Purpose |
|------|---------|
| `src/app/` | Router configuration |
| `src/components/ui/` | shadcn-style primitives |
| `src/components/layout/` | Shell: header, footer, layout, particles |
| `src/components/common/` | Reusable UI helpers (buttons, errors) |
| `src/features/auth/` | Login, signup, auth context, protected routes |
| `src/features/links/` | Dashboard, create link, detail, redirect |
| `src/features/analytics/` | Charts for clicks |
| `src/features/landing/` | Marketing page sections |
| `src/features/qr/` | Placeholder for shared QR helpers |
| `src/services/api/` | Supabase client and data access |
| `src/hooks/` | Shared React hooks |
| `src/utils/` | Utilities (`cn` for Tailwind) |
| `src/constants/` | Re-exports from `shared/` |
| `src/styles/` | Global CSS and design tokens |

**Alias:** `@/` → `client/src`, `@shared/` → `shared/`

## Server (`server/`)

Minimal Express app:

- `GET /api/health` — readiness check
- Folders `routes/`, `controllers/`, `middleware/`, `services/`, `utils/`, `config/` reserved for growth

Run: `npm run dev:server` from the repo root.

## Shared (`shared/`)

Cross-package constants (`APP_NAME`, `ROUTES`). Import in the client via `@shared/constants/...`.

## Commands (from repo root)

| Command | Description |
|---------|-------------|
| `npm install` | Install all workspaces |
| `npm run dev` | Start Vite (client) |
| `npm run build` | Build client for production |
| `npm run dev:server` | Start API with file watch |

## Environment

Create `client/.env` (or root `.env` if you configure Vite to load it):

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_KEY=your_anon_key
```
