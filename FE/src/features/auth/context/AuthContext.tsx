import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { clearAuthToken, getAuthToken, setAuthToken } from '@/shared/lib/apiClient'
import * as authApi from '../api/authApi'
import type { CurrentUser, LoginPayload, RegisterPayload } from '../types'

interface AuthContextValue {
  user: CurrentUser | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function refetchUser() {
    const profile = await authApi.getCurrentUser()
    setUser(profile)
  }

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .getCurrentUser()
      .then(setUser)
      .catch(() => clearAuthToken())
      .finally(() => setIsLoading(false))
  }, [])

  async function login(payload: LoginPayload) {
    const response = await authApi.login(payload)
    setAuthToken(response.token)
    await refetchUser()
  }

  async function register(payload: RegisterPayload) {
    const response = await authApi.register(payload)
    setAuthToken(response.token)
    await refetchUser()
  }

  function logout() {
    clearAuthToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
