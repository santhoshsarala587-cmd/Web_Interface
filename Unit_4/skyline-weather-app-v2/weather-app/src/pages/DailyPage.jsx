import DailyForecast from '../components/DailyForecast.jsx'
import { WeatherGate } from './TodayPage.jsx'
export default function DailyPage() {
  return <WeatherGate><div className="grid-dash"><DailyForecast limit={7} /></div></WeatherGate>
}
