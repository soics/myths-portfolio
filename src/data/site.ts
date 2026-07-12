export const site = {
  name: 'myths',
  realName: 'Richard Germain',
  title: 'Builder & Experimenter',
  githubUser: 'soics',
  email: 'richardgermain29@gmail.com',
  instagram: 'https://instagram.com/mv.lls/',
  github: 'https://github.com/soics',
  tiktok: 'oycc',
  phrases: ['Building. Learning. Becoming.', 'Creating my future one line of code at a time.', 'I am not finished. I am building.'],
}

export const learningSkills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'GitHub', 'Supabase']

export const strengths = ['Communication', 'Teamwork', 'Adaptability', 'Creative thinking', 'Learning ability', 'Problem solving', 'Curiosity', 'Persistence']

export const projectNotes: Record<string, string> = {
  'myths-portfolio': 'Personal portfolio with dark cinematic theme, 3D easter egg, Supabase contact form, deployed on Vercel.',
  'instagram-bot': 'Local Instagram DM automation with Ollama: phi3:mini for text replies, llava for image analysis, Meta TTS pipeline. Whitelist-only, single-laptop, controlled personal tool.',
  'ai-brain': 'AI operating system integrating terminal CLI, multiple model providers (OpenAI, Claude, Ollama), and cloud memory via Supabase + pgvector. Task-router with auto-classification.',
}

export const chapters = [
  { number: '01', title: 'Learning fundamentals', text: 'Building a real base: markup, styling, JavaScript, version control, and small daily reps.', phase: 'Foundation' },
  { number: '02', title: 'Building applications', text: 'Turning lessons into working interfaces, useful scripts, and deployable full-stack experiments.', phase: 'Framing' },
  { number: '03', title: 'Becoming full-stack', text: 'Connecting frontend, backend, databases, deployment, and security into complete products.', phase: 'Finishing' },
]
