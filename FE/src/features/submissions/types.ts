export interface GithubRepoMetadata {
  stars: number
  forks: number
  primaryLanguage: string
  openIssues: number
  lastCommitDate: string | null
}

export interface Submission {
  id: string
  teamId: string
  eventId: string
  roundId: string
  repoUrl: string
  demoUrl: string | null
  reportUrl: string | null
  notes: string | null
  isDisqualified: boolean
  disqualificationReason: string | null
  githubMetadata: GithubRepoMetadata | null
  submittedAt: string
}

export interface CreateSubmissionPayload {
  teamId: string
  eventId: string
  roundId: string
  repoUrl: string
  demoUrl?: string
  reportUrl?: string
  notes?: string
}

export interface DisqualifySubmissionPayload {
  reason: string
}
