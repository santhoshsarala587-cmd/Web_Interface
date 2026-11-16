import { useMemo, useState } from 'react'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { buildInsights } from '../utils/insights.js'

export default function InsightsPanel() {
  const { weather, air } = useWeatherContext()
  const { units } = useSettings()
  const [open, setOpen] = useState(null)
  const items = useMemo(() => buildInsights(weather.data, air.data, units), [weather.data, air.data, units])

  return (
    <section className="card" aria-labelledby="ins-title">
      <h2 id="ins-title" className="card-title">Weather insights</h2>
      <p className="card-sub">Rule-based suggestions from the forecast data — guidance, not an official forecast.</p>
      <ul className="insight-list">
        {items.map((i) => (
          <li key={i.id} className={`insight tone-${i.tone}`}>
            <div className="insight-head">
              <span className="dot" aria-hidden="true" />
              <strong>{i.title}</strong>
            </div>
            <p>{i.text}</p>
            {i.basis.length > 0 && (
              <>
                <button type="button" className="link-btn" aria-expanded={open === i.id} onClick={() => setOpen(open === i.id ? null : i.id)}>
                  {open === i.id ? 'Hide data' : 'Why?'}
                </button>
                {open === i.id && <ul className="basis">{i.basis.map((b) => <li key={b}>{b}</li>)}</ul>}
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
