import { createContext, useContext, useEffect, useMemo, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const DEFAULTS = {
  theme: 'dark',
  tempUnit: 'c',
  windUnit: 'kmh',
  motion: 'system', // system | reduce | full
  widgets: { insights: true, hourly: true, daily: true, analytics: true, air: true, alerts: true, photo: true },
}

const Ctx = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings, reset] = useLocalStorage('skyline_settings_v2', DEFAULTS)
  // Merge so newly added settings keys never come back undefined for returning users.
  const s = useMemo(() => ({ ...DEFAULTS, ...settings, widgets: { ...DEFAULTS.widgets, ...settings.widgets } }), [settings])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', s.theme)
    const reduce = s.motion === 'reduce' || (s.motion === 'system' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    root.setAttribute('data-motion', reduce ? 'reduce' : 'full')
  }, [s.theme, s.motion])

  const set = useCallback((patch) => setSettings((p) => ({ ...p, ...patch })), [setSettings])
  const setWidget = useCallback((k, v) => setSettings((p) => ({ ...p, widgets: { ...DEFAULTS.widgets, ...p.widgets, [k]: v } })), [setSettings])
  const units = useMemo(() => ({ temp: s.tempUnit, wind: s.windUnit }), [s.tempUnit, s.windUnit])

  const value = useMemo(() => ({ settings: s, units, set, setWidget, reset }), [s, units, set, setWidget, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSettings() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSettings must be used inside SettingsProvider')
  return v
}
