# SnapLink

SnapLink is a full-stack URL shortener app where users can create short links, generate QR codes, and track clicks.

Built using React, Vite, Tailwind CSS, and Supabase.

---

## Features

- User authentication
- Create short links
- Custom short URLs
- QR code generation
- Click analytics
- Responsive UI
- Supabase backend integration

---

## Tech Stack

Frontend:

- React
- Vite
- Tailwind CSS
- React Router

Backend / Database:

- Supabase
- PostgreSQL

Deployment:

- Vercel

---

## Project Structure

```bash
SnapLink/
├── client/     # Frontend
├── server/     # Backend setup
├── shared/     # Shared constants
├── docs/       # Documentation
```

---

## Run Locally

Clone the repo:

```bash
git clone https://github.com/YOUR_USERNAME/snaplink.git
cd snaplink
```

Install dependencies:

```bash
npm install
```

Create:

```bash
client/.env
```

Add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

Start the app:

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Deployment

Frontend:

- Vercel

Backend & Database:

- Supabase

---

## Author

Sarthak
