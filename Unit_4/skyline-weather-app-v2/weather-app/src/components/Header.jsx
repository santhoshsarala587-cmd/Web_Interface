import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { fmtAgo } from '../utils/units.js'
import { useNow } from './LocalClock.jsx'

const NAV = [
  ['/', 'Today'], ['/hourly', 'Hourly'], ['/daily', '7-Day'], ['/analytics', 'Analytics'],
  ['/map', 'Map'], ['/compare', 'Compare'], ['/news', 'News'],
]

export default function Header({ onOpenSettings }) {
  const { selectPlace, weather, refresh, stale } = useWeatherContext()
  const { settings, set } = useSettings()
  const now = useNow(30000)
  const busy = weather.status === 'loading'

  return (
    <header className="app-header">
      <div className="header-row">
        <NavLink to="/" className="brand" aria-label="Skyline home">
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true"><circle cx="24" cy="26" r="11" fill="var(--sun-400)" /><path d="M18 46a11 11 0 0 1 3-21.6A13 13 0 0 1 46 29a9 9 0 0 1-2 17H18z" fill="var(--mist-100)" /></svg>
          <span>Skyline</span>
        </NavLink>
        <SearchBar onPick={selectPlace} />
        <div className="header-actions">
          <span className={`updated ${stale ? 'is-stale' : ''}`} role="status" aria-live="polite">
            {weather.updatedAt ? (stale ? `Stale · last updated ${fmtAgo(weather.updatedAt, now)}` : `Updated ${fmtAgo(weather.updatedAt, now)}`) : ''}
          </span>
          <button type="button" className={`icon-btn ${busy ? 'spin' : ''}`} onClick={refresh} aria-label="Refresh weather data" title="Refresh">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="icon-btn" onClick={() => set({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle theme">
            {settings.theme === 'dark'
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>}
          </button>
          <button type="button" className="icon-btn" onClick={onOpenSettings} aria-label="Open settings" title="Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>
      </div>
      <nav className="page-nav" aria-label="Primary">
        {NAV.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>{label}</NavLink>
        ))}
      </nav>
    </header>
  )
}
