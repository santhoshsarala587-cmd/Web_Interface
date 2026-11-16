# Skyline Weather v2

A premium React + Vite weather dashboard: live conditions, 48-hour and 7-day forecasts, analytics charts,
air quality, official alerts (US), an interactive map, city comparison, a travel planner and rule-based
weather insights. Frontend-only; no backend required.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm test           # unit tests for utils (units, time, AQI, insights)
```

No API key is needed for weather, geocoding or air quality.

## Data providers (and why the provider changed)

| Feature | Provider | Key |
|---|---|---|
| Current, hourly, 7-day forecast, UV, visibility, gusts | Open-Meteo Forecast | none |
| City autocomplete (name + region + country) | Open-Meteo Geocoding | none |
| Air quality (US AQI, EU EAQI, pollutants) | Open-Meteo Air Quality (CAMS) | none |
| Official alerts | US National Weather Service (US locations only) | none |
| Map weather layers | OpenWeatherMap tiles | optional |
| News headlines | NewsAPI | optional |
| City photo | Wikipedia (coordinate-verified), Unsplash as optional extra | none |

**Why not stay on OpenWeatherMap?** The free tier returns a 5-day / 3-hour forecast: no true 7-day daily forecast,
no hourly UV, no alerts. Those need One Call 3.0 (card required). Open-Meteo provides them free with CORS. OWM is kept
only for the optional map tile layers. Old OWM-key behaviour (Settings -> API key) still works for those layers.

## Features

- **Dashboard**: big temperature, feels-like, H/L, humidity, wind + direction + gusts, pressure, visibility, UV, rain chance,
  sunrise/sunset, plain-language summary built from the data, condition- and local-time-driven background with light CSS effects.
- **Hourly**: 24h strip on Today, 48h on Hourly, interactive temperature chart with tooltips, per-hour detail on tap.
- **7-day**: icons, min/max range bars, rain chance, wind, expandable details (rain total, UV, daylight...).
- **Analytics**: temperature, min/max, precipitation probability, wind/gusts, humidity; 24/48/72h span. One shared data slice,
  keyboard (arrow keys) + pointer interaction, hidden data table for screen readers.
- **Search**: debounced, abortable autocomplete, recents, favorites (star), geolocation with permission and error handling.
- **Compare / Travel**: up to 5 cities side by side (labelled "now" vs "forecast"), destination forecast picker (no values invented past the forecast horizon).
- **Air quality**: US AQI + category + health guidance, EU EAQI (noted as a different scale), pollutants, timestamp, unavailable state.
- **Alerts & news**: genuine NWS alerts (severity, area, source, expiry); NewsAPI headlines with source/date/link, clearly separated.
- **Insights**: umbrella, outdoor comfort, UV, air quality, next 6 hours. Thresholds in `src/utils/insights.js` (`DEFAULT_THRESHOLDS`);
  each card has a "Why?" showing the data behind it; missing data yields "not available", never a guess.
- **Map**: English-labelled Esri World Street Map tiles, click any point for a weather card (English place name via Nominatim, current + next 3 days, "View full forecast"), Leaflet, search, "show my location", click-to-probe real forecast at any point, layers (temperature/wind/precipitation/clouds)
  via OWM tiles when a key is set - otherwise a clear message, no fake overlay. Map destroyed on unmount.
- **Settings**: C/F, km/h / mph / m/s / knots, dark/light, motion (system/reduced/full), widget toggles, favorites, optional keys, reset.
- **Reliability**: in-memory cache (10 min forecast, 30 min air), in-flight de-duplication, AbortController, 429 handling,
  stale data stays visible with a "Stale" badge if a refresh fails, Refresh button forces a fresh request.

## Project layout

```
src/api/        http.js (cache/dedupe/abort), openMeteo.js, alerts.js, news.js, unsplash.js
src/context/    SettingsContext (persisted prefs), WeatherContext (place, favorites, data)
src/hooks/      useWeatherData, useCitySearch, useDebounce, useLocalStorage
src/utils/      units, weatherCodes, aqi, insights, atmosphere
src/components/ cards, charts/Chart.jsx (dependency-free SVG), map, search, settings
src/pages/      Today, Hourly, Daily, Analytics, Map, Compare, News
tests/          node:test unit tests
```

## Limitations

- Charts are hand-built SVG rather than Recharts (kept the app dependency-light; Recharts can be swapped in behind `charts/Chart.jsx`).
- Alerts exist only for the US. Other countries need a national feed; add a module like `src/api/alerts.js`.
- Air quality is modelled (CAMS), not a ground-station reading.
- Map weather layers need a free OWM key. Keys typed in Settings are stored in the browser and visible to the user:
  never use a secret key client-side. For a private key, put a small serverless proxy (e.g. a Cloudflare Worker that adds the key
  server-side) in front of the provider and point the API base URL at it.
- NewsAPI free plan generally only works from localhost.

## Next ideas

Radar animation (RainViewer), PWA/offline shell, per-day hourly drill-down, more alert sources (MeteoAlarm, IMD), route weather for travel.
