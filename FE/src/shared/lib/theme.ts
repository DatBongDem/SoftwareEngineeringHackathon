export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'seal_theme'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light')
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function persistTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme)
  applyTheme(theme)
}

// Applies the resolved theme before React mounts, avoiding a light-mode flash
// for users who already chose (or whose system prefers) dark.
export function initTheme() {
  applyTheme(resolveInitialTheme())
}
