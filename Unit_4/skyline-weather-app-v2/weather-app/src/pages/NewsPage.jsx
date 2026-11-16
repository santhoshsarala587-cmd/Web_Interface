import { useWeatherContext } from '../context/WeatherContext.jsx'
import AlertsPanel from '../components/AlertsPanel.jsx'
import { Skeleton } from '../components/StatusStates.jsx'
import { fmtAgo } from '../utils/units.js'

export default function NewsPage() {
  const { news, place } = useWeatherContext()
  return (
    <div className="grid-dash">
      <div className="card-span"><AlertsPanel /></div>
      <section className="card card-span" aria-labelledby="news-title">
        <h2 id="news-title" className="card-title">Weather-related news · {place.name}</h2>
        <p className="card-sub">General news headlines from NewsAPI. These are articles by third parties — not official alerts or forecasts.</p>
        {news.status === 'loading' && <Skeleton className="sk-card" />}
        {news.status === 'no-key' && <p className="empty-note">Add a free NewsAPI key in Settings → API keys to see headlines. Without a key, no news is shown.</p>}
        {news.status === 'unauthorized' && <p className="empty-note" role="alert">NewsAPI rejected the key. Check it in Settings.</p>}
        {news.status === 'error' && <p className="empty-note" role="alert">News could not be loaded. Note: NewsAPI’s free plan often only works from localhost.</p>}
        {news.status === 'empty' && <p className="empty-note">No recent weather-related articles found for {place.name}.</p>}
        <ul className="news-list">
          {news.articles.map((a) => (
            <li key={a.url}><a href={a.url} target="_blank" rel="noopener noreferrer"><strong>{a.title}</strong><span>{a.source} · {new Date(a.publishedAt).toLocaleDateString()} ({fmtAgo(new Date(a.publishedAt).getTime())})</span></a></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
