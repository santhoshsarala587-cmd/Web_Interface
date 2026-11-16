import { useState } from 'react'
import WeatherIcon from './WeatherIcon.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { conditionMeta, compass } from '../utils/weatherCodes.js'
import { fmtTemp, fmtWind, fmtWeekday, fmtDate, fmtDateLong, fmtClock, fmtDuration, fmtPct, fmtMm } from '../utils/units.js'

export default function DailyForecast({ limit = 7 }) {
  const { weather } = useWeatherContext()
  const { units } = useSettings()
  const [open, setOpen] = useState(0)
  const days = weather.data.days.slice(0, limit)
  const lo = Math.min(...days.map((d) => d.min)), hi = Math.max(...days.map((d) => d.max))
  const span = hi - lo || 1

  return (
    <section className="card card-span" aria-labelledby="dy-title">
      <h2 id="dy-title" className="card-title">{days.length}-day forecast</h2>
      <p className="card-sub">Forecast values for each calendar day at the selected place. Accuracy falls with lead time.</p>
      <ul className="day-list">
        {days.map((d, i) => {
          const m = conditionMeta(d.code, true)
          const isOpen = open === i
          return (
            <li key={d.date} className={`day ${isOpen ? 'is-open' : ''}`}>
              <button type="button" className="day-row" aria-expanded={isOpen} aria-controls={`day-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                <span className="day-name"><strong>{fmtWeekday(d.date, i)}</strong><small>{fmtDate(d.date)}</small></span>
                <WeatherIcon conditionKey={m.key} size={34} />
                <span className="day-cond">{m.label}</span>
                <span className="day-pop" title="Chance of precipitation">{d.pop != null ? `💧 ${Math.round(d.pop)}%` : '—'}</span>
                <span className="day-wind">{fmtWind(d.windMax, units.wind)}</span>
                <span className="range" aria-label={`Low ${fmtTemp(d.min, units.temp)}, high ${fmtTemp(d.max, units.temp)}`}>
                  <span className="range-lo">{fmtTemp(d.min, units.temp)}</span>
                  <span className="range-bar"><span style={{ left: `${((d.min - lo) / span) * 100}%`, width: `${Math.max(6, ((d.max - d.min) / span) * 100)}%` }} /></span>
                  <span className="range-hi">{fmtTemp(d.max, units.temp)}</span>
                </span>
                <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
              {isOpen && (
                <div className="day-detail" id={`day-${i}`}>
                  <h3 className="sr-only">{fmtDateLong(d.date)}</h3>
                  <dl className="stat-grid compact">
                    <div className="stat"><dt>Feels like</dt><dd>{fmtTemp(d.feelsMin, units.temp)} – {fmtTemp(d.feelsMax, units.temp)}</dd></div>
                    <div className="stat"><dt>Rain chance</dt><dd>{fmtPct(d.pop)}</dd></div>
                    <div className="stat"><dt>Rain total</dt><dd>{fmtMm(d.precipSum)}</dd></div>
                    <div className="stat"><dt>Wind (max)</dt><dd>{fmtWind(d.windMax, units.wind)} {compass(d.windDir)}</dd></div>
                    <div className="stat"><dt>Gusts (max)</dt><dd>{fmtWind(d.gustMax, units.wind)}</dd></div>
                    <div className="stat"><dt>UV (max)</dt><dd>{d.uvMax != null ? Math.round(d.uvMax) : '—'}</dd></div>
                    <div className="stat"><dt>Sunrise</dt><dd>{fmtClock(d.sunrise)}</dd></div>
                    <div className="stat"><dt>Sunset</dt><dd>{fmtClock(d.sunset)}</dd></div>
                    <div className="stat"><dt>Daylight</dt><dd>{fmtDuration(d.daylight)}</dd></div>
                  </dl>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
