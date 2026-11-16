import { useMemo, useState } from 'react'
import WeatherIcon from './WeatherIcon.jsx'
import Chart from './charts/Chart.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { conditionMeta, compass } from '../utils/weatherCodes.js'
import { fmtTemp, toTemp, fmtWind, fmtHour, fmtPct, fmtWeekday, fmtDate, TEMP_UNITS } from '../utils/units.js'

export function useNextHours(count = 24) {
  const { weather } = useWeatherContext()
  const w = weather.data
  return useMemo(() => w.hours.slice(w.nowHourIdx, w.nowHourIdx + count), [w, count])
}

export function HourlyStrip({ count = 24, detailed = false, withChart = true }) {
  const hours = useNextHours(count)
  const { units } = useSettings()
  const u = TEMP_UNITS[units.temp]
  const points = hours.map((h) => ({
    label: fmtHour(h.time),
    tip: `${fmtWeekday(h.time.slice(0, 10), 1)} ${fmtDate(h.time.slice(0, 10))}, ${fmtHour(h.time)}`,
    values: { temp: toTemp(h.temp, units.temp), feels: toTemp(h.feels, units.temp) },
  }))
  const [sel, setSel] = useState(null)

  return (
    <section className="card card-span" aria-labelledby="hr-title">
      <h2 id="hr-title" className="card-title">Next {hours.length} hours</h2>
      <p className="card-sub">Forecast · times are local to the selected place</p>
      <div className="hour-strip" role="list" tabIndex={0} aria-label="Hourly forecast, scroll horizontally">
        {hours.map((h, i) => {
          const m = conditionMeta(h.code, h.isDay)
          return (
            <button type="button" role="listitem" key={h.time} className={`hour ${sel === i ? 'is-sel' : ''}`} onClick={() => setSel(sel === i ? null : i)} aria-pressed={sel === i}>
              <span className="hour-t">{i === 0 ? 'Now' : fmtHour(h.time)}</span>
              <WeatherIcon conditionKey={m.key} size={36} />
              <span className="hour-temp">{fmtTemp(h.temp, units.temp)}</span>
              <span className="hour-pop" title="Chance of precipitation">{h.pop != null ? `💧${Math.round(h.pop)}%` : '—'}</span>
              {detailed && <span className="hour-wind">{fmtWind(h.wind, units.wind, { unit: false })} {compass(h.windDir)}</span>}
            </button>
          )
        })}
      </div>
      {sel != null && (
        <p className="hour-detail" role="status">
          <strong>{fmtHour(hours[sel].time)}</strong> — {conditionMeta(hours[sel].code, hours[sel].isDay).label}, {fmtTemp(hours[sel].temp, units.temp, { unit: true })} (feels {fmtTemp(hours[sel].feels, units.temp)}), humidity {fmtPct(hours[sel].humidity)}, wind {fmtWind(hours[sel].wind, units.wind)} {compass(hours[sel].windDir)}, rain chance {fmtPct(hours[sel].pop)}.
        </p>
      )}
      {withChart && (
        <Chart
          title="Hourly temperature" yLabel={u} height={220} points={points}
          description={`Temperature and feels-like for the next ${hours.length} hours.`}
          series={[{ key: 'temp', label: 'Temperature', color: 'var(--accent)', format: (v) => `${Math.round(v)}${u}`, axisFormat: (v) => Math.round(v) }, { key: 'feels', label: 'Feels like', color: 'var(--accent-2)', format: (v) => `${Math.round(v)}${u}` }]}
        />
      )}
    </section>
  )
}
export default HourlyStrip
