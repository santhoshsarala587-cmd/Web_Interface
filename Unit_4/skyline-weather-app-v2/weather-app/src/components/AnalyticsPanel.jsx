import { useMemo, useState } from 'react'
import Chart from './charts/Chart.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { toTemp, toWind, fmtHour, fmtWeekday, fmtDate, TEMP_UNITS, WIND_UNITS } from '../utils/units.js'

const VIEWS = [['temp', 'Temperature'], ['range', 'Min / Max'], ['pop', 'Precipitation'], ['wind', 'Wind'], ['humidity', 'Humidity']]

export default function AnalyticsPanel() {
  const { weather } = useWeatherContext()
  const { units } = useSettings()
  const [view, setView] = useState('temp')
  const [span, setSpan] = useState(48)
  const w = weather.data
  const tu = TEMP_UNITS[units.temp], wu = WIND_UNITS[units.wind]

  // One shared hourly slice feeds every hourly view — no duplicated data.
  const hours = useMemo(() => w.hours.slice(w.nowHourIdx, w.nowHourIdx + span), [w, span])
  const hp = useMemo(() => hours.map((h) => ({
    label: fmtHour(h.time),
    tip: `${fmtWeekday(h.time.slice(0, 10), 1)} ${fmtDate(h.time.slice(0, 10))}, ${fmtHour(h.time)}`,
    values: { temp: toTemp(h.temp, units.temp), feels: toTemp(h.feels, units.temp), pop: h.pop, wind: toWind(h.wind, units.wind), gust: toWind(h.gust, units.wind), humidity: h.humidity },
  })), [hours, units])
  const dp = useMemo(() => w.days.slice(0, 7).map((d, i) => ({
    label: fmtWeekday(d.date, i), tip: `${fmtWeekday(d.date, i, true)}, ${fmtDate(d.date)}`,
    values: { lo: toTemp(d.min, units.temp), hi: toTemp(d.max, units.temp) },
  })), [w, units])

  const hourlyView = view !== 'range'
  return (
    <section className="card card-span" aria-labelledby="an-title">
      <div className="card-head">
        <div><h2 id="an-title" className="card-title">Weather analytics</h2><p className="card-sub">Forecast data charted from the selected place. Hover, tap, or use arrow keys to inspect values.</p></div>
        {hourlyView && (
          <div className="seg" role="group" aria-label="Time span">
            {[24, 48, 72].map((n) => <button key={n} type="button" className={span === n ? 'on' : ''} aria-pressed={span === n} onClick={() => setSpan(n)}>{n}h</button>)}
          </div>
        )}
      </div>
      <div className="tabs" role="tablist" aria-label="Chart view">
        {VIEWS.map(([k, l]) => <button key={k} role="tab" type="button" aria-selected={view === k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{l}</button>)}
      </div>

      {view === 'temp' && <Chart title="Temperature trend" yLabel={tu} points={hp} description={`Hourly temperature and feels-like in ${tu} over the next ${span} hours.`}
        series={[{ key: 'temp', label: 'Temperature', color: 'var(--accent)', format: (v) => `${Math.round(v)}${tu}` }, { key: 'feels', label: 'Feels like', color: 'var(--accent-2)', format: (v) => `${Math.round(v)}${tu}` }]} />}
      {view === 'range' && <Chart kind="range" title="Daily minimum and maximum" yLabel={tu} points={dp} description={`Daily lows and highs in ${tu} for the next 7 days.`}
        series={[{ key: 'lo', label: 'Min', format: (v) => `${Math.round(v)}${tu}` }, { key: 'hi', label: 'Max', format: (v) => `${Math.round(v)}${tu}` }]} />}
      {view === 'pop' && <Chart kind="bar" title="Precipitation probability" yLabel="%" yMax={100} points={hp} maxLabels={8} description={`Hourly chance of precipitation in percent over the next ${span} hours.`}
        series={[{ key: 'pop', label: 'Rain chance', color: 'var(--rain)', format: (v) => `${Math.round(v)}%` }]} />}
      {view === 'wind' && <Chart title="Wind speed" yLabel={wu} zeroBase points={hp} description={`Hourly wind speed and gusts in ${wu}.`}
        series={[{ key: 'wind', label: 'Wind', color: 'var(--accent)', format: (v) => `${Math.round(v)} ${wu}` }, { key: 'gust', label: 'Gusts', color: 'var(--warm)', format: (v) => `${Math.round(v)} ${wu}` }]} />}
      {view === 'humidity' && <Chart title="Relative humidity" yLabel="%" yMax={100} points={hp} description={`Hourly relative humidity in percent.`}
        series={[{ key: 'humidity', label: 'Humidity', color: 'var(--accent-2)', format: (v) => `${Math.round(v)}%` }]} />}
    </section>
  )
}
