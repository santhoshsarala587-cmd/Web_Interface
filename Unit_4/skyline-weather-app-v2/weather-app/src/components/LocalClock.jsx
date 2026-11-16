import { useEffect, useState } from 'react'
import { formatLocalTime, formatLocalDate, dayPhase, localHour } from '../utils/atmosphere.js'

/** Live ticking clock showing the real local time of the selected place. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export default function LocalClock({ timezone = 0, compact = false }) {
  const now = useNow(1000)
  const phase = dayPhase(localHour(timezone, now))
  const time = formatLocalTime(timezone, now, !compact)

  if (compact) {
    return (
      <span className="clock-compact" title="Local time at this place">
        <span className="clock-dot" />
        {time}
      </span>
    )
  }

  return (
    <div className="local-clock">
      <div className="local-clock-head">
        <span className="local-clock-badge">LOCAL TIME · {phase.label.toUpperCase()}</span>
        <span className="local-clock-live">
          <span className="clock-dot" /> LIVE
        </span>
      </div>
      <div className="local-clock-body">
        <span className="local-clock-time">{time}</span>
        <span className="local-clock-date">{formatLocalDate(timezone, now)}</span>
      </div>
    </div>
  )
}
