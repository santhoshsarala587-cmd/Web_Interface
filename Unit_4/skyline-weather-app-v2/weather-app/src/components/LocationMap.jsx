import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
import { fetchForecast } from '../api/openMeteo.js'
import { getJson } from '../api/http.js'
import WeatherIcon from './WeatherIcon.jsx'
import { conditionMeta } from '../utils/weatherCodes.js'
import { fmtTemp, fmtWind, fmtPct, fmtWeekday, fmtDate } from '../utils/units.js'
import { useSettings } from '../context/SettingsContext.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import SearchBar from './SearchBar.jsx'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})
const youIcon = L.divIcon({ className: 'you-dot', iconSize: [18, 18] })

export const getOwmKey = () => { try { return localStorage.getItem('owm_api_key') || import.meta.env.VITE_OWM_API_KEY || '' } catch { return '' } }

/** English place name for any point (Nominatim, accept-language=en). */
async function englishPlaceName(lat, lon, signal) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=en&lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`
  const { data } = await getJson(url, { ttl: 60 * 60 * 1000, signal })
  const a = data.address || {}
  const name = a.city || a.town || a.village || a.municipality || a.county || a.suburb || a.state_district || data.name || ''
  const region = a.state || a.region || ''
  return { name, region, country: a.country || '', countryCode: (a.country_code || '').toUpperCase() }
}

// Weather overlays come from OpenWeatherMap tile layers and need a (free) key.
const LAYERS = [
  { id: 'base', label: 'Map only', owm: null },
  { id: 'temp', label: 'Temperature', owm: 'temp_new' },
  { id: 'wind', label: 'Wind', owm: 'wind_new' },
  { id: 'rain', label: 'Precipitation', owm: 'precipitation_new' },
  { id: 'clouds', label: 'Cloud cover', owm: 'clouds_new' },
]

export default function LocationMap({ tall = false }) {
  const { place, selectPlace, geo, useMyLocation } = useWeatherContext()
  const { units } = useSettings()
  const navigate = useNavigate()
  const el = useRef(null), map = useRef(null), marker = useRef(null), overlay = useRef(null), you = useRef(null), pin = useRef(null)
  const [layer, setLayer] = useState('base')
  const [tiles, setTiles] = useState('loading') // loading | ok | failed
  const [overlayState, setOverlayState] = useState('idle')
  const [probe, setProbe] = useState(null) // { lat, lon, status, data, error }
  const key = getOwmKey()

  // Create the map once; destroy on unmount.
  useEffect(() => {
    const m = L.map(el.current, { zoomControl: true }).setView([place.lat, place.lon], 9)
    map.current = m
    // Esri World Street Map labels places in English worldwide (standard OSM tiles use local scripts).
    const base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors',
    })
    let ok = false
    base.on('tileload', () => { ok = true; setTiles('ok') })
    base.on('tileerror', () => { if (!ok) setTiles('failed') })
    base.addTo(m)
    marker.current = L.marker([place.lat, place.lon], { icon }).addTo(m)
    m.on('click', (e) => {
      const { lat, lng } = e.latlng
      if (pin.current) pin.current.setLatLng(e.latlng)
      else pin.current = L.circleMarker(e.latlng, { radius: 9, color: '#fff', weight: 3, fillColor: '#2f8cff', fillOpacity: 1 }).addTo(m)
      setProbe({ lat, lon: lng, status: 'loading' })
    })
    const t = setTimeout(() => m.invalidateSize(), 250)
    const ro = new ResizeObserver(() => m.invalidateSize())
    ro.observe(el.current)
    return () => { clearTimeout(t); ro.disconnect(); m.remove(); map.current = null }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Follow the selected place.
  useEffect(() => {
    if (!map.current) return
    map.current.setView([place.lat, place.lon], Math.max(map.current.getZoom(), 8))
    marker.current.setLatLng([place.lat, place.lon]).bindPopup(place.name)
  }, [place])

  // Current-location marker, only after permission has been granted.
  useEffect(() => {
    if (!map.current || !geo.position) return
    you.current?.remove()
    you.current = L.marker([geo.position.lat, geo.position.lon], { icon: youIcon, title: 'Your location' }).addTo(map.current)
  }, [geo.position])

  // Weather overlay layer.
  useEffect(() => {
    if (!map.current) return
    overlay.current?.remove(); overlay.current = null
    const def = LAYERS.find((l) => l.id === layer)
    if (!def?.owm) { setOverlayState('idle'); return }
    if (!key) { setOverlayState('no-key'); return }
    setOverlayState('loading')
    let ok = false
    const lyr = L.tileLayer(`https://tile.openweathermap.org/map/${def.owm}/{z}/{x}/{y}.png?appid=${encodeURIComponent(key)}`, { opacity: 0.7, attribution: 'Weather layers &copy; OpenWeatherMap' })
    lyr.on('tileload', () => { ok = true; setOverlayState('ok') })
    lyr.on('tileerror', () => { if (!ok) setOverlayState('error') })
    lyr.addTo(map.current)
    overlay.current = lyr
  }, [layer, key])

  // Weather + English place name at a clicked point (aborted if superseded).
  useEffect(() => {
    if (!probe || probe.status !== 'loading') return
    const ctrl = new AbortController()
    const same = (p) => p && p.lat === probe.lat && p.lon === probe.lon
    const namePromise = englishPlaceName(probe.lat, probe.lon, ctrl.signal).catch(() => null)
    fetchForecast(probe.lat, probe.lon, { signal: ctrl.signal })
      .then(async (data) => {
        const place = await namePromise
        setProbe((p) => (same(p) ? { ...p, status: 'ready', data, place } : p))
      })
      .catch((e) => e.name !== 'AbortError' && setProbe((p) => (same(p) ? { ...p, status: 'error', error: e.message } : p)))
    return () => ctrl.abort()
  }, [probe?.lat, probe?.lon]) // eslint-disable-line react-hooks/exhaustive-deps

  const closeProbe = () => { pin.current?.remove(); pin.current = null; setProbe(null) }
  const openFull = () => {
    const pl = probe.place || {}
    selectPlace({ id: `pt-${probe.lat.toFixed(2)}-${probe.lon.toFixed(2)}`, name: pl.name || `${probe.lat.toFixed(2)}, ${probe.lon.toFixed(2)}`, region: pl.region || '', country: pl.country || '', countryCode: pl.countryCode || '', lat: probe.lat, lon: probe.lon })
    navigate('/')
  }

  const c = probe?.data?.current
  const def = LAYERS.find((l) => l.id === layer)
  return (
    <section className="card card-span map-card" aria-label="Interactive weather map">
      <div className="map-tools">
        <SearchBar onPick={selectPlace} showGeo={false} placeholder="Search a location on the map…" compact />
        <button type="button" className="btn" onClick={useMyLocation} disabled={geo.status === 'loading'}>{geo.status === 'loading' ? 'Locating…' : 'Show my location'}</button>
        <div className="seg" role="group" aria-label="Map layer">
          {LAYERS.map((l) => <button key={l.id} type="button" className={layer === l.id ? 'on' : ''} aria-pressed={layer === l.id} onClick={() => setLayer(l.id)}>{l.label}</button>)}
        </div>
      </div>
      {overlayState === 'no-key' && <p className="notice" role="status">The “{def.label}” layer needs a free OpenWeatherMap API key (Settings → API keys). No overlay is shown without it — nothing here is simulated.</p>}
      {overlayState === 'error' && <p className="notice err" role="alert">The “{def.label}” layer could not be loaded. The key may be invalid or not yet activated.</p>}
      {overlayState === 'loading' && <p className="notice" role="status">Loading {def.label.toLowerCase()} layer…</p>}
      {geo.error && <p className="notice err" role="alert">{geo.error}</p>}
      <div className={`map-frame ${tall ? 'tall' : ''}`}>
        <div ref={el} className="leaflet-el" />
        {probe && (
          <aside className="map-weather" role="dialog" aria-label="Weather at selected point" aria-live="polite">
            <button type="button" className="icon-btn map-weather-close" onClick={closeProbe} aria-label="Close weather card">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            {probe.status === 'loading' && <p className="muted">Loading weather…</p>}
            {probe.status === 'error' && <p className="err" role="alert">{probe.error}</p>}
            {c && (() => {
              const m = conditionMeta(c.code, c.isDay)
              const d0 = probe.data.days[0]
              const pl = probe.place
              return (
                <>
                  <h3 className="mw-place">{pl?.name || 'Selected point'}</h3>
                  <p className="mw-sub">{[pl?.region, pl?.country].filter(Boolean).join(', ') || `${probe.lat.toFixed(2)}, ${probe.lon.toFixed(2)}`}</p>
                  <div className="mw-main">
                    <WeatherIcon conditionKey={m.key} size={54} />
                    <div><div className="mw-temp">{fmtTemp(c.temp, units.temp)}</div><div className="mw-cond">{m.label}</div></div>
                  </div>
                  <dl className="mw-grid">
                    <div><dt>Feels like</dt><dd>{fmtTemp(c.feels, units.temp)}</dd></div>
                    <div><dt>Humidity</dt><dd>{fmtPct(c.humidity)}</dd></div>
                    <div><dt>Wind</dt><dd>{fmtWind(c.wind, units.wind)}</dd></div>
                    <div><dt>Rain chance</dt><dd>{fmtPct(c.pop)}</dd></div>
                    <div><dt>High / Low</dt><dd>{fmtTemp(d0.max, units.temp)} / {fmtTemp(d0.min, units.temp)}</dd></div>
                    <div><dt>Cloud cover</dt><dd>{fmtPct(c.clouds)}</dd></div>
                  </dl>
                  <ul className="mw-days" aria-label="Next days">
                    {probe.data.days.slice(1, 4).map((d, i) => (
                      <li key={d.date}><span>{fmtWeekday(d.date, i + 1)} {fmtDate(d.date)}</span><WeatherIcon conditionKey={conditionMeta(d.code, true).key} size={22} /><strong>{fmtTemp(d.max, units.temp)}</strong><span className="muted">{fmtTemp(d.min, units.temp)}</span></li>
                    ))}
                  </ul>
                  <button type="button" className="btn btn-primary mw-btn" onClick={openFull}>View full forecast</button>
                </>
              )
            })()}
          </aside>
        )}
        {tiles === 'failed' && <div className="map-fallback"><p>Map tiles couldn’t load. Your network may be blocking the tile server.</p><a className="btn btn-primary" target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=10/${place.lat}/${place.lon}`}>Open in OpenStreetMap</a></div>}
      </div>
      <p className="probe muted">Click anywhere on the map to see the weather for that place.</p>
    </section>
  )
}
