/** WMO weather interpretation codes (used by Open-Meteo) -> icon key + label. */
export function conditionMeta(code, isDay = true) {
  const d = isDay
  if (code === 0) return { key: d ? 'clear-day' : 'clear-night', label: d ? 'Clear sky' : 'Clear night' }
  if (code === 1) return { key: d ? 'clear-day' : 'clear-night', label: d ? 'Mainly clear' : 'Mainly clear' }
  if (code === 2) return { key: d ? 'cloud-day' : 'cloud-night', label: 'Partly cloudy' }
  if (code === 3) return { key: 'clouds', label: 'Overcast' }
  if (code === 45 || code === 48) return { key: 'mist', label: code === 48 ? 'Rime fog' : 'Fog' }
  if (code >= 51 && code <= 57) return { key: 'drizzle', label: code >= 56 ? 'Freezing drizzle' : 'Drizzle' }
  if (code >= 61 && code <= 67) return { key: 'rain', label: code >= 66 ? 'Freezing rain' : code === 65 ? 'Heavy rain' : code === 63 ? 'Rain' : 'Light rain' }
  if (code >= 71 && code <= 77) return { key: 'snow', label: code === 75 ? 'Heavy snow' : code === 77 ? 'Snow grains' : 'Snow' }
  if (code >= 80 && code <= 82) return { key: 'rain', label: code === 82 ? 'Violent rain showers' : 'Rain showers' }
  if (code === 85 || code === 86) return { key: 'snow', label: 'Snow showers' }
  if (code >= 95) return { key: 'thunder', label: code >= 96 ? 'Thunderstorm with hail' : 'Thunderstorm' }
  return { key: 'clouds', label: 'Cloudy' }
}

export const isWet = (code) => (code >= 51 && code <= 67) || (code >= 80 && code <= 86) || code >= 95
export const compass = (deg) => (deg == null ? '' : ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(deg / 22.5) % 16])
