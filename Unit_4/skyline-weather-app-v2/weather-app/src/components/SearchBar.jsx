import { useEffect, useId, useRef, useState } from 'react'
import { useCitySearch } from '../hooks/useCitySearch.js'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { placeLabel } from '../utils/units.js'

/** Reusable place picker: debounced geocoding autocomplete + favourites + recents + (optional) geolocation. */
export default function SearchBar({ onPick, showGeo = true, placeholder = 'Search city…', compact = false, label = 'Search for a city' }) {
  const { recents, favorites, useMyLocation, geo } = useWeatherContext()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(-1)
  const { results, status, error } = useCitySearch(q)
  const box = useRef(null)
  const listId = useId()

  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  const showSaved = !q.trim() && (favorites.length || recents.length)
  const options = q.trim().length >= 2 ? results : []
  const pick = (p) => { onPick(p); setQ(''); setOpen(false); setIdx(-1) }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setIdx((i) => Math.min(options.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter' && idx >= 0 && options[idx]) { e.preventDefault(); pick(options[idx]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className={`search ${compact ? 'search-compact' : ''}`} ref={box}>
      <div className="search-field">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <input
          type="search" value={q} placeholder={placeholder} aria-label={label}
          role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={idx >= 0 ? `${listId}-${idx}` : undefined}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setIdx(-1) }}
          onFocus={() => setOpen(true)} onKeyDown={onKey} autoComplete="off"
        />
        {showGeo && (
          <button type="button" className="icon-btn" onClick={useMyLocation} aria-label="Use my current location" title="Use my current location" disabled={geo.status === 'loading'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        )}
      </div>

      {open && (
        <div className="search-pop" id={listId} role="listbox" aria-label="Suggestions">
          {status === 'loading' && <p className="search-note" role="status">Searching…</p>}
          {status === 'error' && <p className="search-note err" role="alert">{error}</p>}
          {status === 'empty' && <p className="search-note" role="status">No places found for “{q.trim()}”. Check the spelling or try a nearby city.</p>}
          {options.map((p, i) => (
            <button key={`${p.id}`} id={`${listId}-${i}`} role="option" aria-selected={i === idx} className={`search-item ${i === idx ? 'is-active' : ''}`} onClick={() => pick(p)} type="button">
              <strong>{p.name}</strong><span>{[p.region, p.country].filter(Boolean).join(', ')}</span>
            </button>
          ))}
          {showSaved && (
            <>
              {favorites.length > 0 && <p className="search-head">Favorites</p>}
              {favorites.map((p) => <button key={`f${p.lat}${p.lon}`} type="button" className="search-item" onClick={() => pick(p)}><strong>★ {p.name}</strong><span>{placeLabel({ ...p, name: '' }).replace(/^, /, '')}</span></button>)}
              {recents.length > 0 && <p className="search-head">Recent</p>}
              {recents.map((p) => <button key={`r${p.lat}${p.lon}`} type="button" className="search-item" onClick={() => pick(p)}><strong>{p.name}</strong><span>{[p.region, p.country].filter(Boolean).join(', ')}</span></button>)}
            </>
          )}
        </div>
      )}
      {geo.error && <p className="search-note err" role="alert">{geo.error}</p>}
    </div>
  )
}
