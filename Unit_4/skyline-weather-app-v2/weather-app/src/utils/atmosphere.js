/**
 * Atmosphere engine.
 *
 * Turns the live temperature + the *local* hour of the selected place into a
 * colour scheme. Everything the UI paints (page background, glow, accent,
 * chart stroke) comes from here so the whole app shifts with the weather.
 */

export function toCelsius(temp, units) {
  return units === 'imperial' ? (temp - 32) * (5 / 9) : temp
}

/** Local hour (0-23.99) of a place, from its UTC offset in seconds. */
export function localHour(timezoneOffsetSeconds = 0, now = Date.now()) {
  const ms = now + timezoneOffsetSeconds * 1000
  const d = new Date(ms)
  return d.getUTCHours() + d.getUTCMinutes() / 60
}

/** Local Date object (read it with UTC getters / timeZone: 'UTC'). */
export function localDate(timezoneOffsetSeconds = 0, now = Date.now()) {
  return new Date(now + timezoneOffsetSeconds * 1000)
}

export function formatLocalTime(timezoneOffsetSeconds = 0, now = Date.now(), withSeconds = true) {
  return localDate(timezoneOffsetSeconds, now).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12: true,
    timeZone: 'UTC',
  })
}

export function formatLocalDate(timezoneOffsetSeconds = 0, now = Date.now()) {
  return localDate(timezoneOffsetSeconds, now).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Named part of the day, used for copy and for dimming the palette. */
export function dayPhase(hour) {
  if (hour < 5) return { key: 'night', label: 'Night' }
  if (hour < 7.5) return { key: 'dawn', label: 'Dawn' }
  if (hour < 11) return { key: 'morning', label: 'Morning' }
  if (hour < 16) return { key: 'day', label: 'Afternoon' }
  if (hour < 18.5) return { key: 'dusk', label: 'Golden hour' }
  if (hour < 21) return { key: 'evening', label: 'Evening' }
  return { key: 'night', label: 'Night' }
}

/** Temperature bands. Colours are HSL triples so we can dim them for night. */
const TEMP_BANDS = [
  { max: -5, key: 'frigid', label: 'Frigid', hues: [212, 198, 226], sat: [62, 55, 48] },
  { max: 4, key: 'freezing', label: 'Freezing', hues: [205, 192, 220], sat: [64, 58, 46] },
  { max: 12, key: 'cold', label: 'Cold', hues: [200, 188, 214], sat: [58, 52, 44] },
  { max: 20, key: 'mild', label: 'Mild', hues: [178, 160, 200], sat: [46, 44, 40] },
  { max: 27, key: 'warm', label: 'Warm', hues: [42, 28, 190], sat: [72, 66, 40] },
  { max: 33, key: 'hot', label: 'Hot', hues: [30, 16, 350], sat: [85, 78, 55] },
  { max: 39, key: 'scorching', label: 'Scorching', hues: [20, 8, 340], sat: [90, 84, 62] },
  { max: 999, key: 'extreme', label: 'Extreme heat', hues: [12, 358, 330], sat: [92, 88, 70] },
]

export function tempBand(tempC) {
  return TEMP_BANDS.find((b) => tempC <= b.max) || TEMP_BANDS[TEMP_BANDS.length - 1]
}

function hsl(h, s, l) {
  return `hsl(${h} ${s}% ${l}%)`
}

/**
 * Build the full theme.
 * @param {number} tempC  temperature in °C
 * @param {number} hour   local hour of the place, 0-24
 * @param {string} conditionKey  icon key from conditionMeta()
 */
export function skyTheme(tempC = 20, hour = 12, conditionKey = 'clear-day', isDayFlag = null) {
  const band = tempBand(tempC)
  const phase = dayPhase(hour)

  // Daylight curve: 0 at midnight, 1 around midday.
  const daylight = Math.max(0, Math.cos(((hour - 13) / 12) * Math.PI))
  const stormy = ['rain', 'drizzle', 'thunder', 'snow', 'mist', 'clouds'].includes(conditionKey)

  // Base lightness: dark at night, brighter at noon, always dimmed if stormy.
  const l0 = 7 + daylight * 26 - (stormy ? 3 : 0)
  const l1 = 11 + daylight * 30 - (stormy ? 4 : 0)
  const l2 = 16 + daylight * 34 - (stormy ? 5 : 0)
  const satScale = 0.45 + daylight * 0.55 - (stormy ? 0.1 : 0)

  const [h0, h1, h2] = band.hues
  const [s0, s1, s2] = band.sat

  const c0 = hsl(h0, Math.round(s0 * satScale), Math.round(l0))
  const c1 = hsl(h1, Math.round(s1 * satScale), Math.round(l1))
  const c2 = hsl(h2, Math.round(s2 * satScale), Math.round(l2))

  const accentLight = 55 + daylight * 12
  const accent = hsl(h0, Math.min(95, Math.round(s0 + 10)), Math.round(accentLight))
  const accentSoft = hsl(h1, Math.min(95, Math.round(s1 + 6)), Math.round(accentLight + 14))

  const isNight = isDayFlag === null ? daylight < 0.12 : !isDayFlag

  return {
    band: band.key,
    bandLabel: band.label,
    phase: phase.key,
    phaseLabel: phase.label,
    isNight,
    daylight,
    accent,
    accentSoft,
    glow: hsl(h0, 90, Math.round(50 + daylight * 8)),
    surface: hsl(h2, Math.round(22 * satScale + 8), Math.round(l0 + 6)),
    surfaceBorder: hsl(h2, Math.round(24 * satScale + 8), Math.round(l2 + 12)),
    gradient: `radial-gradient(120% 90% at 12% 0%, ${c2} 0%, transparent 55%),
               radial-gradient(110% 80% at 88% 12%, ${c1} 0%, transparent 58%),
               linear-gradient(170deg, ${c1} 0%, ${c0} 62%, ${c0} 100%)`,
    text: hsl(h2, 30, isNight ? 94 : 96),
    textMuted: hsl(h2, 22, isNight ? 72 : 78),
  }
}

/** CSS custom properties for a theme, applied to <html>. */
export function themeVars(theme) {
  return {
    '--sky-gradient': theme.gradient,
    '--sky-accent': theme.accent,
    '--sky-accent-soft': theme.accentSoft,
    '--sky-glow': theme.glow,
    '--sky-surface': theme.surface,
    '--sky-border': theme.surfaceBorder,
    '--sky-text': theme.text,
    '--sky-text-muted': theme.textMuted,
  }
}

/** Local hour from a provider ISO string that is already local to the place. */
export function localHourFromIso(iso) {
  const t = iso.split('T')[1] || '12:00'
  const [h, m] = t.split(':').map(Number)
  return h + m / 60
}
