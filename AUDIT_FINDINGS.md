# Audit Findings

> Full-spectrum engineering audit of myths-portfolio
> Started: 2026-07-12 | Branch: `audit/full-engineering-review`

---

## Phase 0 — Reconnaissance Summary

**Stack:** React 19 + Vite 8 + TypeScript 6 + Tailwind CSS v4 + Motion + R3F/Drei + Supabase + Vercel
**Node:** 22.x (via .nvmrc) | **Package manager:** npm
**Hosting:** Vercel (serverless functions in `api/`)
**Database:** Supabase (pgvector, RLS-enabled)
**Auth:** GitHub: ✓ logged in (soics) | Vercel: ✓ logged in (soics) | Supabase CLI: ✗ not authenticated

**Repo inventory:**
- `src/` — 7 components, 2 easter eggs, 2 CSS files, 1 data file, 3 lib files, 3 hooks, App.tsx, main.tsx
- `api/` — 2 Vercel serverless functions (contact.ts, github.ts)
- `supabase/` — schema.sql + migration-001.sql
- 3 Markdown docs (architecture.md, design-system.md, roadmap.md) — architecture.md is stale

**Working branch:** `audit/full-engineering-review` created
**Build:** Verified `npm run build` passes

---

## Logged Issues

### [CRITICAL] Dead Three.js Bundle (Scene component never imported)
ID:                    PERF-001
Category:              Performance
Location:              src/components/Scene.tsx (entire file), App.tsx (Scene not imported)
Problem:               The `Scene` component (~150 lines with Three.js/R3F/Drei) is never imported anywhere in the app. This means all three.js, @react-three/fiber, @react-three/drei, and Bagboy.tsx dependencies ship in the main bundle unnecessarily.
Root Cause:            Scene.tsx was likely used previously but removed from App.tsx during the greyscale redesign. No one confirmed the import was removed upstream.
Impact:                ~200-400KB of dead JavaScript in every visitor's bundle. Increases load time, parse time, and memory usage.
Severity:              Critical
Recommended Fix:       Tree-shake by removing unused imports. Keep Scene.tsx if planned for future use, but mark it clearly. Lazy-load easter eggs (EchoPrism, SignalRoom) via React.lazy.
Fix Status:            Recommended Only
Verification:          grep -r "Scene" src/App.tsx → no match; grep -r "Scene" src/ — only found in Scene.tsx itself and re-export in components/index.
Expected Improvement:  Bundle size reduction of 300-500KB+ (Three.js alone is ~180KB gzipped).
Residual Risk:         If Scene is re-enabled later, it should be lazy-loaded.

### [CRITICAL] Broken Honeypot — Server Checks Random Field Client Never Sends
ID:                    SEC-001
Category:              Security
Location:              api/contact.ts:85, src/components/Contact.tsx:129
Problem:               The server generates a random honeypot field name (`hp_${crypto.randomUUID().slice(0, 4)}`) at module load time but never communicates it to the client. The client-side form uses a hardcoded `name="website"` hidden input as its honeypot. The server checks `req.body[honeypotField]` (the random name), which will always be undefined, so the honeypot is completely broken.
Root Cause:            Server-side honeypot was implemented independently from the client form. The random field name approach is cryptographically sound but requires the name to be sent to the client (e.g., via an API response or embedded variable) so the client can render a matching hidden field.
Impact:                Honeypot does zero spam filtering. Automated bots that fill all visible fields + "website" will pass the check trivially.
Severity:              Critical
Recommended Fix:       Either (1) embed the generated honeypot field name in the served HTML/API response and have the client use it, or (2) simplify: keep the hardcoded "website" honeypot on the client and check `req.body.website` on the server. Option 2 is simpler and equally effective.
Fix Status:            Recommended Only (needs verification of deployment approach)
Verification:          src/components/Contact.tsx:129 shows `<input className="hidden" name="website" ...>`; api/contact.ts:85 generates random name; api/contact.ts:131 checks `req.body[honeypotField]`.
Expected Improvement:  Honeypot actually works as intended.
Residual Risk:         Low — honeypot is only one layer. Rate limiting and sanitization still active.

