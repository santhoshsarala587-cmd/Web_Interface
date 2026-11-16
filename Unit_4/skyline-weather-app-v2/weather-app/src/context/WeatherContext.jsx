import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useWeatherData, useLocalNews, useCityPhoto } from '../hooks/useWeatherData.js'
import { placeKey } from '../utils/units.js'
import { conditionMeta } from '../utils/weatherCodes.js'
import { skyTheme, localHourFromIso } from '../utils/atmosphere.js'

const Ctx = createContext(null)
const DEFAULT_PLACE = { id: 'chennai', name: 'Chennai', region: 'Tamil Nadu', country: 'India', countryCode: 'IN', lat: 13.0827, lon: 80.2707 }

export function WeatherProvider({ children }) {
  const [place, setPlace] = useLocalStorage('skyline_place_v2', DEFAULT_PLACE)
  const [favorites, setFavorites] = useLocalStorage('skyline_favorites_v2', [])
  const [recents, setRecents] = useLocalStorage('skyline_recents_v2', [])
  const [geo, setGeo] = useState({ status: 'idle', error: null })

  const { weather, air, alerts, refresh, stale } = useWeatherData(place)
  const news = useLocalNews(place)
  const photo = useCityPhoto(place)

  const selectPlace = useCallback((p) => {
    setPlace(p)
    setRecents((r) => [p, ...r.filter((x) => placeKey(x) !== placeKey(p))].slice(0, 6))
  }, [setPlace, setRecents])

  const isFavorite = useCallback((p) => favorites.some((f) => placeKey(f) === placeKey(p)), [favorites])
  const toggleFavorite = useCallback((p) => {
    setFavorites((f) => (f.some((x) => placeKey(x) === placeKey(p)) ? f.filter((x) => placeKey(x) !== placeKey(p)) : [...f, p].slice(0, 12)))
  }, [setFavorites])
  const clearRecents = useCallback(() => setRecents([]), [setRecents])

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) { setGeo({ status: 'error', error: 'Your browser does not support geolocation.' }); return }
    setGeo({ status: 'loading', error: null })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        const p = { id: `geo-${lat.toFixed(2)}-${lon.toFixed(2)}`, name: 'My location', region: '', country: '', countryCode: '', lat, lon, isCurrent: true }
        setGeo({ status: 'ready', error: null, position: { lat, lon } })
        selectPlace(p)
      },
      (err) => setGeo({
        status: 'error',
        error: err.code === 1 ? 'Location permission was denied. You can still search for any city.' : 'Could not determine your location. Try searching for a city instead.',
      }),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  }, [selectPlace])

  const w = weather.data
  const sky = useMemo(() => {
    if (!w) return skyTheme(22, 12, 'clear-day')
    const key = conditionMeta(w.current.code, w.current.isDay).key
    return skyTheme(w.current.temp, localHourFromIso(w.current.time), key, w.current.isDay)
  }, [w])

  const value = {
    place, selectPlace, favorites, isFavorite, toggleFavorite, recents, clearRecents,
    weather, air, alerts, news, photo, refresh, stale, sky,
    geo, useMyLocation,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWeatherContext() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useWeatherContext must be used inside WeatherProvider')
  return v
}
