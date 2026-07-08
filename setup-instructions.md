# Setup Instructions

## Requirements
- Node.js 22+
- npm 10+
- Git
- Optional: Supabase free account

## Local Development
```bash
npm install
npm run dev
```

## Environment
Create `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If these are not set, the contact form will use an email fallback.

## Supabase Setup
1. Create a free Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy Project URL and anon key into `.env.local`.

## Deployment
Recommended free deployment: Vercel.

1. Push repo to GitHub.
2. Import the repo in Vercel.
3. Add environment variables if using Supabase.
4. Deploy.

## Quality Checks
```bash
npm run lint
npm run build
npm run preview
```
