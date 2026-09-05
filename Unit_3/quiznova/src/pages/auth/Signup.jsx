import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

export default function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', studentId: '', password: '', confirm: '', role: 'student', terms: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 4) return setError('Password must be at least 4 characters.');
    if (!form.terms) return setError('Please accept the Terms & Conditions.');

    setLoading(true);
    setTimeout(() => {
      const res = signup(form);
      setLoading(false);
      if (!res.success) return setError(res.message);
      toast('Account created successfully!', 'success');
      navigate(form.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
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
        <h2 style={{ margin: '18px 0 4px' }}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 0 }}>Join QuizNova to start learning or managing assessments.</p>

        <div className="role-toggle">
          <button type="button" className={form.role === 'student' ? 'active' : ''} onClick={() => update('role', 'student')}>🎓 Student</button>
          <button type="button" className={form.role === 'admin' ? 'active' : ''} onClick={() => update('role', 'admin')}>🛡️ Admin</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@quiznova.com" required />
          </div>
          {form.role === 'student' && (
            <div className="field">
              <label>Student ID (optional)</label>
              <input className="input" value={form.studentId} onChange={(e) => update('studentId', e.target.value)} placeholder="STU1010" />
            </div>
          )}
          <div className="grid-2">
            <div className="field">
              <label>Password</label>
              <input className="input" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <input className="input" type="password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} required />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            <input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} />
            I agree to the Terms & Conditions
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 18 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
