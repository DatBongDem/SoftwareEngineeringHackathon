// Mirrors Domain/Enums on the backend. The API has no JsonStringEnumConverter
// registered, so System.Text.Json serializes these enums as numbers, not strings.
// Plain `enum` isn't usable here because the project's tsconfig has
// `erasableSyntaxOnly` on (Vite/esbuild transpiles files in isolation and can't
// erase a real TS enum) — use the const-object + derived-type pattern instead.
export const UserType = {
  FPTStudent: 0,
  ExternalStudent: 1,
  Lecturer: 2,
  GuestJudge: 3,
} as const
export type UserType = (typeof UserType)[keyof typeof UserType]

export const userTypeLabels: Record<UserType, string> = {
  [UserType.FPTStudent]: 'FPT Student',
  [UserType.ExternalStudent]: 'External Student',
  [UserType.Lecturer]: 'Lecturer',
  [UserType.GuestJudge]: 'Guest Judge',
}

export const TeamStatus = {
  Pending: 0,
  Approved: 1,
  Promoted: 2,
  Disqualified: 3,
} as const
export type TeamStatus = (typeof TeamStatus)[keyof typeof TeamStatus]

export const teamStatusLabels: Record<TeamStatus, string> = {
  [TeamStatus.Pending]: 'Pending',
  [TeamStatus.Approved]: 'Approved',
  [TeamStatus.Promoted]: 'Promoted',
  [TeamStatus.Disqualified]: 'Disqualified',
}

// Matches shared/components/Badge.tsx's BadgeTone — kept as string literals here to
// avoid a shared/types -> shared/components import.
export const teamStatusTones: Record<TeamStatus, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  [TeamStatus.Pending]: 'warning',
  [TeamStatus.Approved]: 'success',
  [TeamStatus.Promoted]: 'info',
  [TeamStatus.Disqualified]: 'danger',
}
