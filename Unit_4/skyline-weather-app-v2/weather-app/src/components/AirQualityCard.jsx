import { useWeatherContext } from '../context/WeatherContext.jsx'
import { usAqiBand, euAqiBand, POLLUTANTS } from '../utils/aqi.js'
import { fmtClock, fmtDate } from '../utils/units.js'
import { Skeleton } from './StatusStates.jsx'

export default function AirQualityCard() {
  const { air } = useWeatherContext()
  if (air.status === 'loading' && !air.data) return <Skeleton className="sk-card" />
  const a = air.data

  return (
    <section className="card" aria-labelledby="aq-title">
      <h2 id="aq-title" className="card-title">Air quality</h2>
      {!a?.available ? (
        <p className="empty-note" role="status">{air.status === 'error' ? `Air-quality data could not be loaded: ${air.error}` : 'Air-quality data is not available for this location.'}</p>
      ) : (() => {
        const band = usAqiBand(a.usAqi)
        return (
          <>
            <div className="aqi-main">
              <div className={`aqi-badge tone-${band.tone}`}><strong>{Math.round(a.usAqi)}</strong><span>US AQI</span></div>
              <div>
                <p className="aqi-label">{band.label}</p>
                {a.euAqi != null && <p className="muted">European EAQI: {Math.round(a.euAqi)} ({euAqiBand(a.euAqi).label})</p>}
              </div>
            </div>
            <p className="aqi-advice">{band.advice}</p>
            <dl className="stat-grid compact">
              {POLLUTANTS.map((p) => (
                <div className="stat" key={p.key}><dt>{p.label}</dt><dd>{a.pollutants[p.key] != null ? `${Math.round(a.pollutants[p.key] * 10) / 10}` : '—'} <small>{p.unit}</small></dd></div>
              ))}
            </dl>
            <p className="fineprint">Scale: US EPA AQI (0–500); the European index is a different scale and not directly comparable. Modelled estimate from Open-Meteo / CAMS, observed {fmtDate(a.time.slice(0, 10))} {fmtClock(a.time)} local time.</p>
          </>
        )
      })()}
    </section>
  )
}
