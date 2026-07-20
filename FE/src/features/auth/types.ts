import type { UserType } from '@/shared/types/enums'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
  userType: UserType
  studentId?: string
  universityName?: string
}

export interface CreateGuestJudgePayload {
  fullName: string
  email: string
}

export interface AuthResponse {
  token: string
  userId: string
  fullName: string
  email: string
  roles: string[]
  isApproved: boolean
  userType: UserType
}

export interface CurrentUser {
  id: string
  fullName: string
  email: string
  roles: string[]
  isApproved: boolean
  userType: UserType
  studentId?: string
  universityName?: string
}
