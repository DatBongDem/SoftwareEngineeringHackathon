// Mirrors Domain/Enums on the backend. The API has no JsonStringEnumConverter
// registered, so System.Text.Json serializes these enums as numbers, not strings.
export enum UserType {
  FPTStudent = 0,
  ExternalStudent = 1,
  Lecturer = 2,
  GuestJudge = 3,
}

export const userTypeLabels: Record<UserType, string> = {
  [UserType.FPTStudent]: 'FPT Student',
  [UserType.ExternalStudent]: 'External Student',
  [UserType.Lecturer]: 'Lecturer',
  [UserType.GuestJudge]: 'Guest Judge',
}

export enum TeamStatus {
  Pending = 0,
  Approved = 1,
  Promoted = 2,
  Disqualified = 3,
}

export const teamStatusLabels: Record<TeamStatus, string> = {
  [TeamStatus.Pending]: 'Pending',
  [TeamStatus.Approved]: 'Approved',
  [TeamStatus.Promoted]: 'Promoted',
  [TeamStatus.Disqualified]: 'Disqualified',
}
