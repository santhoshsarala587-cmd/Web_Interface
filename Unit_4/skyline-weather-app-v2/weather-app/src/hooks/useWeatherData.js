import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchForecast, fetchAirQuality } from '../api/openMeteo.js'
import { fetchAlerts, alertsSupported } from '../api/alerts.js'
import { fetchWeatherNews, hasNewsKey } from '../api/news.js'
import { getPlacePhoto } from '../api/placePhoto.js'
import { isAbort } from '../api/http.js'

const idle = { data: null, status: 'idle', error: null, updatedAt: null }

/**
 * Loads forecast (required) + air quality + alerts (optional) for a place.
 * - Obsolete requests are aborted when the place changes.
 * - If a refresh fails, the previous data stays on screen and `stale` becomes true.
 * - Optional feeds fail independently and never block the dashboard.
 */
export function useWeatherData(place) {
  const [weather, setWeather] = useState(idle)
  const [air, setAir] = useState(idle)
  const [alerts, setAlerts] = useState(idle)
  const [tick, setTick] = useState(0)
  const forceRef = useRef(false)
  const placeKey = place ? `${place.lat},${place.lon}` : null

  const refresh = useCallback(() => { forceRef.current = true; setTick((t) => t + 1) }, [])

  useEffect(() => {
    if (!place) return
    const ctrl = new AbortController()
    const force = forceRef.current
    forceRef.current = false
    const { signal } = ctrl

    setWeather((s) => ({ ...s, status: 'loading', error: null, data: s.placeKey === placeKey ? s.data : null, placeKey }))
    setAir((s) => ({ ...s, status: 'loading', data: s.placeKey === placeKey ? s.data : null, placeKey }))

    fetchForecast(place.lat, place.lon, { signal, force })
      .then((data) => setWeather({ data, status: 'ready', error: null, updatedAt: data.fetchedAt, placeKey }))
      .catch((e) => { if (!isAbort(e)) setWeather((s) => ({ ...s, status: 'error', error: e.message })) })

    fetchAirQuality(place.lat, place.lon, { signal, force })
      .then((data) => setAir({ data, status: 'ready', error: null, updatedAt: data.fetchedAt, placeKey }))
      .catch((e) => { if (!isAbort(e)) setAir((s) => ({ ...s, status: 'error', error: e.message })) })

    if (alertsSupported(place)) {
      setAlerts((s) => ({ ...s, status: 'loading', placeKey }))
      fetchAlerts(place.lat, place.lon, { signal })
        .then((data) => setAlerts({ data, status: 'ready', error: null, updatedAt: data.fetchedAt, placeKey }))
        .catch((e) => { if (!isAbort(e)) setAlerts({ data: null, status: 'error', error: e.message, updatedAt: null, placeKey }) })
    } else {
      setAlerts({ data: null, status: 'unsupported', error: null, updatedAt: null, placeKey })
    }
    return () => ctrl.abort()
  }, [placeKey, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  // `stale` = a refresh failed but we still show the previous successful result.
  const stale = weather.status === 'error' && !!weather.data
  return { weather, air, alerts, refresh, stale }
}

export function useLocalNews(place) {
  const [state, setState] = useState({ articles: [], status: 'idle' })
  useEffect(() => {
    if (!place) return
    if (!hasNewsKey()) { setState({ articles: [], status: 'no-key' }); return }
    const ctrl = new AbortController()
    setState({ articles: [], status: 'loading' })
    fetchWeatherNews(place, { signal: ctrl.signal })
      .then((articles) => setState({ articles, status: articles.length ? 'ready' : 'empty' }))
      .catch((e) => { if (!isAbort(e)) setState({ articles: [], status: e.message === 'NEWS_UNAUTHORIZED' ? 'unauthorized' : 'error' }) })
    return () => ctrl.abort()
  }, [place?.lat, place?.lon]) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}

export function useCityPhoto(place) {
  const [state, setState] = useState({ photo: null, status: 'idle' })
  useEffect(() => {
    if (!place) return
    const ctrl = new AbortController()
    setState({ photo: null, status: 'loading' })
    getPlacePhoto(place, { signal: ctrl.signal })
      .then((photo) => setState({ photo, status: photo ? 'ready' : 'none' }))
      .catch((e) => { if (!isAbort(e) && e.name !== 'AbortError') setState({ photo: null, status: 'none' }) })
    return () => ctrl.abort()
  }, [place?.lat, place?.lon, place?.name]) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}

/** Current conditions for many places (compare / travel). Cached by the HTTP layer. */
export function useMultiWeather(places) {
  const [map, setMap] = useState({})
  const sig = places.map((p) => `${p.lat},${p.lon}`).join('|')
  useEffect(() => {
    if (!places.length) return
    const ctrl = new AbortController()
    places.forEach((p) => {
      const k = `${p.lat},${p.lon}`
      setMap((m) => (m[k]?.data ? m : { ...m, [k]: { status: 'loading' } }))
      Promise.all([
        fetchForecast(p.lat, p.lon, { signal: ctrl.signal }),
        fetchAirQuality(p.lat, p.lon, { signal: ctrl.signal }).catch(() => ({ available: false })),
      ])
        .then(([w, a]) => setMap((m) => ({ ...m, [k]: { status: 'ready', data: w, air: a } })))
        .catch((e) => { if (!isAbort(e)) setMap((m) => ({ ...m, [k]: { status: 'error', error: e.message } })) })
    })
    return () => ctrl.abort()
  }, [sig]) // eslint-disable-line react-hooks/exhaustive-deps
  return map
}
