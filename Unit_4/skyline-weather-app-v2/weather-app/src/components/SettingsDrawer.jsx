import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../context/SettingsContext.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { clearHttpCache } from '../api/http.js'

const KEYS = [
  { id: 'owm_api_key', label: 'OpenWeatherMap key', note: 'Optional — enables the Temperature / Wind / Precipitation / Cloud map layers. Weather data itself needs no key.', href: 'https://home.openweathermap.org/api_keys' },
  { id: 'newsapi_api_key', label: 'NewsAPI key', note: 'Optional — enables weather-related headlines.', href: 'https://newsapi.org/register' },
  { id: 'unsplash_api_key', label: 'Unsplash access key', note: 'Optional — extra photo source. City photos normally come from Wikipedia (no key).', href: 'https://unsplash.com/developers' },
]
const WIDGETS = [['insights', 'Weather insights'], ['alerts', 'Official alerts'], ['air', 'Air quality'], ['hourly', 'Hourly forecast'], ['daily', '7-day forecast'], ['analytics', 'Analytics charts'], ['photo', 'City photo']]

function Seg({ label, value, options, onChange }) {
  return (
    <div className="set-row"><span id={`l-${label}`}>{label}</span>
      <div className="seg" role="group" aria-labelledby={`l-${label}`}>
        {options.map(([v, l]) => <button key={v} type="button" className={value === v ? 'on' : ''} aria-pressed={value === v} onClick={() => onChange(v)}>{l}</button>)}
      </div>
    </div>
  )
}

export default function SettingsDrawer({ onClose }) {
  const { settings, set, setWidget, reset } = useSettings()
  const { favorites, toggleFavorite, clearRecents, recents, refresh } = useWeatherContext()
  const [keys, setKeys] = useState(() => Object.fromEntries(KEYS.map((k) => [k.id, localStorage.getItem(k.id) || ''])))
  const [saved, setSaved] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const prev = document.activeElement
    ref.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [onClose])

  const saveKeys = () => {
    KEYS.forEach((k) => { const v = keys[k.id].trim(); v ? localStorage.setItem(k.id, v) : localStorage.removeItem(k.id) })
    setSaved(true); clearHttpCache(); refresh()
    setTimeout(() => window.location.reload(), 400)
  }

  return (
    <div className="drawer-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="set-title" tabIndex={-1} ref={ref}>
        <header className="drawer-head">
          <h2 id="set-title">Settings</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close settings"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
        </header>

        <h3>Units & appearance</h3>
        <Seg label="Temperature" value={settings.tempUnit} onChange={(v) => set({ tempUnit: v })} options={[['c', '°C'], ['f', '°F']]} />
        <Seg label="Wind speed" value={settings.windUnit} onChange={(v) => set({ windUnit: v })} options={[['kmh', 'km/h'], ['mph', 'mph'], ['ms', 'm/s'], ['kn', 'knots']]} />
        <Seg label="Theme" value={settings.theme} onChange={(v) => set({ theme: v })} options={[['dark', 'Dark'], ['light', 'Light']]} />
        <Seg label="Motion" value={settings.motion} onChange={(v) => set({ motion: v })} options={[['system', 'System'], ['reduce', 'Reduced'], ['full', 'Full']]} />

        <h3>Dashboard widgets</h3>
        <ul className="toggle-list">
          {WIDGETS.map(([k, l]) => (
            <li key={k}><label><input type="checkbox" checked={!!settings.widgets[k]} onChange={(e) => setWidget(k, e.target.checked)} /> {l}</label></li>
          ))}
        </ul>

        <h3>Saved locations</h3>
        {favorites.length === 0 ? <p className="muted">No favorites yet — tap the ★ on the dashboard.</p> : (
          <ul className="fav-list">{favorites.map((f) => <li key={`${f.lat}${f.lon}`}><span>{[f.name, f.region, f.country].filter(Boolean).join(', ')}</span><button type="button" className="link-btn" onClick={() => toggleFavorite(f)} aria-label={`Remove ${f.name}`}>Remove</button></li>)}</ul>
        )}
        {recents.length > 0 && <button type="button" className="btn" onClick={clearRecents}>Clear recent searches</button>}

        <h3>API keys (all optional)</h3>
        <p className="muted">Stored only in this browser. Keys entered here are visible to anyone with access to this device. Never use a key that must stay secret.</p>
        {KEYS.map((k) => (
          <div className="key-field" key={k.id}>
            <label htmlFor={k.id}>{k.label}</label>
            <input id={k.id} type="password" autoComplete="off" value={keys[k.id]} onChange={(e) => setKeys({ ...keys, [k.id]: e.target.value })} placeholder="Paste key" />
            <small>{k.note} <a href={k.href} target="_blank" rel="noopener noreferrer">Get a key</a></small>
          </div>
        ))}
        <div className="drawer-actions">
          <button type="button" className="btn btn-primary" onClick={saveKeys}>{saved ? 'Saved…' : 'Save keys'}</button>
          <button type="button" className="btn" onClick={() => { reset(); }}>Reset preferences</button>
        </div>
      </aside>
    </div>
  )
}
