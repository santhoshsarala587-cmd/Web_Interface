import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useQuiz } from '../../context/QuizContext';
import { StatCard, StatusBadge, EmptyState } from '../../components/UI';
import { formatDate } from '../../utils/formatters';

const PIE_COLORS = ['#22C55E', '#EF4444'];

export default function AdminDashboard() {
  const { quizzes, students, assignments, submissions, results } = useQuiz();
  const navigate = useNavigate();

  const pendingEval = submissions.filter((s) => s.status === 'Under Evaluation').length;
  const publishedResults = results.filter((r) => r.published).length;

  const participationData = quizzes.slice(0, 6).map((q) => ({
    name: q.title.length > 14 ? q.title.slice(0, 14) + '…' : q.title,
    participants: assignments.filter((a) => a.quizId === q.id && a.status === 'Submitted').length,
    assigned: assignments.filter((a) => a.quizId === q.id).length,
  }));

  const passFail = [
    { name: 'Passed', value: results.filter((r) => r.passed).length },
    { name: 'Failed', value: results.filter((r) => !r.passed).length },
  ];

  const recentQuizzes = [...quizzes].slice(-5).reverse();
  const pendingSubs = submissions.filter((s) => s.status === 'Under Evaluation').slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div><h1>Admin Dashboard</h1><p>Overview of platform activity and performance.</p></div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/quizzes/create')}>+ Create Quiz</button>
      </div>

      <div className="bento-grid" style={{ marginBottom: 24 }}>
        <StatCard icon="📝" label="Total Quizzes" value={quizzes.length} color="#3B82F6" />
        <StatCard icon="🎓" label="Total Students" value={students.length} color="#06B6D4" />
        <StatCard icon="📌" label="Total Assignments" value={assignments.length} color="#3B82F6" />
        <StatCard icon="📥" label="Total Submissions" value={submissions.length} color="#22C55E" />
        <StatCard icon="⏳" label="Pending Evaluations" value={pendingEval} color="#F59E0B" />
        <StatCard icon="🏆" label="Published Results" value={publishedResults} color="#22C55E" />
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Quiz Participation</div>
          <div className="section-sub">Assigned vs. Submitted per quiz</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f1b33', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="assigned" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Assigned" />
                <Bar dataKey="participants" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Submitted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Pass / Fail Distribution</div>
          <div className="section-sub">Across all evaluated results</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={passFail} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {passFail.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: '#0f1b33', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Recent Quizzes</div>
          {recentQuizzes.length === 0 ? <EmptyState /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentQuizzes.map((q) => (
                <div key={q.id} className="mini-quiz-row">
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>{q.title}</div><div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatDate(q.startDate)}</div></div>
                  <StatusBadge status={q.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Pending Evaluations</div>
          {pendingSubs.length === 0 ? <EmptyState icon="✅" title="All caught up" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingSubs.map((s) => {
                const quiz = quizzes.find((q) => q.id === s.quizId);
                const student = students.find((st) => st.studentId === s.studentId);
                return (
                  <div key={s.id} className="mini-quiz-row">
                    <div><div style={{ fontWeight: 600, fontSize: 14 }}>{student?.name}</div><div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{quiz?.title}</div></div>
                    <button className="btn btn-sm btn-outline" onClick={() => navigate(`/admin/evaluation/${s.id}`)}>Evaluate</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card" style={{ padding: 22, marginTop: 20 }}>
        <div className="section-title">Quick Actions</div>
        <div className="bento-grid" style={{ marginTop: 10 }}>
          <QuickAction icon="➕" label="Create Quiz" onClick={() => navigate('/admin/quizzes/create')} />
          <QuickAction icon="🗂️" label="Add Questions" onClick={() => navigate('/admin/questions')} />
          <QuickAction icon="📌" label="Assign Quiz" onClick={() => navigate('/admin/assignments')} />
          <QuickAction icon="🏆" label="View Results" onClick={() => navigate('/admin/results')} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button className="glass-card hoverable" style={{ padding: 18, textAlign: 'left', border: 'none', color: 'var(--text)' }} onClick={onClick}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{label}</div>
    </button>
  );
}
