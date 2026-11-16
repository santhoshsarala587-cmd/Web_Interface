import { conditionMeta, isWet } from './weatherCodes.js'
import { fmtTemp, fmtWind, fmtHour } from './units.js'
import { usAqiBand } from './aqi.js'

/** Configurable thresholds — every rule below reads from here. */
export const DEFAULT_THRESHOLDS = {
  umbrellaPop: 40,      // % chance in the next 6 h that triggers "carry an umbrella"
  umbrellaMm: 0.3,      // mm in a single hour that counts as wet
  uvCaution: 6,         // UV index at which sun precautions are suggested
  windStrongKmh: 35,
  heatFeelsC: 35,
  coldFeelsC: 5,
  aqiCaution: 100,
}

const next = (w, n) => w.hours.slice(w.nowHourIdx, w.nowHourIdx + n)
const max = (a) => (a.length ? Math.max(...a) : null)

/** Plain-language summary of *current* conditions, built only from fields we actually have. */
export function describeNow(w, units) {
  const c = w.current
  const cond = conditionMeta(c.code, c.isDay)
  const day = w.days[0]
  const bits = [`${cond.label} right now, ${fmtTemp(c.temp, units.temp)}`]
  if (Math.abs(c.feels - c.temp) >= 2) bits[0] += ` but it feels like ${fmtTemp(c.feels, units.temp)}`
  let s = bits[0] + '.'
  if (day) s += ` Today ranges from ${fmtTemp(day.min, units.temp)} to ${fmtTemp(day.max, units.temp)}.`
  const wet = next(w, 6).filter((h) => h.pop != null).map((h) => h.pop)
  const peak = max(wet)
  if (peak != null) s += peak >= 30 ? ` Rain chance peaks at ${peak}% over the next 6 hours.` : ' Little chance of rain in the next 6 hours.'
  if (c.wind != null && c.wind >= DEFAULT_THRESHOLDS.windStrongKmh) s += ` Winds are strong at ${fmtWind(c.wind, units.wind)}.`
  return s
}

/**
 * Rule-based suggestions. Each returns { id, title, text, tone, basis[] }.
 * `basis` shows the data behind the advice; `unknown` marks rules we couldn't evaluate.
 */
export function buildInsights(w, aq, units, t = DEFAULT_THRESHOLDS) {
  const out = []
  const c = w.current
  const win = next(w, 12)

  // Umbrella
  const pops = win.slice(0, 6).filter((h) => h.pop != null)
  if (!pops.length) {
    out.push({ id: 'umbrella', title: 'Umbrella', tone: 'muted', text: 'Rain probability is not available for this location, so no umbrella advice is given.', basis: [] })
  } else {
    const peakH = pops.reduce((a, b) => (b.pop > a.pop ? b : a))
    const wetHour = win.slice(0, 6).find((h) => h.precip >= t.umbrellaMm)
    const need = peakH.pop >= t.umbrellaPop || !!wetHour
    out.push({
      id: 'umbrella', title: 'Umbrella', tone: need ? 'warn' : 'good',
      text: need ? `An umbrella could be useful — rain looks possible around ${fmtHour((wetHour || peakH).time)}.` : 'Rain looks unlikely over the next 6 hours.',
      basis: [`Peak rain probability next 6 h: ${peakH.pop}% (threshold ${t.umbrellaPop}%)`, wetHour ? `Forecast ≥ ${t.umbrellaMm} mm at ${fmtHour(wetHour.time)}` : 'No hour forecast above the rain-amount threshold'],
    })
  }

  // Outdoor activity
  const bad = []
  if (isWet(c.code)) bad.push('it is currently wet')
  if (c.wind >= t.windStrongKmh) bad.push(`strong wind (${fmtWind(c.wind, units.wind)})`)
  if (c.feels >= t.heatFeelsC) bad.push(`high heat (feels ${fmtTemp(c.feels, units.temp)})`)
  if (c.feels <= t.coldFeelsC) bad.push(`cold (feels ${fmtTemp(c.feels, units.temp)})`)
  if (c.code >= 95) bad.push('thunderstorm conditions')
  out.push({
    id: 'outdoor', title: 'Outdoor activities', tone: bad.length ? 'warn' : 'good',
    text: bad.length ? `Conditions may be less comfortable outdoors: ${bad.join(', ')}.` : 'Conditions look generally comfortable for being outdoors.',
    basis: [`Feels like ${fmtTemp(c.feels, units.temp)}`, `Wind ${fmtWind(c.wind, units.wind)}`, `Condition: ${conditionMeta(c.code, c.isDay).label}`],
  })

  // UV
  const uvToday = w.days[0]?.uvMax
  if (uvToday == null && c.uv == null) {
    out.push({ id: 'uv', title: 'Sun / UV', tone: 'muted', text: 'UV index is not available for this location.', basis: [] })
  } else {
    const peak = uvToday ?? c.uv
    const high = peak >= t.uvCaution
    out.push({
      id: 'uv', title: 'Sun / UV', tone: high ? 'warn' : 'good',
      text: high ? `UV peaks at ${Math.round(peak)} today. Sun protection such as shade, sunscreen and a hat is commonly recommended at this level.` : `UV peaks at ${Math.round(peak)} today — at or below the ${t.uvCaution} threshold.`,
      basis: [`Daily peak UV index ${Math.round(peak)}`, c.uv != null ? `Right now ${Math.round(c.uv)}` : 'Current-hour value unavailable'],
    })
  }

  // Air quality
  if (!aq?.available) {
    out.push({ id: 'air', title: 'Air quality', tone: 'muted', text: 'Air-quality data is unavailable here, so no air advice is given.', basis: [] })
  } else {
    const band = usAqiBand(aq.usAqi)
    const caution = aq.usAqi > t.aqiCaution
    out.push({
      id: 'air', title: 'Air quality', tone: caution ? 'warn' : 'good',
      text: caution ? `Air quality is "${band.label}" (US AQI ${Math.round(aq.usAqi)}). People who are sensitive may want to limit prolonged outdoor exertion.` : `Air quality is "${band.label}" (US AQI ${Math.round(aq.usAqi)}).`,
      basis: [`US AQI ${Math.round(aq.usAqi)} (caution above ${t.aqiCaution})`, 'Modelled data, not a ground sensor reading'],
    })
  }

  // Next hours
  const first = win[0], last = win[Math.min(5, win.length - 1)]
  if (first && last && first !== last) {
    const dT = last.temp - first.temp
    const parts = []
    if (Math.abs(dT) >= 2) parts.push(`temperature ${dT > 0 ? 'rising' : 'falling'} about ${Math.abs(Math.round(units.temp === 'f' ? dT * 9 / 5 : dT))}°`)
    const cl = conditionMeta(last.code, last.isDay).label, c0 = conditionMeta(first.code, first.isDay).label
    if (cl !== c0) parts.push(`${c0.toLowerCase()} giving way to ${cl.toLowerCase()}`)
    out.push({
      id: 'next', title: 'Next few hours', tone: 'info',
      text: parts.length ? `Over the next 6 hours: ${parts.join('; ')}.` : 'Conditions look steady over the next 6 hours.',
      basis: [`Now ${fmtTemp(first.temp, units.temp)} → ${fmtHour(last.time)} ${fmtTemp(last.temp, units.temp)}`],
    })
  }
  return out
}
