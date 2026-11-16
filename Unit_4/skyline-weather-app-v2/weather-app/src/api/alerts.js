import { getJson } from './http.js'

/**
 * Official alerts. Open-Meteo has no alert feed, so we use the US National Weather
 * Service (api.weather.gov — free, CORS-enabled, no key) for US coordinates only.
 * For everywhere else the UI says plainly that no alert feed is configured.
 */
export function alertsSupported(place) {
  return place?.countryCode === 'US'
}

export async function fetchAlerts(lat, lon, { signal } = {}) {
  const url = `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`
  const { data, fetchedAt } = await getJson(url, { ttl: 5 * 60 * 1000, signal })
  const alerts = (data.features || []).map((f) => ({
    id: f.id,
    event: f.properties.event,
    severity: f.properties.severity, // Minor | Moderate | Severe | Extreme | Unknown
    headline: f.properties.headline,
    area: f.properties.areaDesc,
    sender: f.properties.senderName,
    expires: f.properties.expires || f.properties.ends,
    description: f.properties.description,
  }))
  return { alerts, fetchedAt, source: 'US National Weather Service' }
}
