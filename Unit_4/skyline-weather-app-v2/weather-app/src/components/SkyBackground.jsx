import { useEffect } from 'react'
import { themeVars } from '../utils/atmosphere.js'
import WeatherFX from './WeatherFX.jsx'
import { useWeatherContext } from '../context/WeatherContext.jsx'

/** Condition + local-time driven backdrop. Colours come from the atmosphere engine. */
export default function SkyBackground() {
  const { sky: theme, weather } = useWeatherContext()
  const c = weather.data?.current
  useEffect(() => {
    const root = document.documentElement
    Object.entries(themeVars(theme)).forEach(([k, v]) => root.style.setProperty(k, v))
    root.setAttribute('data-band', theme.band)
    root.setAttribute('data-phase', theme.phase)
  }, [theme])
  return (
    <div className="sky-bg" aria-hidden="true">
      <div className="sky-bg-layer" />
      <div className={`sky-orb ${theme.isNight ? 'is-moon' : 'is-sun'}`} />
      <div className="sky-stars" data-visible={theme.isNight ? 'yes' : 'no'} />
      <WeatherFX code={c?.code} isDay={c?.isDay} />
    </div>
  )
}
