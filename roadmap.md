# myths Portfolio Roadmap

## Product Goal
Create a premium, honest, single-page developer portfolio for Richard Germain (`myths`) that presents an early developer journey with discipline, taste, and momentum.

Core message: **I am not finished. I am building.**

## Constraints
- $0 budget
- No fake jobs, clients, projects, achievements, or experience
- Free/open-source tools only
- Deployable on free hosting
- Performance and accessibility before visual excess

## Inspiration Research Notes

### gkoberger.com
- Strength: personal world-building; portfolio feels like a living archive, not a resume.
- Pattern: timeline, personal lists, work history, social feeds, playful navigation.
- Lesson: make the site feel like a person, not a template.
- Avoid: too much density for a beginner portfolio.

### thegeekdesigner.com
- Strength: bold typographic repetition and kinetic identity.
- Pattern: oversized text, motion through repeated labels, playful confidence.
- Lesson: typography can be the hero; repetition can create rhythm.
- Avoid: copying marquee-heavy structure.

### naxo.dev/about
- Strength: human, direct voice; simple identity plus personality.
- Pattern: clear intro, friendly personal narrative.
- Lesson: beginner portfolio should sound authentic, not corporate.

### cherupil.com
- Strength: cinematic scroll story with progressive statements.
- Pattern: sentence-by-sentence identity reveal, interactive/accessible claims.
- Lesson: use sections as chapters; make scrolling feel authored.
- Avoid: claiming advanced experience Richard does not yet have.

### kartavya-singh.com
- Fetch returned minimal metadata only.
- Lesson: title-first identity still matters; metadata must be strong.

### radnaabazar.com
- Fetch returned 500.
- Lesson: graceful degradation matters; portfolio must fail softly.

### sunnypatel.net
- Strength: polished dev portfolio architecture with clear routes, command/search feel, project proof.
- Pattern: numbered navigation, status labels, strong hero claim, selected work.
- Lesson: use structure and confidence, but avoid inflated claims.

### sumanthsamala.com/music
- Fetch returned 404.
- Lesson: internal links must be tested; avoid dead pages.

### bruno-simon.com
- Strength: unforgettable interactive world, loading, controls, game-like discovery.
- Pattern: playful interaction, behind-the-scenes transparency, performance options.
- Lesson: create a memorable interaction without 3D complexity; document how it works.
- Avoid: heavy WebGL/game systems for this project.

## Original Creative Direction
A midnight developer environment: dark cinematic canvas, restrained motion, silver typography, cold blue/purple accent, subtle particles, grain, glass cards, and chapter-based storytelling.

## Delivery Phases
1. Planning docs
2. Vite React TypeScript scaffold
3. Tailwind + Motion + Lucide setup
4. Design system implementation
5. GitHub API integration
6. Supabase contact form integration
7. SEO/static assets
8. Build/lint/accessibility/performance checks
9. Deployment docs

## Acceptance Criteria
- Single-page experience
- Mobile/tablet/desktop/ultrawide responsive
- GitHub data auto-fetches from `myths11v`
- Empty project state is intentional and impressive
- Contact form validates input and supports Supabase storage
- No paid services required
- Build passes
- No console-blocking errors
- Documentation complete
