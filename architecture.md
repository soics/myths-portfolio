# Architecture

## Stack
- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS v4
- Motion (`motion/react`) for animation
- Three.js + @react-three/fiber + @react-three/drei (3D easter eggs, lazy-loaded)
- R3F + Drei for 3D easter eggs (EchoPrism, SignalRoom)
- Lucide React for icons
- Supabase JS client for contact storage
- Zustand for state management
- GitHub REST API for public profile/repository data
- Vercel serverless functions for API (contact, GitHub proxy)
- Fontsource Geist Sans for typography

## Why This Architecture
- Vite keeps the app fast and simple with instant HMR.
- Static-first React works on free hosting.
- 3D easter eggs are lazy-loaded via `React.lazy()` to avoid bloating the main bundle.
- GitHub integration uses a Vercel serverless proxy to avoid public API rate limits.
- Supabase anon key is safe to expose only with strict RLS insert-only policies.
- Zustand provides lightweight global state without Redux boilerplate.
- Tailwind v4 with CSS variables enables cohesive theming.

## File Structure
```
myths-portfolio/
├── api/                          # Vercel serverless functions
│   ├── contact.ts                # Contact form handler (Supabase + Resend)
│   └── github.ts                 # GitHub API proxy (cached)
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── robots.txt
│   ├── sackboy.png
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── About.tsx             # Manifesto / bio section
│   │   ├── Bagboy.tsx            # 3D character (Three.js)
│   │   ├── ConstructionBackground.tsx  # Grids, beacons, dust, cursor
│   │   ├── Contact.tsx           # Contact form
│   │   ├── easter-eggs/
│   │   │   ├── EchoPrism.tsx     # 3D prism (lazy-loaded)
│   │   │   └── SignalRoom.tsx    # 3D orb scene (lazy-loaded)
│   │   ├── ErrorBoundary.tsx     # React error boundary
│   │   ├── Hero.tsx              # Hero section
│   │   ├── Journey.tsx           # Timeline / phases
│   │   ├── LiquidGlass.tsx       # Glass morphism wrapper
│   │   ├── Primitives.tsx        # Header, nav, command palette
│   │   ├── Projects.tsx          # GitHub projects
│   │   ├── Scene.tsx             # 3D background (unused — kept for future)
│   │   └── Skills.tsx            # Skills scaffold
│   ├── data/
│   │   └── site.ts               # All site content / copy
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useLiquidGlass.ts     # Glass tilt + ripple effect
│   │   └── useTilt.ts            # Tilt on hover effect
│   ├── lib/
│   │   ├── github.ts             # GitHub API client types
│   │   ├── store.ts              # Zustand global store
│   │   └── supabase.ts           # Supabase client (null if no env vars)
│   ├── styles/
│   │   ├── globals.css           # Imports tokens.css
│   │   └── tokens.css            # Design tokens, animations, utilities
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── schema.sql                # Initial schema with RLS
│   └── migration-001.sql         # Audit columns + indexes
├── architecture.md
├── design-system.md
├── implementation-plan.md
├── package.json
├── README.md
├── roadmap.md
├── vercel.json
└── vite.config.ts
```

## Data Flow

### GitHub
1. Client calls `GET /api/github` (Vercel serverless function).
2. Server fetches `https://api.github.com/users/soics` + `.../users/soics/repos?sort=updated&per_page=12`.
3. Server filters out forks and archived repos, returns top 6.
4. Response cached for 5 minutes (`s-maxage=300, stale-while-revalidate=60`).
5. Client renders repo cards or empty state.

### Contact Form
1. User fills name/email/message.
2. Client validates (length, email format) and shows char count.
3. Hidden honeypot field (`name="website"`) traps automated bots.
4. Submit calls `POST /api/contact` (Vercel serverless).
5. Server validates, sanitizes, rate-limits (5/IP/min, 50 global/min).
6. Inserts row into Supabase `contact_messages` via service-role key.
7. Optionally sends email notification via Resend (`RESEND_API_KEY`).
8. UI shows success/error states with animations.

## Environment Variables
```env
# Client-safe (VITE_ prefix — bundled but only anon key)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-only (never in client bundle)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
RESEND_API_KEY=re_xxx                   # optional
```

## Supabase Tables
- `contact_messages` — live (form submissions)
- `blog_posts` — schema ready, not used
- `projects` — schema ready, not used
- `updates` — schema ready, not used
- `certificates` — schema ready, not used

## Security Model
- Supabase service-role key is never exposed to the client (server-only env var).
- Anon key is safe: only allows insert into `contact_messages` (RLS enforced).
- RLS enabled on all tables.
- `contact_messages`: anon can insert; service-role can select (admin).
- Server-side: input validation, sanitization, length limits, honeypot, rate limiting.
- CSP, X-Frame-Options, X-Content-Type-Options configured in Vercel headers.
- No user-generated content rendered as HTML — risk surface is minimal.

## Performance Model
- 3D components lazy-loaded (EchoPrism, SignalRoom removed from main bundle).
- rAF-based tilt effects pause when page is hidden (`visibilitychange`).
- CSS-driven animations (prefer transform/opacity) for scroll and hover effects.
- `prefers-reduced-motion` respected globally.
- GitHub data fetched lazily after page render.
- Geist Sans fonts loaded only in weights used (500-900).

## Deployment
**Vercel** (current):
- Framework preset: Vite
- Serverless functions in `api/`
- Custom headers via `vercel.json` (CSP, security)
- Preview deployments with unique URLs.

Alternative: Netlify (static build, would need separate function hosting).
