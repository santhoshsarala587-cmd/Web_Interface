import { HourlyStrip } from '../components/HourlyStrip.jsx'
import { WeatherGate } from './TodayPage.jsx'
export default function HourlyPage() {
  return <WeatherGate><div className="grid-dash"><HourlyStrip count={48} detailed /></div></WeatherGate>
}
