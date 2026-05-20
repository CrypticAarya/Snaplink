# SnapLink — Premium URL Shortener

SnapLink is a modern URL shortening app with analytics, QR codes, and Supabase-backed auth. The repo is organized as a small monorepo so the frontend and future API can grow separately.

## Project structure

```
├── client/          # React + Vite frontend
├── server/          # Express API (minimal; ready for expansion)
├── shared/          # Shared constants
└── docs/            # Architecture notes
```

See [docs/architecture.md](./docs/architecture.md) for folder-by-folder detail.

## Quick start

1. Install dependencies (from the repo root):

   ```bash
   npm install
   ```

2. Add Supabase env vars in `client/.env`:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   ```

3. Run the frontend:

   ```bash
   npm run dev
   ```

4. Optional — run the API placeholder:

   ```bash
   npm run dev:server
   ```

   Health check: `http://localhost:3001/api/health`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start client dev server |
| `npm run build` | Build client for production |
| `npm run dev:server` | Start server with watch mode |

## Tech stack

- **Client:** React, Vite, Tailwind CSS, React Router, Supabase JS
- **Server:** Express (scaffold)
- **Shared:** ES modules for constants

## License

Personal project.
