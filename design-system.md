# Design System

## Brand
- Name: myths
- Real name: Richard Germain
- Title: Aspiring Full-Stack Developer & Scripter
- Message: I am not finished. I am building.

## Mood
Dark cinematic, minimal, futuristic, slightly grunge, mature, quiet confidence.

## Color Palette
```txt
black        #030303
night        #08080a
charcoal     #111114
graphite     #1b1b20
border       #2a2a32
silver       #b9bcc6
off-white    #f3f3f0
muted        #7a7d86
cold-blue    #7aa7ff
void-purple  #7c5cff
```

Usage:
- 90% black/charcoal/off-white
- 8% silver/gray
- 2% cold-blue/purple accent

## Typography
- Font: system stack to avoid external paid/font loading dependency.
- Hero: oversized, tight tracking, cinematic contrast.
- Body: readable, high contrast, generous line-height.
- Labels: uppercase, letter-spaced, small.

## Layout
- Single-page vertical scroll.
- Sections as chapters.
- Max width: 1120px.
- Large spacing on desktop; compact but breathable mobile layout.
- Sticky glass navigation.

## Motion Rules
- Motion supports meaning, never noise.
- Entrance animations are subtle: opacity, y-offset, blur.
- Hover animations: border glow, slight lift, magnetic buttons.
- Particles/background should be passive and low-cost.
- Respect `prefers-reduced-motion`.

## Components

### Header
- Sticky top nav.
- Compact brand mark: `myths`.
- Numbered links.
- Mobile-friendly horizontal scroll/flex wrap.

### Hero
- Cinematic intro.
- Animated typography.
- Interactive background.
- Primary CTA: View Journey.
- Secondary CTA: GitHub.

### About
- Honest story.
- No fake authority.
- Strength cards.

### Skills
- Learning stack tags.
- Personal strengths tags.
- No percentages.

### Projects
- GitHub profile stats.
- Auto repo cards when available.
- Empty state: “Projects loading… Currently building my foundation.”

### Journey
- Editable chapter timeline.
- Chapter 01: Learning fundamentals.
- Chapter 02: Building applications.
- Chapter 03: Becoming full-stack.

### Contact
- Supabase-backed form.
- Social links.
- Success animation.
- Mail fallback.

## Accessibility
- Semantic sections and headings.
- Visible focus rings.
- Sufficient contrast.
- Button labels clear.
- Motion reduction support.
- No interaction requires custom cursor.

## SEO
- Title: myths — Richard Germain | Aspiring Full-Stack Developer & Scripter
- Description: Personal developer portfolio for Richard Germain, known as myths, documenting an early full-stack development journey.
- OpenGraph SVG image.
- JSON-LD Person schema.
- Sitemap and robots.txt.
