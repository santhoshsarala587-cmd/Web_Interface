import test from 'node:test'
import assert from 'node:assert/strict'

globalThis.localStorage = { getItem: () => null }
const page = (title, lat, lon, thumb, index = 1) => ({ title, index, coordinates: [{ lat, lon }], thumbnail: thumb ? { source: thumb } : undefined })
let responder
globalThis.fetch = async (url) => ({ ok: true, status: 200, json: async () => responder(String(url)) })
const { getPlacePhoto } = await import('../src/api/placePhoto.js')
const wrap = (...pages) => ({ query: { pages: Object.fromEntries(pages.map((p, i) => [i, p])) } })

test('accepts the place article when its coordinates match', async () => {
  responder = () => wrap(page('Velachery', 12.98, 80.22, 'https://upload.wikimedia.org/a/Velachery_Lake.jpg'))
  const p = await getPlacePhoto({ name: 'Velachery', region: 'Tamil Nadu', country: 'India', lat: 12.9815, lon: 80.2209 })
  assert.equal(p.title, 'Velachery'); assert.equal(p.source, 'place')
})

test('rejects same-named article on another continent (Paris, Texas)', async () => {
  responder = (u) => u.includes('geosearch')
    ? wrap(page('Lamar County Courthouse', 33.66, -95.55, 'https://upload.wikimedia.org/a/Courthouse.jpg'))
    : wrap(page('Paris', 48.85, 2.35, 'https://upload.wikimedia.org/a/Eiffel_Tower.jpg'))
  const p = await getPlacePhoto({ name: 'Paris', region: 'Texas', country: 'United States', lat: 33.66, lon: -95.55 })
  assert.equal(p.title, 'Lamar County Courthouse'); assert.equal(p.source, 'nearby')
})

test('skips maps/flags/seals and returns null rather than a wrong photo', async () => {
  responder = () => wrap(page('Nowhereville', 10, 10, 'https://upload.wikimedia.org/a/Nowhereville_locator_map.png'))
  const p = await getPlacePhoto({ name: 'Nowhereville', region: '', country: 'X', lat: 10, lon: 10 })
  assert.equal(p, null)
})
