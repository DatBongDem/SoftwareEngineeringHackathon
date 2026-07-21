import { useCallback, useEffect, useState } from 'react'
import { applyTheme, persistTheme, resolveInitialTheme, type Theme } from '../lib/theme'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      persistTheme(next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
