import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import { Avatar, StatCard } from '../../components/UI';
import { getData, setData } from '../../utils/storage';

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const { students } = useQuiz();
  const toast = useToast();

  const student = students.find((s) => s.studentId === currentUser.studentId) || {};
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: currentUser.name, department: student.department || 'CSE', year: student.year || 'I' });

  function save() {
    const list = getData('students', []);
    const updated = list.map((s) => (s.studentId === currentUser.studentId ? { ...s, ...form } : s));
    setData('students', updated);

    const users = getData('users', []);
    setData('users', users.map((u) => (u.id === currentUser.id ? { ...u, name: form.name } : u)));
    const cur = getData('currentUser', null);
    if (cur) setData('currentUser', { ...cur, name: form.name });

    setEditing(false);
    toast('Profile updated successfully.', 'success');
    setTimeout(() => window.location.reload(), 600);
  }

  const achievements = [
    { icon: '🏆', label: 'Top Performer', earned: student.averageScore >= 80 },
    { icon: '🔥', label: '5-Quiz Streak', earned: student.completedQuizzes >= 5 },
    { icon: '⭐', label: 'First Quiz Completed', earned: student.completedQuizzes >= 1 },
    { icon: '🎯', label: 'Perfectionist', earned: student.averageScore >= 95 },
  ];

  return (
    <div>
      <div className="page-header">
        <div><h1>My Profile</h1><p>Manage your personal information and view achievements.</p></div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar name={currentUser.name} size={64} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{currentUser.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{currentUser.email}</div>
            </div>
          </div>

          <div className="divider" />

          {editing ? (
            <>
              <div className="field"><label>Full Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid-2">
                <div className="field"><label>Department</label>
                  <select className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    <option>CSE</option><option>IT</option><option>ECE</option>
                  </select>
                </div>
                <div className="field"><label>Year</label>
                  <select className="input" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                    <option>I</option><option>II</option><option>III</option><option>IV</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={save}>Save Changes</button>
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <InfoRow label="Student ID" value={currentUser.studentId} />
              <InfoRow label="Department" value={student.department} />
              <InfoRow label="Year" value={`${student.year} Year`} />
              <InfoRow label="Status" value={student.status || 'Active'} />
              <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </div>

        <div>
          <div className="bento-grid" style={{ marginBottom: 18 }}>
            <StatCard icon="✅" label="Completed Quizzes" value={student.completedQuizzes || 0} color="#22C55E" />
            <StatCard icon="📊" label="Average Score" value={`${student.averageScore || 0}%`} color="#06B6D4" />
          </div>

          <div className="glass-card" style={{ padding: 22 }}>
            <div className="section-title">Achievements</div>
            <div className="bento-grid" style={{ marginTop: 12 }}>
              {achievements.map((a) => (
                <div key={a.label} className="glass-card" style={{ padding: 16, textAlign: 'center', opacity: a.earned ? 1 : 0.35 }}>
                  <div style={{ fontSize: 26 }}>{a.icon}</div>
                  <div style={{ fontSize: 12.5, marginTop: 6, fontWeight: 600 }}>{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
