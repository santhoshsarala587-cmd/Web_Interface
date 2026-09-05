export function Badge({ children, color = 'gray' }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

export function statusColor(status) {
  const map = {
    'Not Registered': 'gray', 'Not Started': 'gray', Draft: 'gray',
    Assigned: 'blue', Registered: 'blue', Scheduled: 'blue',
    'In Progress': 'yellow', Started: 'yellow', 'Evaluation Pending': 'yellow', 'Under Evaluation': 'yellow',
    Submitted: 'cyan', Evaluated: 'cyan', Active: 'green',
    'Results Published': 'green', Published: 'green', Passed: 'green', PASSED: 'green', Completed: 'green',
    Failed: 'red', FAILED: 'red',
  };
  return map[status] || 'gray';
}

export function StatusBadge({ status }) {
  return <Badge color={statusColor(status)}>{status}</Badge>;
}

export function StatCard({ icon, label, value, color = 'var(--primary)' }) {
  return (
    <div className="glass-card stat-card hoverable">
      <div className="stat-top">
        <div className="stat-icon" style={{ background: `${color}22`, color }}>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function ProgressBar({ percent }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
    </div>
  );
}

export function EmptyState({ icon = '📭', title = 'Nothing here yet', subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

export function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 50 }}>
      <div className="spinner" />
      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</div>
    </div>
  );
}

export function Skeleton({ h = 16, w = '100%', style }) {
  return <div className="skeleton" style={{ height: h, width: w, ...style }} />;
}

export function Avatar({ name, size = 38 }) {
  const initials = (name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.34 }}>{initials}</div>;
}
