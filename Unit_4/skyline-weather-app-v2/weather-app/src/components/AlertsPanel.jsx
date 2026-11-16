import { useState } from 'react'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { Skeleton } from './StatusStates.jsx'

const tone = (s) => (s === 'Extreme' || s === 'Severe' ? 'danger' : s === 'Moderate' ? 'warn' : 'info')

export default function AlertsPanel() {
  const { alerts, place } = useWeatherContext()
  const [open, setOpen] = useState(null)

  if (alerts.status === 'loading' && !alerts.data) return <Skeleton className="sk-card card-span" />
  return (
    <section className="card card-span" aria-labelledby="al-title">
      <h2 id="al-title" className="card-title">Official weather alerts</h2>
      {alerts.status === 'unsupported' && <p className="empty-note">No official alert feed is configured for {place.country || 'this location'}. Currently supported: United States (National Weather Service). Check your national meteorological agency for warnings.</p>}
      {alerts.status === 'error' && <p className="empty-note" role="alert">Alerts could not be loaded ({alerts.error}). Absence of alerts here does not mean none are active.</p>}
      {alerts.status === 'ready' && alerts.data.alerts.length === 0 && <p className="empty-note">No active alerts reported by the {alerts.data.source} for this point.</p>}
      {alerts.status === 'ready' && alerts.data.alerts.map((a) => (
        <article key={a.id} className={`alert tone-${tone(a.severity)}`}>
          <header><strong>{a.event}</strong><span className="pill">{a.severity}</span></header>
          <p>{a.headline}</p>
          <p className="fineprint">Source: {a.sender} · Area: {a.area}{a.expires ? ` · Expires ${new Date(a.expires).toLocaleString()}` : ''}</p>
          {a.description && <button type="button" className="link-btn" aria-expanded={open === a.id} onClick={() => setOpen(open === a.id ? null : a.id)}>{open === a.id ? 'Hide details' : 'Show details'}</button>}
          {open === a.id && <pre className="alert-body">{a.description}</pre>}
        </article>
      ))}
    </section>
  )
}