### [CRITICAL] Continuous requestAnimationFrame Loops — CPU Drain on Idle
ID:                    PERF-002
Category:              Performance
Location:              src/hooks/useTilt.ts:31-39, src/hooks/useLiquidGlass.ts:32-47
Problem:               Both useTilt and useLiquidGlass run persistent `requestAnimationFrame` loops that never pause. They tick continuously even when the user isn't interacting with the element, the page is in a background tab, or the device is on battery.
Root Cause:            The rAF loop starts on mount and only stops on unmount. There's no visibility-check or idle-detect to throttle or stop the animation when unnecessary.
Impact:                Each active rAF loop consumes 1 CPU core at approximately 4-8% on a modern machine. With 10+ tilt elements visible (nav links, cards, icons), this causes measurable CPU drain, especially on mobile and background tabs.
Severity:              Critical
Recommended Fix:       Pause rAF loop when the element is not hovered, when the page is hidden (use document.hidden / visibilitychange), and use a lower tick frequency when idle.
Fix Status:            Recommended Only
Verification:          Profile CPU usage in DevTools Performance tab with and without interaction.
Expected Improvement:  Near-zero CPU usage when not interacting; responsive when needed.
Residual Risk:         None.

### [HIGH] originAllowed Blocks Custom Domain
ID:                    SEC-002
Category:              Security / Infra
Location:              api/contact.ts:77-79
Problem:               The CORS origin allowlist only includes `https://myths-portfolio.vercel.app`. If the site is accessed via a custom domain or the Vercel preview deployment's generated URL, the origin check returns 403.
Root Cause:            Hardcoded allowlist without environment-based configuration.
Impact:                Contact form will 403 on any domain other than the exact Vercel URL. This includes preview deployments and custom domains.
Severity:              High
Recommended Fix:       Read allowed origins from environment variable (comma-separated), fall back to checking referer/origin against the known production URL.
Fix Status:            Recommended Only
Verification:          Deploy to preview → try submitting contact form.
Expected Improvement:  Contact form works on all legitimate domains.
Residual Risk:         If misconfigured, could allow unwanted origins.

### [HIGH] BufferGeometry Created on Every Render (No Memoization)
ID:                    CODE-001
Category:              Code Quality
Location:              src/components/Scene.tsx:7-17
Problem:               `useParticles` creates a new `THREE.BufferGeometry` instance on every component render. This is intended as a custom hook but isn't wrapped in useMemo, so every re-render of Particles creates new geometry and discards the old one (GC pressure).
Root Cause:            Missing React memoization pattern for Three.js geometry creation.
Impact:                Unnecessary garbage collection churn; minor performance cost. Scene isn't imported currently, but would be a problem if re-enabled.
Severity:              High
Recommended Fix:       Wrap geometry creation in useMemo.
Fix Status:            Recommended Only
Verification:          N/A — component not currently in use.
Expected Improvement:  Normalizes Scene.tsx for future use.
Residual Risk:         None.

### [HIGH] genParticles Creates Float32Array on Every Render
ID:                    CODE-002
Category:              Code Quality
Location:              src/components/easter-eggs/EchoPrism.tsx:7-15, SignalRoom.tsx:7-18
Problem:               `genParticles()` function creates new Float32Array and fills it on every call. It's defined outside the component but called inside Particles components without useMemo. Same issue in both EchoPrism and SignalRoom.
Root Cause:            Inline geometry data generation without memoization.
Impact:                When easter eggs are active, particle data is regenerated every frame via the rAF-driven re-render. Continuous GC churn.
Severity:              High
Recommended Fix:       Memoize with useMemo, generating data only once.
Fix Status:            Recommended Only
Verification:          Profile heap allocations when EchoPrism/SignalRoom is active.
Expected Improvement:  Zero geometry allocation after initial mount.

