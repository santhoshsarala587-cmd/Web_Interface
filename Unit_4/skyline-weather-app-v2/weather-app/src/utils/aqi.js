/**
 * Open-Meteo returns both scales. We show the US EPA AQI (0–500) as primary and the
 * European EAQI (1–100+) as secondary. They are different systems and must not be compared.
 */
const US = [
  { max: 50, label: 'Good', tone: 'good', advice: 'Air quality is satisfactory. Outdoor activity is generally fine.' },
  { max: 100, label: 'Moderate', tone: 'warn', advice: 'Acceptable for most people. Unusually sensitive individuals may want to limit prolonged outdoor exertion.' },
  { max: 150, label: 'Unhealthy for sensitive groups', tone: 'warn', advice: 'People with asthma, heart or lung conditions, children and older adults may want to reduce prolonged or heavy outdoor exertion.' },
  { max: 200, label: 'Unhealthy', tone: 'danger', advice: 'Everyone may begin to notice effects. Consider shorter or lighter outdoor activity, especially for sensitive groups.' },
  { max: 300, label: 'Very unhealthy', tone: 'danger', advice: 'Health alert level: consider avoiding outdoor exertion and keeping windows closed.' },
  { max: Infinity, label: 'Hazardous', tone: 'danger', advice: 'Emergency conditions reported. Limit time outdoors and follow local health authority guidance.' },
]
export const usAqiBand = (v) => US.find((b) => v <= b.max)

const EU = [
  { max: 20, label: 'Good' }, { max: 40, label: 'Fair' }, { max: 60, label: 'Moderate' },
  { max: 80, label: 'Poor' }, { max: 100, label: 'Very poor' }, { max: Infinity, label: 'Extremely poor' },
]
export const euAqiBand = (v) => EU.find((b) => v <= b.max)

export const POLLUTANTS = [
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³' },
  { key: 'o3', label: 'Ozone (O₃)', unit: 'µg/m³' },
  { key: 'no2', label: 'NO₂', unit: 'µg/m³' },
  { key: 'so2', label: 'SO₂', unit: 'µg/m³' },
  { key: 'co', label: 'CO', unit: 'µg/m³' },
]
