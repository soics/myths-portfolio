# myths Portfolio

Dark cinematic personal developer portfolio for **Richard Germain** (`myths`).

## Features

- React + Vite + TypeScript + Tailwind CSS v4
- Motion spring animations with reduced-motion support
- 3D interactive easter eggs (R3F + Drei)
- GitHub API integration — shows your pinned repos
- Supabase contact form with email fallback
- Serverless API with rate limiting, validation, sanitization
- SEO: OpenGraph, sitemap, robots.txt, JSON-LD schema
- Accessibility: focus rings, semantic HTML, skip link
- Single-page layout with scroll-progress bar

## Quick Start

```bash
git clone <repo-url>
cd myths-portfolio
npm install
npm run dev
```

## Configuration

Edit `src/data/site.ts` to personalize:

- `name`, `realName`, `title` — your info
- `githubUser` — your GitHub username (fetches pinned repos)
- `email` — contact form fallback
- `instagram`, `github`, `tiktok` — social links
- `phrases` — hero typewriter text

## GitHub API Integration

By default, repos are fetched client-side from the GitHub public API (rate-limited to 60 req/hr).

For production, deploy the serverless proxy in `api/github.ts` (Vercel) — no env vars needed, uses your repo's Vercel URL as the referer.

## Supabase Contact Form

Required for the form to submit. Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

The form POSTs to the Vercel serverless function at `/api/contact`, which validates input, checks a honeypot, rate-limits by IP, and inserts into Supabase `contact_messages` using the service-role key.

Without Supabase env vars, the API logs the submission and returns success but does not persist the message.

## Scripts

```bash
npm run dev       # dev server
npm run build     # typecheck + production build
npm run lint      # ESLint
npm run preview   # preview production build
```

## Deployment

**Vercel** (recommended):

1. Push to GitHub
2. Import repo into Vercel
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as env vars (optional)
4. Deploy — zero config

**Netlify** also works:
- Build command: `npm run build`
- Publish directory: `dist`

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Motion | Animation library |
| R3F + Drei | 3D easter eggs |
| Lucide React | Icons |
| Supabase | Contact form backend |
| Vercel | Hosting + serverless functions |
