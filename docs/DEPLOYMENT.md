# Deploying SnapLink

SnapLink is a **static React SPA** that talks to **Supabase** directly. You do not need to deploy the `server/` workspace for the app to work today.

Recommended host: **[Vercel](https://vercel.com)** (config already in `vercel.json` at the repo root).

---

## Deployment readiness checklist

| Item | Status |
|------|--------|
| Production build (`npm run build`) | Run locally before deploy |
| `vercel.json` (build output + SPA rewrites) | Included |
| Supabase schema + RLS (`docs/supabase-setup.sql`) | **You must run in Supabase SQL Editor** |
| Env vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` | **Required on host** |
| Supabase Auth → Site URL + Redirect URLs | **Required** |
| Google OAuth (optional) | Configure in Supabase + Google Cloud |
| `client/.env` | Local only — never commit |

---

## 1. Supabase (backend)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → paste and run **`docs/supabase-setup.sql`**.
3. Confirm **Storage** has a public bucket named **`qrs`** (script creates it).
4. Under **Project Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_KEY`

### Auth URLs (required for login / OAuth)

**Authentication → URL configuration**

| Field | Example |
|-------|---------|
| **Site URL** | `https://your-app.vercel.app` |
| **Redirect URLs** | `https://your-app.vercel.app/dashboard` |
| | `https://your-app.vercel.app/auth` |
| | `http://localhost:5173/dashboard` (local dev) |
| | `http://localhost:5173/auth` |

### Google sign-in (optional)

1. Supabase → **Authentication → Providers → Google** (enable, add client ID/secret).
2. Google Cloud Console → OAuth client → **Authorized redirect URI** = Supabase callback URL shown in the provider settings.

### Email signup

If **Confirm email** is enabled, users must verify before login. For demos, you can disable it under **Authentication → Providers → Email**.

---

## 2. Deploy to Vercel

### Option A — GitHub (recommended)

1. Push the repo to GitHub (already at `CrypticAarya/Snaplink`).
2. [vercel.com/new](https://vercel.com/new) → **Import** the repository.
3. Leave defaults; Vercel reads **`vercel.json`**:
   - **Install:** `npm install`
   - **Build:** `npm run build -w @snaplink/client`
   - **Output:** `client/dist`
4. **Environment Variables** (Production + Preview):

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_KEY=eyJhbGciOi...
   ```

5. Deploy. Your app URL will look like `https://snaplink-xxx.vercel.app`.

### Option B — Vercel CLI

```bash
npm i -g vercel
cd /path/to/Snaplink
vercel login
vercel
# follow prompts; add env vars when asked or in the dashboard later
vercel --prod
```

---

## 3. Verify after deploy

- [ ] Landing page loads (`/`)
- [ ] Sign up / log in (`/auth`)
- [ ] Dashboard loads (`/dashboard`)
- [ ] Create link + QR upload works
- [ ] Open short URL `https://your-domain.com/{slug}` → redirects and records a click
- [ ] Analytics appear on link detail page

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Blank auth / “Invalid API key” | Env vars missing or wrong on Vercel; redeploy after adding them |
| OAuth returns to wrong page | Add production URL to Supabase **Redirect URLs** |
| Short links 404 | SPA rewrite missing — ensure `vercel.json` is at repo root |
| Cannot create links / RLS error | Re-run `docs/supabase-setup.sql`; check user is logged in |
| QR upload fails | Confirm `qrs` bucket exists and storage policies from SQL script |

---

## Notes

- **Bundle size:** main JS chunk is ~1.1 MB (warning only; deploy still works).
- **ESLint:** `npm run lint` may report issues; it does not block the Vite build.
- **`server/`:** optional Express health API; not used by the live frontend.
