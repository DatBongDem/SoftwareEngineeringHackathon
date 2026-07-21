import { apiClient } from '@/shared/lib/apiClient'
import type { CreateTeamPayload, InviteMemberPayload, RegisterTrackPayload, Team } from '../types'

export async function getTeamsByTrack(trackId: string): Promise<Team[]> {
  const { data } = await apiClient.get<Team[]>(`/tracks/${trackId}/teams`)
  return data
}

export async function getTeamsByEvent(eventId: string): Promise<Team[]> {
  const { data } = await apiClient.get<Team[]>(`/events/${eventId}/teams`)
  return data
}

export async function getTeamById(teamId: string): Promise<Team> {
  const { data } = await apiClient.get<Team>(`/teams/${teamId}`)
  return data
}

export async function createTeam(payload: CreateTeamPayload): Promise<Team> {
  const { data } = await apiClient.post<Team>('/teams', payload)
  return data
}

export async function joinTeamRequest(teamId: string): Promise<void> {
  await apiClient.post(`/teams/${teamId}/join-request`)
}

export async function inviteMember(teamId: string, payload: InviteMemberPayload): Promise<void> {
  await apiClient.post(`/teams/${teamId}/invite`, payload)
}

export async function acceptMember(teamId: string, userId: string, accept: boolean): Promise<void> {
  await apiClient.put(`/teams/${teamId}/members/${userId}/accept`, null, { params: { accept } })
}

export async function registerTrack(teamId: string, payload: RegisterTrackPayload): Promise<void> {
  await apiClient.post(`/teams/${teamId}/register-track`, payload)
}
