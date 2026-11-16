/** Provider data is always °C / km/h / mm / hPa / m. These helpers convert for display only. */
export const TEMP_UNITS = { c: '°C', f: '°F' }
export const WIND_UNITS = { kmh: 'km/h', mph: 'mph', ms: 'm/s', kn: 'kn' }

export const toTemp = (c, u) => (c == null ? null : u === 'f' ? c * 9 / 5 + 32 : c)
export const fmtTemp = (c, u, { unit = false } = {}) => {
  const v = toTemp(c, u)
  return v == null ? '—' : `${Math.round(v)}°${unit ? (u === 'f' ? 'F' : 'C') : ''}`
}
export const toWind = (kmh, u) => (kmh == null ? null : u === 'mph' ? kmh * 0.621371 : u === 'ms' ? kmh / 3.6 : u === 'kn' ? kmh * 0.539957 : kmh)
export const fmtWind = (kmh, u, { unit = true } = {}) => {
  const v = toWind(kmh, u)
  return v == null ? '—' : `${Math.round(v)}${unit ? ' ' + WIND_UNITS[u] : ''}`
}
export const fmtPressure = (hpa) => (hpa == null ? '—' : `${Math.round(hpa)} hPa`)
export const fmtVisibility = (m, tempUnit) =>
  m == null ? '—' : tempUnit === 'f' ? `${(m / 1609.34).toFixed(1)} mi` : `${(Math.min(m, 99999) / 1000).toFixed(m >= 10000 ? 0 : 1)} km`
export const fmtPct = (v) => (v == null ? '—' : `${Math.round(v)}%`)
export const fmtMm = (mm) => (mm == null ? '—' : `${mm < 10 ? mm.toFixed(1) : Math.round(mm)} mm`)

/* ---- Time. Provider strings are already local to the place (timezone=auto). ---- */
const parts = (iso) => {
  const [d, t = '00:00'] = iso.split('T')
  const [y, m, day] = d.split('-').map(Number)
  const [hh, mm] = t.split(':').map(Number)
  return { y, m, day, hh, mm }
}
// Build a Date whose UTC fields equal the place's wall-clock fields, then format with timeZone:'UTC'.
const wall = (iso) => { const p = parts(iso); return new Date(Date.UTC(p.y, p.m - 1, p.day, p.hh, p.mm)) }
export const fmtClock = (iso, { minutes = true } = {}) =>
  iso ? wall(iso).toLocaleTimeString('en-US', { hour: 'numeric', ...(minutes ? { minute: '2-digit' } : {}), timeZone: 'UTC' }) : '—'
export const fmtHour = (iso) => wall(iso).toLocaleTimeString('en-US', { hour: 'numeric', timeZone: 'UTC' })
export const fmtWeekday = (date, i, long = false) =>
  i === 0 ? 'Today' : wall(date).toLocaleDateString('en-US', { weekday: long ? 'long' : 'short', timeZone: 'UTC' })
export const fmtDate = (date) => wall(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
export const fmtDateLong = (date) => wall(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })
export const fmtDuration = (sec) => `${Math.floor(sec / 3600)}h ${Math.round((sec % 3600) / 60)}m`
export const hourOf = (iso) => { const p = parts(iso); return p.hh + p.mm / 60 }
export const fmtAgo = (ts, now = Date.now()) => {
  const s = Math.max(0, Math.round((now - ts) / 1000))
  if (s < 45) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  return `${Math.round(s / 3600)} h ago`
}
export const placeLabel = (p) => (p ? [p.name, p.region, p.country].filter(Boolean).join(', ') : '')
export const placeKey = (p) => `${p.lat.toFixed(2)},${p.lon.toFixed(2)}`
