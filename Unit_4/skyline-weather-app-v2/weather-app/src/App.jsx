import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import SkyBackground from './components/SkyBackground.jsx'
import SettingsDrawer from './components/SettingsDrawer.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { WeatherProvider, useWeatherContext } from './context/WeatherContext.jsx'
import TodayPage from './pages/TodayPage.jsx'
import HourlyPage from './pages/HourlyPage.jsx'
import DailyPage from './pages/DailyPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import MapPage from './pages/MapPage.jsx'
import ComparePage from './pages/ComparePage.jsx'
import NewsPage from './pages/NewsPage.jsx'
import './App.css'

function Shell() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { weather } = useWeatherContext()
  const title = weather.data ? `${Math.round(weather.data.current.temp)}° · Skyline` : 'Skyline — Weather'
  useEffect(() => { document.title = title }, [title])
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SkyBackground />
      <div className="app-shell">
        <Header onOpenSettings={() => setSettingsOpen(true)} />
        <main id="main" className="app-main">
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/hourly" element={<HourlyPage />} />
            <Route path="/daily" element={<DailyPage />} />
            <Route path="/10-day" element={<Navigate to="/daily" replace />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>Weather &amp; air quality by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · Alerts: US NWS · Maps © Esri &amp; OpenStreetMap contributors</p>
          <p>Forecasts are model estimates and can change. Not for safety-critical decisions.</p>
        </footer>
      </div>
      {settingsOpen && <SettingsDrawer onClose={() => setSettingsOpen(false)} />}
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <WeatherProvider>
        <HashRouter><Shell /></HashRouter>
      </WeatherProvider>
    </SettingsProvider>
  )
}
