import WeatherIcon from './WeatherIcon.jsx'
import LocalClock from './LocalClock.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { conditionMeta, compass } from '../utils/weatherCodes.js'
import { fmtTemp, fmtWind, fmtPressure, fmtVisibility, fmtPct, fmtClock, placeLabel } from '../utils/units.js'
import { describeNow } from '../utils/insights.js'

const uvLabel = (uv) => (uv == null ? '—' : `${Math.round(uv)} · ${uv >= 11 ? 'Extreme' : uv >= 8 ? 'Very high' : uv >= 6 ? 'High' : uv >= 3 ? 'Moderate' : 'Low'}`)

export default function CurrentConditions() {
  const { place, weather, isFavorite, toggleFavorite } = useWeatherContext()
  const { units } = useSettings()
  const w = weather.data
  const c = w.current
  const meta = conditionMeta(c.code, c.isDay)
  const today = w.days[0]
  const fav = isFavorite(place)

  const stats = [
    ['Feels like', fmtTemp(c.feels, units.temp)],
    ['Humidity', fmtPct(c.humidity)],
    ['Wind', `${fmtWind(c.wind, units.wind)} ${compass(c.windDir)}`],
    ['Gusts', fmtWind(c.gust, units.wind)],
    ['Pressure', fmtPressure(c.pressure)],
    ['Visibility', fmtVisibility(c.visibility, units.temp)],
    ['UV index', uvLabel(c.uv)],
    ['Rain chance', fmtPct(c.pop)],
    ['Sunrise', fmtClock(today.sunrise)],
    ['Sunset', fmtClock(today.sunset)],
  ]

  return (
    <section className="card hero card-span" aria-labelledby="hero-title">
      <div className="hero-top">
        <div>
          <h1 id="hero-title" className="hero-place">{placeLabel(place)}</h1>
          <LocalClock timezone={w.utcOffset} compact />
        </div>
        <button type="button" className={`icon-btn fav ${fav ? 'on' : ''}`} onClick={() => toggleFavorite(place)} aria-pressed={fav} aria-label={fav ? `Remove ${place.name} from favorites` : `Add ${place.name} to favorites`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="hero-main">
        <div className="hero-temp">
          <WeatherIcon conditionKey={meta.key} size={96} className="icon-float" />
          <div>
            <div className="temp-xl" aria-label={`Temperature ${fmtTemp(c.temp, units.temp, { unit: true })}`}>{fmtTemp(c.temp, units.temp)}</div>
            <div className="hero-cond">{meta.label}</div>
            <div className="hero-hl">H {fmtTemp(today.max, units.temp)} · L {fmtTemp(today.min, units.temp)} · Feels {fmtTemp(c.feels, units.temp)}</div>
          </div>
        </div>
        <p className="hero-summary">{describeNow(w, units)}</p>
      </div>

      <dl className="stat-grid">
        {stats.map(([k, v]) => (<div key={k} className="stat"><dt>{k}</dt><dd>{v}</dd></div>))}
      </dl>
    </section>
  )
}
