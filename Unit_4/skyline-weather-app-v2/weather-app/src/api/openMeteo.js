import { getJson } from './http.js'

const GEO = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST = 'https://api.open-meteo.com/v1/forecast'
const AIR = 'https://air-quality-api.open-meteo.com/v1/air-quality'

const FORECAST_TTL = 10 * 60 * 1000 // weather models update roughly hourly
const AIR_TTL = 30 * 60 * 1000
const GEO_TTL = 60 * 60 * 1000

/** City autocomplete. Results carry region + country so same-named cities can be told apart. */
export async function searchCities(query, { signal } = {}) {
  const url = `${GEO}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
  const { data } = await getJson(url, { ttl: GEO_TTL, signal })
  return (data.results || []).map(normalizePlace)
}

export function normalizePlace(r) {
  return {
    id: r.id ?? `${r.latitude.toFixed(2)},${r.longitude.toFixed(2)}`,
    name: r.name,
    region: r.admin1 || '',
    country: r.country || '',
    countryCode: r.country_code || '',
    lat: r.latitude,
    lon: r.longitude,
    timezone: r.timezone || null,
  }
}

const CURRENT = [
  'temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'is_day', 'precipitation',
  'weather_code', 'cloud_cover', 'pressure_msl', 'surface_pressure', 'wind_speed_10m',
  'wind_direction_10m', 'wind_gusts_10m',
].join(',')

const HOURLY = [
  'temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'precipitation_probability',
  'precipitation', 'weather_code', 'cloud_cover', 'visibility', 'wind_speed_10m', 'wind_direction_10m',
  'wind_gusts_10m', 'uv_index', 'is_day',
].join(',')

const DAILY = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min', 'apparent_temperature_max',
  'apparent_temperature_min', 'sunrise', 'sunset', 'daylight_duration', 'uv_index_max',
  'precipitation_sum', 'precipitation_probability_max', 'wind_speed_10m_max', 'wind_gusts_10m_max',
  'wind_direction_10m_dominant',
].join(',')

/**
 * Forecast in provider-native units (°C, km/h, mm, hPa, m). Unit conversion is a
 * pure display concern (see utils/units.js) so changing units never refetches.
 * timezone=auto makes every time string local to the place; utc_offset_seconds is returned too.
 */
export async function fetchForecast(lat, lon, { signal, force = false } = {}) {
  const url =
    `${FORECAST}?latitude=${lat}&longitude=${lon}` +
    `&current=${CURRENT}&hourly=${HOURLY}&daily=${DAILY}` +
    `&forecast_days=8&past_hours=0&timezone=auto&timeformat=iso8601`
  const { data, fetchedAt, fromCache } = await getJson(url, { ttl: FORECAST_TTL, signal, force })
  return { ...normalizeForecast(data), fetchedAt, fromCache }
}

function normalizeForecast(d) {
  const h = d.hourly
  const hours = h.time.map((t, i) => ({
    time: t, // local ISO without offset, e.g. 2026-10-15T14:00
    temp: h.temperature_2m[i],
    feels: h.apparent_temperature[i],
    humidity: h.relative_humidity_2m[i],
    pop: h.precipitation_probability?.[i] ?? null,
    precip: h.precipitation[i],
    code: h.weather_code[i],
    clouds: h.cloud_cover[i],
    visibility: h.visibility?.[i] ?? null,
    wind: h.wind_speed_10m[i],
    windDir: h.wind_direction_10m[i],
    gust: h.wind_gusts_10m?.[i] ?? null,
    uv: h.uv_index?.[i] ?? null,
    isDay: h.is_day[i] === 1,
  }))

  const dy = d.daily
  const days = dy.time.map((t, i) => ({
    date: t, // YYYY-MM-DD at the place
    code: dy.weather_code[i],
    max: dy.temperature_2m_max[i],
    min: dy.temperature_2m_min[i],
    feelsMax: dy.apparent_temperature_max[i],
    feelsMin: dy.apparent_temperature_min[i],
    sunrise: dy.sunrise[i],
    sunset: dy.sunset[i],
    daylight: dy.daylight_duration[i],
    uvMax: dy.uv_index_max?.[i] ?? null,
    precipSum: dy.precipitation_sum[i],
    pop: dy.precipitation_probability_max?.[i] ?? null,
    windMax: dy.wind_speed_10m_max[i],
    gustMax: dy.wind_gusts_10m_max?.[i] ?? null,
    windDir: dy.wind_direction_10m_dominant?.[i] ?? null,
  }))

  const c = d.current
  const nowHourIdx = hours.findIndex((x) => x.time.slice(0, 13) === c.time.slice(0, 13))
  const current = {
    time: c.time,
    temp: c.temperature_2m,
    feels: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    isDay: c.is_day === 1,
    precip: c.precipitation,
    code: c.weather_code,
    clouds: c.cloud_cover,
    pressure: c.pressure_msl,
    wind: c.wind_speed_10m,
    windDir: c.wind_direction_10m,
    gust: c.wind_gusts_10m,
    // Visibility, UV and rain chance are hourly-only in this provider: take the current hour's value.
    visibility: nowHourIdx >= 0 ? hours[nowHourIdx].visibility : null,
    uv: nowHourIdx >= 0 ? hours[nowHourIdx].uv : null,
    pop: nowHourIdx >= 0 ? hours[nowHourIdx].pop : null,
  }

  return {
    utcOffset: d.utc_offset_seconds,
    timezone: d.timezone,
    elevation: d.elevation,
    current,
    hours,
    days,
    nowHourIdx: Math.max(0, nowHourIdx),
  }
}

/** Air quality: both AQI scales + pollutants (µg/m³). */
export async function fetchAirQuality(lat, lon, { signal, force = false } = {}) {
  const cur = 'us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone'
  const url = `${AIR}?latitude=${lat}&longitude=${lon}&current=${cur}&timezone=auto`
  const { data, fetchedAt } = await getJson(url, { ttl: AIR_TTL, signal, force })
  const c = data.current
  if (!c || (c.us_aqi == null && c.european_aqi == null)) return { available: false, fetchedAt }
  return {
    available: true,
    time: c.time,
    usAqi: c.us_aqi,
    euAqi: c.european_aqi,
    pollutants: {
      pm25: c.pm2_5, pm10: c.pm10, o3: c.ozone, no2: c.nitrogen_dioxide, so2: c.sulphur_dioxide, co: c.carbon_monoxide,
    },
    fetchedAt,
  }
}
