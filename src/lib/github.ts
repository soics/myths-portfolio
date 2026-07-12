export type GitHubProfile = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  html_url: string
}

export type GitHubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
  archived: boolean
}

export async function getGitHubData() {
  const res = await fetch('/api/github')
  if (!res.ok) throw new Error('GitHub data unavailable')
  return res.json() as Promise<{ profile: GitHubProfile; repos: GitHubRepo[] }>
}
