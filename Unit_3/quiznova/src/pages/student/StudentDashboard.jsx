import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { StatCard, StatusBadge, EmptyState } from '../../components/UI';
import { formatDate } from '../../utils/formatters';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { quizzes, assignments, results, students } = useQuiz();
  const navigate = useNavigate();
  const studentId = currentUser.studentId;

  const myAssignments = assignments.filter((a) => a.studentId === studentId);
  const myResults = results.filter((r) => r.studentId === studentId && r.published);
  const student = students.find((s) => s.studentId === studentId);

  const completed = myAssignments.filter((a) => a.status === 'Submitted').length;
  const pending = myAssignments.filter((a) => !['Submitted'].includes(a.status)).length;
  const avgScore = myResults.length ? Math.round(myResults.reduce((a, r) => a + r.percentage, 0) / myResults.length) : 0;

  const upcoming = myAssignments
    .map((a) => ({ a, quiz: quizzes.find((q) => q.id === a.quizId) }))
    .filter((x) => x.quiz && x.a.status !== 'Submitted')
    .slice(0, 4);

  const recentResults = myResults.slice(-3).reverse();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back, {currentUser.name.split(' ')[0]} 👋</h1>
          <p>Student ID: {studentId} • Level: {student?.year || 'I'} Year • {student?.department || 'CSE'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/student/quizzes')}>View Assigned Quizzes</button>
          <button className="btn btn-primary" onClick={() => navigate('/student/results')}>View Results</button>
        </div>
      </div>

      <div className="bento-grid" style={{ marginBottom: 24 }}>
        <StatCard icon="📝" label="Assigned Quizzes" value={myAssignments.length} color="#3B82F6" />
        <StatCard icon="✅" label="Completed" value={completed} color="#22C55E" />
        <StatCard icon="⏳" label="Pending" value={pending} color="#F59E0B" />
        <StatCard icon="📊" label="Average Score" value={`${avgScore}%`} color="#06B6D4" />
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Upcoming Quizzes</div>
          <div className="section-sub">Quizzes assigned to you that need attention</div>
          {upcoming.length === 0 ? (
            <EmptyState icon="🎉" title="You're all caught up!" subtitle="No pending quizzes right now." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.map(({ a, quiz }) => (
                <div key={a.id} className="mini-quiz-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{quiz.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{quiz.questionIds.length} Qs • {quiz.duration} min • Ends {formatDate(quiz.endDate)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StatusBadge status={a.status} />
                    <button className="btn btn-sm btn-outline" onClick={() => navigate(`/student/quizzes/${quiz.id}`)}>View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Recent Results</div>
          <div className="section-sub">Your latest published scores</div>
          {recentResults.length === 0 ? (
            <EmptyState icon="📊" title="No published results yet" subtitle="Results appear here once the admin publishes them." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentResults.map((r) => {
                const quiz = quizzes.find((q) => q.id === r.quizId);
                return (
                  <div key={r.id} className="mini-quiz-row">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{quiz?.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.scored}/{r.totalMarks} marks • Grade {r.grade}</div>
                    </div>
                    <StatusBadge status={r.passed ? 'PASSED' : 'FAILED'} />
                  </div>
                );
              })}
            </div>
          )}

          <div className="divider" />
          <div className="section-title" style={{ fontSize: 15 }}>Learning Progress</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
            <span>Completed {completed} of {myAssignments.length} quizzes</span>
            <span>{myAssignments.length ? Math.round((completed / myAssignments.length) * 100) : 0}%</span>
          </div>
          <div className="progress-track" style={{ marginTop: 6 }}>
            <div className="progress-fill" style={{ width: `${myAssignments.length ? (completed / myAssignments.length) * 100 : 0}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
