import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/soics'),
      fetch('https://api.github.com/users/soics/repos?sort=updated&per_page=12'),
    ])

    if (!profileRes.ok || !reposRes.ok) {
      const status = Math.max(profileRes.status, reposRes.status)
      return res.status(status).json({ error: 'GitHub API error' })
    }

    const profile = await profileRes.json()
    const repos = (await reposRes.json())
      .filter((r: { fork: boolean; archived: boolean }) => !r.fork && !r.archived)
      .slice(0, 6)

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    return res.status(200).json({ profile, repos })
  } catch {
    return res.status(500).json({ error: 'Failed to fetch GitHub data' })
  }
}