### [HIGH] Stale Architecture Documentation
ID:                    CODE-003
Category:              Code Quality
Location:              architecture.md (entire file)
Problem:               References files/patterns that no longer exist: `AnimatedBackground.tsx`, `Cursor.tsx`, `GitHubProjects.tsx`, `Header.tsx`, `Section.tsx`, `myths11v` GitHub user. Also incorrectly describes the contact flow as "mailto: fallback" when the actual code uses a Vercel serverless function.
Root Cause:            Documentation not updated during refactoring.
Impact:                Misleading for new contributors or future self.
Severity:              High
Recommended Fix:       Rewrite to match actual file structure and data flow.
Fix Status:            Recommended Only
Verification:          Compare against actual src/ directory and api/ files.
Expected Improvement:  Accurate documentation.

### [HIGH] 1.46MB JS Bundle — Needs Code Splitting
ID:                    PERF-003
Category:              Performance
Location:              vite.config.ts (build output), dist/assets/index-*.js
Problem:               Production JS bundle is 1,462 KB (422 KB gzipped). Three.js ecosystem (@react-three/fiber, drei, three) dominates. Unused Scene component and lazily-loadable easter eggs are bundled eagerly.
Root Cause:            No code splitting for heavy 3D dependencies. Scene.tsx is imported nowhere but R3F/Drei/Three are still pulled in because Bagboy, EchoPrism, and SignalRoom import them directly.
Impact:                Slow initial load, high bandwidth usage, poor Core Web Vitals (LCP). On 3G, 422KB gzipped JS takes ~5-8 seconds just to transfer.
Severity:              High
Recommended Fix:       React.lazy() + Suspense for EchoPrism and SignalRoom. Remove unused Scene import. Dynamic import for Three.js deps.
Fix Status:            Recommended Only
Verification:          Measure before/after with `npm run build` and bundle analyzer.
Expected Improvement:  Main bundle from 1,462KB → ~400KB (remove ~1MB of 3D code from main chunk).
Residual Risk:         Low — lazy loading adds a brief loading state for easter eggs.

### [HIGH] CSP Uses 'unsafe-inline' for Scripts
ID:                    SEC-003
Category:              Security
Location:              vercel.json:9
Problem:               Content-Security-Policy includes `'unsafe-inline'` for `script-src`, which weakens XSS protection significantly.
Root Cause:            Need for inline scripts (vite injects inline module scripts in dev, and some frameworks require it). However, Vite 8 can use nonces in production builds.
Impact:                Reduces CSP effectiveness against XSS. Any injected script will execute.
Severity:              High
Recommended Fix:       Configure Vite to generate nonces for production builds, or switch to `'strict-dynamic'` with a hashed CSP. Alternatively, if inline scripts aren't needed in production (Vite generates separate JS files), remove `'unsafe-inline'`.
Fix Status:            Recommended Only
Verification:          Build → inspect index.html → check if scripts are inline or external.
Expected Improvement:  Stronger XSS protection.
Residual Risk:         Low — there's no user-generated content on the site.

### [MEDIUM] TypeWriter Doesn't Handle Text Changes
ID:                    UX-001
Category:              UX
Location:              src/components/Hero.tsx:8-37
Problem:               The TypeWriter component uses `text` prop in its dependency array but doesn't reset `displayed` state when text changes. If the text prop changes, the cursor blinks but existing characters don't reset.
Root Cause:            Missing `key` prop or reset logic for text changes.
Impact:                Degraded UX if text content changes dynamically (unlikely in current usage, but fragile).
Severity:              Medium
Recommended Fix:       Reset `displayed` to '' and `started` to false when text changes, or key the component on the text value.
Fix Status:            Recommended Only
Verification:          Change site.phrases[2] value at runtime.
Expected Improvement:  TypeWriter correctly restarts on text change.
Residual Risk:         Low — text is static.

