import { apiClient } from '@/shared/lib/apiClient'
import type { AuthResponse, CreateGuestJudgePayload, CurrentUser, LoginPayload, RegisterPayload } from '../types'

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>('/users/me')
  return data
}

export async function getPendingUsers(): Promise<CurrentUser[]> {
  const { data } = await apiClient.get<CurrentUser[]>('/users/pending')
  return data
}

export async function approveUser(userId: string): Promise<void> {
  await apiClient.put(`/users/${userId}/approve`)
}

export async function createGuestJudge(payload: CreateGuestJudgePayload): Promise<CurrentUser> {
  const { data } = await apiClient.post<CurrentUser>('/users/guest-judge', payload)
  return data
}
