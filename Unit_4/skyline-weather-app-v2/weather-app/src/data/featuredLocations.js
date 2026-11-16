/**
 * Fixed coordinates for the home page's featured-locations strip.
 *
 * OMR and Sholinganallur are neighborhoods, not standalone geocoding
 * entries — OpenWeatherMap's city search either returns nothing for them or
 * resolves to the wrong place. Pinning known lat/lon here means the home
 * page's 5 cards always resolve to the correct spot instead of depending on
 * a name search that isn't reliable for sub-city areas.
 */
export const FEATURED_LOCATIONS = [
  { name: 'Chennai', state: 'Tamil Nadu', country: 'IN', lat: 13.0827, lon: 80.2707 },
  { name: 'Sholinganallur', state: 'Tamil Nadu', country: 'IN', lat: 12.9010, lon: 80.2279 },
  { name: 'OMR', state: 'Tamil Nadu', country: 'IN', lat: 12.8406, lon: 80.2270 },
  { name: 'Velachery', state: 'Tamil Nadu', country: 'IN', lat: 12.9756, lon: 80.2207 },
  { name: 'Chengalpattu', state: 'Tamil Nadu', country: 'IN', lat: 12.6921, lon: 79.9770 },
]
