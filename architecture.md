# Architecture

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- Motion (`motion/react`) for animation
- Lucide React for icons
- Supabase JS client for contact storage
- GitHub REST API for public profile/repository data
- Free deployment target: Vercel or Netlify

## Why This Architecture
- Vite keeps the app fast and simple.
- Static-first React works on free hosting.
- GitHub integration uses public unauthenticated endpoints by default, avoiding secrets.
- Supabase anon key is safe to expose only with strict RLS insert-only policies.
- No server required; zero-cost deployment.

## File Structure
```txt
myths-portfolio/
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.tsx
│   │   ├── Contact.tsx
│   │   ├── Cursor.tsx
│   │   ├── GitHubProjects.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Journey.tsx
│   │   ├── Section.tsx
│   │   └── Skills.tsx
│   ├── data/
│   │   └── site.ts
│   ├── lib/
│   │   ├── github.ts
│   │   └── supabase.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   └── schema.sql
├── architecture.md
├── design-system.md
├── roadmap.md
├── README.md
└── package.json
```

## Data Flow

### GitHub
1. App calls `https://api.github.com/users/myths11v`.
2. App calls `https://api.github.com/users/myths11v/repos?sort=updated&per_page=6`.
3. App filters forks and archived repos.
4. If no meaningful repositories exist, app displays an honest empty state.

### Contact Form
1. User fills name/email/message.
2. Client validates fields.
3. Honeypot field blocks simple bots.
4. Submit inserts row into Supabase `contact_messages`.
5. UI shows success/error states.

## Environment Variables
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

If Supabase variables are missing, the form degrades to a `mailto:` fallback.

## Supabase Tables
- `contact_messages`
- `blog_posts` future-ready
- `projects` future-ready
- `updates` future-ready
- `certificates` future-ready

## Security Model
- Never expose Supabase service role key.
- Enable RLS on all tables.
- Allow anonymous insert only for `contact_messages`.
- Deny anonymous select/update/delete.
- Validate and length-limit fields client-side.
- Add honeypot and timestamp checks for spam reduction.

## Performance Model
- No heavy 3D.
- CSS/motion particles only.
- Respect `prefers-reduced-motion`.
- Lazy GitHub fetch after initial render.
- Minimal dependencies.
- SVG favicon/OpenGraph generated locally.

## Deployment
Recommended: Vercel free tier.
Alternative: Netlify free tier.
GitHub Pages works but Supabase env handling is easier on Vercel/Netlify.
