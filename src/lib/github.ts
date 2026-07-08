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

const base = 'https://api.github.com/users/myths11v'

export async function getGitHubData() {
  const [profileResponse, reposResponse] = await Promise.all([
    fetch(base),
    fetch(`${base}/repos?sort=updated&per_page=12`),
  ])

  if (!profileResponse.ok || !reposResponse.ok) {
    throw new Error('GitHub data unavailable')
  }

  const profile = (await profileResponse.json()) as GitHubProfile
  const repos = ((await reposResponse.json()) as GitHubRepo[])
    .filter((repo) => !repo.fork && !repo.archived)
    .slice(0, 6)

  return { profile, repos }
}
