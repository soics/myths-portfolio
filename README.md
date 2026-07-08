# myths Portfolio

Dark cinematic personal developer portfolio for **Richard Germain** (`myths`) — an aspiring full-stack developer and scripter.

Core message: **I am not finished. I am building.**

## Features
- React + Vite + TypeScript
- Tailwind CSS v4
- Motion animations with reduced-motion support
- GitHub API integration for `myths11v`
- Supabase-ready contact form
- Honest project empty state
- Semantic single-page layout
- OpenGraph, favicon, sitemap, robots.txt, JSON-LD
- Free deployment path via Vercel or Netlify

## Setup
```bash
npm install
npm run dev
```

## Supabase Contact Form
Create `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run `supabase/schema.sql` in Supabase SQL Editor.

Security notes:
- Use anon key only.
- Never expose service role key.
- RLS is enabled.
- Anonymous users can insert contact messages only.
- Anonymous users cannot read messages.

Without Supabase env vars, the form falls back to email.

## Scripts
```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Deployment
Recommended free hosting: **Vercel**.

1. Push to GitHub under `https://github.com/myths11v`.
2. Import repo into Vercel.
3. Add Supabase env vars if using contact storage.
4. Deploy.

Netlify also works with the same build settings:
- Build command: `npm run build`
- Publish directory: `dist`

## Future Improvements
- Add real finished projects as they ship.
- Add blog posts from Supabase.
- Add certificates only when earned.
- Add GitHub activity visualization.
- Add lightweight analytics if needed.
