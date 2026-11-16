import { getJson } from './http.js'

/** NewsAPI (optional key). Returns articles with source + date + original link. */
export function getNewsKey() {
  try { return localStorage.getItem('newsapi_api_key') || '' } catch { return '' }
}
export const hasNewsKey = () => !!getNewsKey()

const bad = (a) => !a.title || a.title === '[Removed]' || !a.url

export async function fetchWeatherNews(place, { signal } = {}) {
  const key = getNewsKey()
  if (!key) return []
  const q = encodeURIComponent(`(weather OR storm OR rain OR heatwave OR cyclone) AND "${place.name}"`)
  const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${key}`
  try {
    const { data } = await getJson(url, { ttl: 15 * 60 * 1000, signal })
    return (data.articles || []).filter((a) => !bad(a)).slice(0, 8).map((a) => ({
      title: a.title, source: a.source?.name || 'News', url: a.url, publishedAt: a.publishedAt,
    }))
  } catch (e) {
    if (e.status === 401) throw new Error('NEWS_UNAUTHORIZED')
    throw e
  }
}
