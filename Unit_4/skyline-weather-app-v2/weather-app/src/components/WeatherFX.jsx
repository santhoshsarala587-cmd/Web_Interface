import { useMemo } from 'react'
import { conditionMeta } from '../utils/weatherCodes.js'

// Deterministic pseudo-random so the layout is stable between renders.
const rnd = (i, s) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x) }

const COUNTS = { drizzle: 45, rain: 100, thunder: 130, snow: 70 }

/** CSS-only atmosphere: rain / snow / clouds / sun rays / lightning. Colours adapt to the theme (see --fx-* in App.css). */
export default function WeatherFX({ code, isDay }) {
  const kind = code == null ? 'none' : conditionMeta(code, isDay).key
  const count = COUNTS[kind] || 0
  const parts = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: rnd(i, 1) * 125 - 15,
    delay: -rnd(i, 2) * 3,
    dur: kind === 'snow' ? 6 + rnd(i, 3) * 6 : (kind === 'drizzle' ? 1.0 : 0.55) + rnd(i, 3) * 0.45,
    size: kind === 'snow' ? 4 + rnd(i, 4) * 7 : 1.4 + rnd(i, 4) * 1.6,
    len: 34 + rnd(i, 5) * 56,
    op: 0.45 + rnd(i, 6) * 0.55,
  })), [count, kind])

  if (kind === 'none') return null
  const rain = kind === 'rain' || kind === 'drizzle' || kind === 'thunder'
  const snow = kind === 'snow'
  const clouds = ['clouds', 'cloud-day', 'cloud-night', 'mist', 'rain', 'drizzle', 'thunder', 'snow'].includes(kind)
  const heavy = kind === 'rain' || kind === 'thunder' || kind === 'clouds'

  return (
    <div className="fx" aria-hidden="true">
      {(kind === 'clear-day' || kind === 'cloud-day') && <><span className="fx-sun" /><span className="fx-rays" /></>}
      {(kind === 'clear-night' || kind === 'cloud-night') && <span className="fx-twinkle" />}
      {clouds && (
        <>
          <span className={`fx-cloud c1 ${heavy ? 'heavy' : ''}`} /><span className={`fx-cloud c2 ${heavy ? 'heavy' : ''}`} />
          <span className={`fx-cloud c3 ${heavy ? 'heavy' : ''}`} />
        </>
      )}
      {rain && <span className="fx-rainveil" />}
      {rain && parts.map((d, i) => (
        <i key={i} className="fx-drop" style={{ left: `${d.left}%`, height: d.len, width: d.size, opacity: d.op, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
      {snow && parts.map((d, i) => (
        <i key={i} className="fx-flake" style={{ left: `${d.left}%`, width: d.size, height: d.size, opacity: d.op, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
      {kind === 'thunder' && <span className="fx-flash" />}
      {kind === 'mist' && <span className="fx-fog" />}
    </div>
  )
}
