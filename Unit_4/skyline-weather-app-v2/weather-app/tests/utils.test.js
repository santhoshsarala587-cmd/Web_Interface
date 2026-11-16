import test from 'node:test'
import assert from 'node:assert/strict'
import { conditionMeta, compass } from '../src/utils/weatherCodes.js'
import { fmtTemp, fmtWind, fmtClock, fmtWeekday, fmtVisibility } from '../src/utils/units.js'
import { usAqiBand, euAqiBand } from '../src/utils/aqi.js'
import { buildInsights, DEFAULT_THRESHOLDS } from '../src/utils/insights.js'

test('WMO codes map to labels/icons', () => {
  assert.equal(conditionMeta(0, true).key, 'clear-day')
  assert.equal(conditionMeta(0, false).key, 'clear-night')
  assert.equal(conditionMeta(95).key, 'thunder')
  assert.equal(compass(90), 'E')
})

test('unit conversion is display-only and consistent', () => {
  assert.equal(fmtTemp(0, 'f'), '32°')
  assert.equal(fmtTemp(null, 'c'), '—')
  assert.equal(fmtWind(36, 'ms', { unit: false }), '10')
  assert.equal(fmtWind(100, 'mph'), '62 mph')
  assert.equal(fmtVisibility(24000, 'c'), '24 km')
})

test('local time strings are not shifted by the viewer timezone', () => {
  assert.equal(fmtClock('2026-10-17T06:02'), '6:02 AM')
  assert.equal(fmtWeekday('2026-10-18', 1), 'Sun')
  assert.equal(fmtWeekday('2026-10-17', 0), 'Today')
})

test('AQI bands use the right scales', () => {
  assert.equal(usAqiBand(112).label, 'Unhealthy for sensitive groups')
  assert.equal(euAqiBand(48).label, 'Moderate')
})

const hour = (i, o = {}) => ({ time: `2026-10-17T${String(10 + i).padStart(2, '0')}:00`, temp: 30, feels: 32, pop: 10, precip: 0, code: 1, isDay: true, wind: 10, ...o })
const wx = (hours, cur = {}) => ({ nowHourIdx: 0, hours, days: [{ uvMax: 3, min: 25, max: 32 }], current: { temp: 30, feels: 32, code: 1, isDay: true, wind: 10, uv: 2, ...cur } })

test('insights: umbrella rule respects threshold and missing data', () => {
  const units = { temp: 'c', wind: 'kmh' }
  const wet = buildInsights(wx(Array.from({ length: 8 }, (_, i) => hour(i, { pop: i === 2 ? 70 : 5 }))), null, units)
  assert.equal(wet.find((i) => i.id === 'umbrella').tone, 'warn')
  const none = buildInsights(wx(Array.from({ length: 8 }, (_, i) => hour(i, { pop: null }))), null, units)
  assert.equal(none.find((i) => i.id === 'umbrella').tone, 'muted')
  assert.equal(none.find((i) => i.id === 'air').tone, 'muted') // no AQ data -> no advice invented
  assert.ok(DEFAULT_THRESHOLDS.umbrellaPop > 0)
})
