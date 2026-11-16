import { useWeatherContext } from '../context/WeatherContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import CurrentConditions from '../components/CurrentConditions.jsx'
import InsightsPanel from '../components/InsightsPanel.jsx'
import { HourlyStrip } from '../components/HourlyStrip.jsx'
import DailyForecast from '../components/DailyForecast.jsx'
import AirQualityCard from '../components/AirQualityCard.jsx'
import AlertsPanel from '../components/AlertsPanel.jsx'
import AnalyticsPanel from '../components/AnalyticsPanel.jsx'
import CityPhotoBanner from '../components/CityPhotoBanner.jsx'
import { DashboardSkeleton, ErrorState } from '../components/StatusStates.jsx'
import { FEATURED_LOCATIONS } from '../data/featuredLocations.js'

export function WeatherGate({ children }) {
  const { weather, refresh } = useWeatherContext()
  if (!weather.data && weather.status === 'error') return <ErrorState message={weather.error} onRetry={refresh} />
  if (!weather.data) return <DashboardSkeleton />
  return (
    <>
      {weather.status === 'error' && <p className="notice err" role="alert">Couldn’t refresh: {weather.error} Showing the last data we received — it may be out of date. <button className="link-btn" onClick={refresh}>Retry</button></p>}
      {children}
    </>
  )
}

function QuickPicks() {
  const { favorites, selectPlace, place } = useWeatherContext()
  const list = favorites.length ? favorites : FEATURED_LOCATIONS
  return (
    <nav className="chips quick" aria-label={favorites.length ? 'Favorite locations' : 'Suggested locations'}>
      <span className="chips-label">{favorites.length ? 'Favorites' : 'Quick picks'}</span>
      {list.map((p) => <button key={`${p.lat}${p.lon}`} type="button" className={`chip ${p.name === place.name ? 'on' : ''}`} aria-pressed={p.name === place.name} onClick={() => selectPlace({ id: p.id || p.name, countryCode: 'IN', country: 'India', region: '', ...p })}>{p.name}</button>)}
    </nav>
  )
}

export default function TodayPage() {
  const { settings } = useSettings()
  const { photo } = useWeatherContext()
  const wd = settings.widgets
  return (
    <>
      <QuickPicks />
      <WeatherGate>
        <div className="grid-dash">
          <CurrentConditions />
          {wd.photo && (photo.status === 'ready' || photo.status === 'loading') && <div className="card-span"><CityPhotoBanner photo={photo.photo} status={photo.status} /></div>}
          {wd.alerts && <AlertsPanel />}
          {wd.insights && <InsightsPanel />}
          {wd.air && <AirQualityCard />}
          {wd.hourly && <HourlyStrip count={24} />}
          {wd.daily && <DailyForecast />}
          {wd.analytics && <AnalyticsPanel />}
        </div>
      </WeatherGate>
    </>
  )
}
