import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES } from '../context/ThemeContext';

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/student/quizzes', label: 'Assigned Quizzes', icon: '📝' },
  { to: '/student/results', label: 'Results', icon: '📊' },
  { to: '/student/profile', label: 'Profile', icon: '👤' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/quizzes', label: 'Quizzes', icon: '📝' },
  { to: '/admin/quizzes/create', label: 'Create Quiz', icon: '➕' },
  { to: '/admin/questions', label: 'Question Bank', icon: '🗂️' },
  { to: '/admin/students', label: 'Students', icon: '🎓' },
  { to: '/admin/assignments', label: 'Assignments', icon: '📌' },
  { to: '/admin/submissions', label: 'Submissions', icon: '📥' },
  { to: '/admin/results', label: 'Results', icon: '🏆' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const links = currentUser?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">Q</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1 }}>QuizNova</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>Create. Challenge. Evaluate.</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to.endsWith('dashboard')}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="sidebar-icon">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{(currentUser?.name || '?').split(' ').map(n => n[0]).slice(0,2).join('')}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{currentUser?.role}</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-block btn-sm" onClick={logout} style={{ marginTop: 10 }}>
            🚪 Logout
          </button>
        </div>
      </aside>
      {open && <div className="sidebar-scrim" onClick={() => setOpen(false)} />}
    </>
  );
}
