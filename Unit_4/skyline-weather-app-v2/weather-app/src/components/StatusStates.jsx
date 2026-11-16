export function Skeleton({ className = '', style }) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />
}

export function DashboardSkeleton() {
  return (
    <div className="grid-dash" role="status" aria-live="polite">
      <Skeleton className="sk-hero card-span" />
      <Skeleton className="sk-card" /><Skeleton className="sk-card" />
      <Skeleton className="sk-wide card-span" />
      <span className="sr-only">Loading weather data…</span>
    </div>
  )
}

export function ErrorState({ message, onRetry, title = 'Weather unavailable' }) {
  return (
    <div className="status-panel" role="alert">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="var(--danger)" strokeWidth="1.6" />
        <line x1="12" y1="7" x2="12" y2="13" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1.1" fill="var(--danger)" />
      </svg>
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && <button type="button" className="btn btn-primary" onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function Empty({ children }) {
  return <p className="empty-note">{children}</p>
}
