import { getJson } from './http.js'

/**
 * Photo of the *actual* place, in this order:
 *  1. Wikipedia article for the place — accepted only if the article's own coordinates are
 *     within ~60 km of the place we're showing (so "Paris, Texas" never gets the Eiffel Tower).
 *  2. A Wikipedia article for a landmark within ~8 km of the coordinates (caption names it).
 *  3. Unsplash (only if the user added a key) — accepted only when the photo's own location/city
 *     field or description names this exact city. No state/country fallbacks.
 * If nothing is verifiably of the place, we return null and the UI shows no photo (never a wrong one).
 */
const WIKI = 'https://en.wikipedia.org/w/api.php'
const TTL = 24 * 60 * 60 * 1000
const cache = new Map()

const km = (a, b) => {
  const R = 6371, rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
// Lead images that are maps, flags, seals, logos etc. are not photos of a place.
const BAD_IMAGE = /(map|locator|location|seal|flag|logo|emblem|coat_of_arms|coa_|symbol|diagram|blank|\.svg|\.gif|\.tif)/i
const BAD_TITLE = /(disambiguation|\blist of\b|railway station$|metro station$|bus (stop|stand|terminus)$)/i

function toPhoto(page, source) {
  const t = page.thumbnail
  return {
    url: t.source,
    alt: `${page.title}`,
    title: page.title,
    credit: 'Wikipedia',
    creditUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    source,
  }
}

const pageCoord = (p) => (p.coordinates?.[0] ? { lat: p.coordinates[0].lat, lon: p.coordinates[0].lon } : null)
const usable = (p) => p.thumbnail?.source && !BAD_IMAGE.test(decodeURIComponent(p.thumbnail.source)) && !BAD_TITLE.test(p.title)

async function wikiByName(place, signal) {
  const queries = [...new Set([
    [place.name, place.region, place.country].filter(Boolean).join(' '),
    [place.name, place.country].filter(Boolean).join(' '),
    place.name,
  ])]
  for (const q of queries) {
    const url = `${WIKI}?action=query&format=json&origin=*&generator=search&gsrlimit=6&gsrsearch=${encodeURIComponent(q)}` +
      '&prop=pageimages|coordinates&piprop=thumbnail&pithumbsize=1400&pilicense=any&colimit=6'
    const { data } = await getJson(url, { ttl: TTL, signal })
    const pages = Object.values(data.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0))
    const name = place.name.toLowerCase()
    const hit = pages.find((p) => {
      const c = pageCoord(p)
      if (!c || !usable(p)) return false
      const titleOk = p.title.toLowerCase().split(/[ ,(]/)[0] === name.split(/[ ,(]/)[0] || p.title.toLowerCase().includes(name)
      return titleOk && km(c, place) <= 60
    })
    if (hit) return toPhoto(hit, 'place')
  }
  return null
}

async function wikiNearby(place, signal) {
  const url = `${WIKI}?action=query&format=json&origin=*&generator=geosearch&ggscoord=${place.lat}|${place.lon}` +
    '&ggsradius=8000&ggslimit=30&prop=pageimages|coordinates&piprop=thumbnail&pithumbsize=1400&pilicense=any&colimit=30'
  const { data } = await getJson(url, { ttl: TTL, signal })
  const pages = Object.values(data.query?.pages || {})
    .filter((p) => usable(p) && pageCoord(p))
    .map((p) => ({ p, d: km(pageCoord(p), place) }))
    .sort((a, b) => a.d - b.d)
  return pages.length ? toPhoto(pages[0].p, 'nearby') : null
}

async function unsplashExact(place, signal) {
  const key = localStorage.getItem('unsplash_api_key')
  if (!key) return null
  const q = encodeURIComponent(`${place.name} ${place.country || ''}`.trim())
  const { data } = await getJson(`https://api.unsplash.com/search/photos?query=${q}&per_page=15&orientation=landscape&client_id=${encodeURIComponent(key)}`, { ttl: TTL, signal })
  const needle = place.name.toLowerCase()
  const hit = (data.results || []).find((r) => {
    const loc = `${r.location?.city || ''} ${r.location?.name || ''}`.toLowerCase()
    const desc = `${r.description || ''} ${r.alt_description || ''}`.toLowerCase()
    return loc.includes(needle) || (desc.includes(needle) && (!r.location?.country || !place.country || r.location.country.toLowerCase() === place.country.toLowerCase()))
  })
  return hit ? { url: hit.urls.regular, alt: hit.alt_description || `Photo of ${place.name}`, title: place.name, credit: `${hit.user.name} on Unsplash`, creditUrl: hit.links.html, source: 'place' } : null
}

export async function getPlacePhoto(place, { signal } = {}) {
  if (!place || place.isCurrent || /^(my location|point )/i.test(place.name)) return null
  const k = `${place.name}|${place.lat.toFixed(2)}|${place.lon.toFixed(2)}`
  if (cache.has(k)) return cache.get(k)
  let photo = null
  try { photo = await wikiByName(place, signal) } catch (e) { if (e.name === 'AbortError') throw e }
  if (!photo) { try { photo = await unsplashExact(place, signal) } catch (e) { if (e.name === 'AbortError') throw e } }
  if (!photo) { try { photo = await wikiNearby(place, signal) } catch (e) { if (e.name === 'AbortError') throw e } }
  cache.set(k, photo)
  return photo
}