### [MEDIUM] Loading/Error States Lack aria-live Announcements
ID:                    ACC-001
Category:              Accessibility
Location:              src/components/Projects.tsx:161-172
Problem:               The loading spinner (line 162) and error message (line 169) don't have `role="status"` or `aria-live="polite"`, so screen readers won't announce state changes to users.
Root Cause:            Missing accessibility attributes on dynamic status regions.
Impact:                Screen reader users won't know when projects are loading or have failed to load.
Severity:              Medium
Recommended Fix:       Add `role="status"` and `aria-live="polite"` to both containers.
Fix Status:            Recommended Only
Verification:          Use screen reader or inspect Accessibility panel.
Expected Improvement:  Screen reader announces "measuring site..." and error states.

### [MEDIUM] dist/ Directory Committed to Git
ID:                    ARCH-001
Category:              Architecture
Location:              Repository root (dist/ directory tracked)
Problem:               The `dist/` directory (build output) is committed to the repository. This bloats clones, causes merge conflicts on builds, and is an anti-pattern.
Root Cause:            .gitignore has `.vercel` but not `dist` was apparently already tracked before being added to .gitignore (or was manually committed after).
Impact:                Repository bloat. Currently ~20MB for dist/.
Severity:              Medium
Recommended Fix:       Remove dist/ from git tracking (`git rm -r --cached dist/`), ensure .gitignore has it.
Fix Status:            Recommended Only (needs explicit confirmation — destructive to git history)
Verification:          `git ls-files dist/` shows tracked files.
Expected Improvement:  20MB repo size reduction.

### [LOW] No meta keywords Tag
ID:                    SEO-001
Category:              SEO
Location:              index.html
Problem:               No `<meta name="keywords">` tag in the HTML head. While Google downgraded keywords meta for ranking, it's still used by other search engines and for internal categorization.
Root Cause:            Omission.
Impact:                Marginal SEO impact.
Severity:              Low
Recommended Fix:       Add `<meta name="keywords" content="...">`.
Fix Status:            Recommended Only
Verification:          Check index.html `<head>`.
Expected Improvement:  Minor SEO improvement.
Residual Risk:         None.

### [LOW] robots.txt and sitemap.xml Present but No Canonical URL
ID:                    SEO-002
Category:              SEO
Location:              public/sitemap.xml (if exists), index.html
Problem:               No `<link rel="canonical">` in index.html. The robots.txt likely references a sitemap, but without a canonical URL, duplicate content from preview deployments could dilute SEO.
Root Cause:            Omission.
Impact:                Potential duplicate content issues across Vercel preview URLs.
Severity:              Low
Recommended Fix:       Add `<link rel="canonical" href="https://myths-portfolio.vercel.app/">` to index.html.
Fix Status:            Recommended Only
Verification:          Check rendered HTML for canonical tag.
Expected Improvement:  Clear canonical URL for search engines.
Residual Risk:         None.

### [LOW] README Describes Wrong Fallback Behavior
ID:                    ARCH-002
Category:              Architecture
Location:              README.md:53
Problem:               README states "Without Supabase env vars, the form falls back to email via mailto:" — but the actual code in api/contact.ts gracefully handles missing Supabase config and logs without mailing.
Root Cause:            Documentation not updated when serverless API was implemented.
Impact:                Misleading documentation.
Severity:              Low
Recommended Fix:       Update README to match actual behavior.
Fix Status:            Recommended Only
Verification:          Compare api/contact.ts line 160-179 with README description.
Expected Improvement:  Accurate documentation.
Residual Risk:         None.

### [INFO] Redundant .gitignore Entries
ID:                    CFG-001
Category:              Code Quality
Location:              .gitignore
Problem:               `.env.local` on line 4 is redundant with `.env*` on line 9.
Root Cause:            Added during development and never cleaned up.
Impact:                None — duplicate is harmless but messy.
Severity:              Informational
Recommended Fix:       Remove `.env.local` line.
Fix Status:            Recommended Only
Verification:          `.env*` already covers `.env.local`.
Expected Improvement:  Cleaner configuration.
Residual Risk:         None.
