import { useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import WeatherIcon from '../components/WeatherIcon.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useMultiWeather } from '../hooks/useWeatherData.js'
import { conditionMeta } from '../utils/weatherCodes.js'
import { usAqiBand } from '../utils/aqi.js'
import { fmtTemp, fmtWind, fmtPct, fmtWeekday, fmtDate, fmtDateLong, fmtMm, placeKey, placeLabel } from '../utils/units.js'
import { Skeleton } from '../components/StatusStates.jsx'

const key = (p) => `${p.lat},${p.lon}`

function Compare() {
  const { place, favorites } = useWeatherContext()
  const { units } = useSettings()
  const [cities, setCities] = useLocalStorage('skyline_compare_v2', [])
  const list = cities.length ? cities : [place]
  const data = useMultiWeather(list)
  const add = (p) => setCities((c) => (c.some((x) => placeKey(x) === placeKey(p)) || c.length >= 5 ? c : [...(c.length ? c : [place]), p].filter((x, i, a) => a.findIndex((y) => placeKey(y) === placeKey(x)) === i).slice(0, 5)))
  const remove = (p) => setCities((c) => c.filter((x) => placeKey(x) !== placeKey(p)))

  const rows = [
    ['Condition (now)', (d) => conditionMeta(d.current.code, d.current.isDay).label],
    ['Temperature (now)', (d) => fmtTemp(d.current.temp, units.temp, { unit: true })],
    ['Feels like (now)', (d) => fmtTemp(d.current.feels, units.temp, { unit: true })],
    ['Wind (now)', (d) => fmtWind(d.current.wind, units.wind)],
    ['Humidity (now)', (d) => fmtPct(d.current.humidity)],
    ['Rain chance (today, forecast)', (d) => fmtPct(d.days[0].pop)],
    ['High / Low (today, forecast)', (d) => `${fmtTemp(d.days[0].max, units.temp)} / ${fmtTemp(d.days[0].min, units.temp)}`],
    ['Air quality (now, US AQI)', (d, a) => (a?.available ? `${Math.round(a.usAqi)} · ${usAqiBand(a.usAqi).label}` : 'Unavailable')],
  ]
  return (
    <section className="card card-span" aria-labelledby="cmp-title">
      <h2 id="cmp-title" className="card-title">Compare cities</h2>
      <p className="card-sub">Add up to 5 cities. “Now” rows are current conditions; “forecast” rows are predictions for today.</p>
      <div className="cmp-add">
        <SearchBar onPick={add} showGeo={false} placeholder="Add a city to compare…" compact />
        {favorites.length > 0 && <div className="chips" aria-label="Add a favorite">{favorites.slice(0, 5).map((f) => <button key={key(f)} type="button" className="chip" onClick={() => add(f)}>+ {f.name}</button>)}</div>}
      </div>
      <div className="table-wrap">
        <table className="cmp-table">
          <thead><tr><th scope="col"><span className="sr-only">Measure</span></th>
            {list.map((p) => (
              <th scope="col" key={key(p)}>
                <span className="cmp-name">{p.name}</span><small>{[p.region, p.country].filter(Boolean).join(', ')}</small>
                {cities.length > 0 && <button type="button" className="link-btn" onClick={() => remove(p)} aria-label={`Remove ${p.name} from comparison`}>Remove</button>}
              </th>))}
          </tr></thead>
          <tbody>
            {rows.map(([label, fn]) => (
              <tr key={label}><th scope="row">{label}</th>
                {list.map((p) => {
                  const s = data[key(p)]
                  if (!s || s.status === 'loading') return <td key={key(p)}><Skeleton style={{ height: 16, width: 70 }} /></td>
                  if (s.status === 'error') return <td key={key(p)} className="err">Failed</td>
                  return <td key={key(p)}>{fn(s.data, s.air)}</td>
                })}
              </tr>))}
          </tbody>
        </table>
      </div>
      {list.length < 2 && <p className="empty-note">Add at least one more city to compare side by side.</p>}
    </section>
  )
}

function Travel() {
  const [dest, setDest] = useLocalStorage('skyline_dest_v2', null)
  const { units } = useSettings()
  const data = useMultiWeather(dest ? [dest] : [])
  const [pick, setPick] = useState('')
  const s = dest ? data[key(dest)] : null
  const d = s?.data
  const day = d && pick ? d.days.find((x) => x.date === pick) : null
  const last = d?.days[d.days.length - 1]?.date

  return (
    <section className="card card-span" aria-labelledby="trv-title">
      <h2 id="trv-title" className="card-title">Destination weather</h2>
      <p className="card-sub">Explore where you’d like to go. Forecasts are available for roughly the next week only.</p>
      <SearchBar onPick={(p) => { setDest(p); setPick('') }} showGeo={false} placeholder="Where do you want to go?" compact />
      {!dest && <p className="empty-note">Search for a destination to see its current conditions and forecast.</p>}
      {dest && (!s || s.status === 'loading') && <Skeleton className="sk-card" />}
      {s?.status === 'error' && <p className="notice err" role="alert">{s.error}</p>}
      {d && (
        <>
          <h3 className="sub-h">{placeLabel(dest)}</h3>
          <p className="fineprint">Right now: {conditionMeta(d.current.code, d.current.isDay).label}, {fmtTemp(d.current.temp, units.temp, { unit: true })}. This is <em>current</em> weather — not what you’ll find on your travel date.</p>
          <div className="trip-days" role="group" aria-label="Pick a day in the forecast">
            {d.days.map((x, i) => (
              <button key={x.date} type="button" className={`trip-day ${pick === x.date ? 'on' : ''}`} aria-pressed={pick === x.date} onClick={() => setPick(pick === x.date ? '' : x.date)}>
                <small>{fmtWeekday(x.date, i)} {fmtDate(x.date)}</small>
                <WeatherIcon conditionKey={conditionMeta(x.code, true).key} size={30} />
                <strong>{fmtTemp(x.max, units.temp)} / {fmtTemp(x.min, units.temp)}</strong>
                <small>{x.pop != null ? `💧${Math.round(x.pop)}%` : ''}</small>
              </button>
            ))}
          </div>
          {day ? (
            <p className="hour-detail" role="status"><strong>{fmtDateLong(day.date)} (forecast):</strong> {conditionMeta(day.code, true).label}, high {fmtTemp(day.max, units.temp, { unit: true })}, low {fmtTemp(day.min, units.temp, { unit: true })}, rain chance {fmtPct(day.pop)}, expected rainfall {fmtMm(day.precipSum)}, wind up to {fmtWind(day.windMax, units.wind)}. Forecasts change — recheck closer to your trip.</p>
          ) : <p className="fineprint">Select a day for details. Forecast data ends {fmtDate(last)}; later dates cannot be forecast reliably and no values are shown for them.</p>}
        </>
      )}
    </section>
  )
}

export default function ComparePage() {
  const [tab, setTab] = useState('compare')
  return (
    <div className="grid-dash">
      <div className="tabs card-span" role="tablist" aria-label="Compare or travel">
        <button role="tab" type="button" aria-selected={tab === 'compare'} className={tab === 'compare' ? 'on' : ''} onClick={() => setTab('compare')}>Compare cities</button>
        <button role="tab" type="button" aria-selected={tab === 'travel'} className={tab === 'travel' ? 'on' : ''} onClick={() => setTab('travel')}>Travel planner</button>
      </div>
      {tab === 'compare' ? <Compare /> : <Travel />}
    </div>
  )
}
