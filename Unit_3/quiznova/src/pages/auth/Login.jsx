import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function fillDemo(r) {
    setRole(r);
    setEmail(r === 'admin' ? 'admin@quiznova.com' : 'student@quiznova.com');
    setPassword(r === 'admin' ? 'admin123' : '1234');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password, role);
      setLoading(false);
      if (!res.success) {
        setError(res.message);
        return;
      }
      toast(`Welcome back, ${res.user.name}!`, 'success');
      navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }, 400);
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-logo">
          <div className="logo-mark">Q</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>QuizNova</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Create. Challenge. Evaluate.</div>
          </div>
        </div>

        <h2 style={{ margin: '18px 0 4px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 0 }}>Sign in to continue to your dashboard.</p>

        <div className="role-toggle">
          <button type="button" className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>🎓 Student</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>🛡️ Admin</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email / Student ID</label>
            <input className="input" type="text" placeholder="you@quiznova.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="pass-toggle">{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontSize: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); toast('Password reset link sent (demo).', 'success'); }} style={{ color: 'var(--primary)' }}>Forgot password?</a>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="demo-box">
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Quick demo access:</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => fillDemo('student')}>Fill Student Demo</button>
            <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => fillDemo('admin')}>Fill Admin Demo</button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 18 }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
