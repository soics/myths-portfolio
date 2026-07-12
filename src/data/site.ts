export const site = {
  name: 'myths',
  realName: 'Richard Germain',
  title: 'Builder & Experimenter',
  githubUser: 'soics',
  email: 'richardgermain29@gmail.com',
  instagram: 'https://instagram.com/mv.lls/',
  github: 'https://github.com/soics',
  tiktok: 'https://tiktok.com/@oycc',
  phrases: ['Building. Learning. Becoming.', 'Creating my future one line of code at a time.', 'I am not finished. I am building.'],
}

export const learningSkills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'GitHub', 'Supabase']

export const strengths = ['Communication', 'Teamwork', 'Adaptability', 'Creative thinking', 'Learning ability', 'Problem solving', 'Curiosity', 'Persistence']

export const projectNotes: Record<string, string> = {
  'myths-portfolio': 'Construction-site dark portfolio with blueprint grids, scaffolding frames, safety beacons, and real-time GitHub integration. Built with React 19, Vite 8, Tailwind CSS v4.',
  'instagram-bot': 'Local Instagram DM automation rig: Ollama phi3:mini for text, llava for vision, Meta TTS for voice. Whitelist-only, single-laptop, personal tool — no cloud dependency.',
  'ai-brain': 'Autonomous AI operating system: session syncing, concept extraction, Supabase + pgvector memory, 9Router provider pool, persistent daemon with daily/weekly maintenance cycles.',
}

export const bioParagraphs = [
  'I code because I love building things. Not because I have a title or a roadmap. I like taking things apart, seeing how they work, and putting them back together slightly better than before.',
  'My best lessons have come from breaking things. Shipping broken builds, committing secrets at 2 AM, wrestling with git until 4 AM. Every error message taught me more than any tutorial ever did.',
  'I dont pretend to have it figured out. What I have is curiosity. The drive to understand, the patience to actually learn, and the willingness to try things even when I might fail.',
  'Keep building. Keep exploring. Keep getting better.',
]

export const metrics = [
  { label: 'Learning Hours', value: '1,200+', sub: 'and counting' },
  { label: 'Lines Written', value: '50K+', sub: 'across projects' },
  { label: 'Bugs Fixed', value: '300+', sub: 'each one a lesson' },
]

export const logEntries = [
  { date: '2026-07-09', entry: 'Security audit complete. 18 attack vectors tested.' },
  { date: '2026-07-08', entry: 'Deployed to Vercel. Custom domain pending.' },
  { date: '2026-07-05', entry: 'Portfolio rebuild with Tailwind v4 + Motion + React 19.' },
  { date: '2026-06-28', entry: '9Router configuration. 276 models routed.' },
]

export const skillTiers = [
  { label: 'Building', skills: ['HTML', 'CSS', 'JavaScript'], color: 'from-blueprint/20 to-blueprint/5', barColor: 'bg-blueprint/40' },
  { label: 'Growing', skills: ['TypeScript', 'React', 'Node.js'], color: 'from-construction/20 to-construction/5', barColor: 'bg-construction/40' },
  { label: 'Exploring', skills: ['Git', 'GitHub', 'Supabase'], color: 'from-concrete-light/20 to-concrete-light/5', barColor: 'bg-concrete-light/40' },
]

export const phaseData = [
  { phase: 'Foundation', pct: 100, pctLabel: 'SECURED' },
  { phase: 'Framing', pct: 65, pctLabel: 'IN PROGRESS' },
  { phase: 'Finishing', pct: 25, pctLabel: 'INITIALIZED' },
]

export const chapters = [
  { number: '01', title: 'Learning fundamentals', text: 'Building a real base: markup, styling, JavaScript, version control, and small daily reps.', phase: 'Foundation' },
  { number: '02', title: 'Building applications', text: 'Turning lessons into working interfaces, useful scripts, and deployable full-stack experiments.', phase: 'Framing' },
  { number: '03', title: 'Becoming full-stack', text: 'Connecting frontend, backend, databases, deployment, and security into complete products.', phase: 'Finishing' },
]
