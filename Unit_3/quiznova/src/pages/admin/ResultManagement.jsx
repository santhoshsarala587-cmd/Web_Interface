import { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import { ConfirmModal } from '../../components/Modal';
import { StatusBadge, EmptyState } from '../../components/UI';

export default function ResultManagement() {
  const { quizzes, results, students, publishResults } = useQuiz();
  const toast = useToast();

  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [selectedResults, setSelectedResults] = useState([]);
  const [confirming, setConfirming] = useState(false);

  const quizResults = selectedQuiz ? results.filter((r) => r.quizId === selectedQuiz) : [];
  const avg = quizResults.length ? Math.round(quizResults.reduce((a, r) => a + r.percentage, 0) / quizResults.length) : 0;
  const highest = quizResults.length ? Math.max(...quizResults.map((r) => r.percentage)) : 0;
  const lowest = quizResults.length ? Math.min(...quizResults.map((r) => r.percentage)) : 0;

  function toggle(id) {
    setSelectedResults((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function handlePublish() {
    const studentIds = quizResults.filter((r) => selectedResults.includes(r.id)).map((r) => r.studentId);
    publishResults(selectedQuiz, studentIds);
    toast('Results Published Successfully.', 'success');
    setConfirming(false);
    setSelectedResults([]);
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Result Management</h1><p>Review and publish quiz results.</p></div>
      </div>

      <div className="glass-card" style={{ padding: 22, marginBottom: 20 }}>
        <div className="section-title">Quiz Result Overview</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Quiz</th><th>Submitted</th><th>Evaluated</th><th>Published</th><th>Avg Score</th><th>Highest</th><th>Lowest</th><th></th></tr></thead>
            <tbody>
              {quizzes.map((q) => {
                const rs = results.filter((r) => r.quizId === q.id);
                if (rs.length === 0) return null;
                const pub = rs.filter((r) => r.published).length;
                const a = rs.length ? Math.round(rs.reduce((s, r) => s + r.percentage, 0) / rs.length) : 0;
                return (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>{q.title}</td>
                    <td>{rs.length}</td>
                    <td>{rs.length}</td>
                    <td>{pub}</td>
                    <td>{a}%</td>
                    <td>{rs.length ? Math.max(...rs.map((r) => r.percentage)) : 0}%</td>
                    <td>{rs.length ? Math.min(...rs.map((r) => r.percentage)) : 0}%</td>
                    <td><button className="btn btn-sm btn-outline" onClick={() => { setSelectedQuiz(q.id); setSelectedResults([]); }}>Manage</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedQuiz && (
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">{quizzes.find((q) => q.id === selectedQuiz)?.title} — Results</div>
          <div className="bento-grid" style={{ marginBottom: 16 }}>
            <MiniStat label="Average Score" value={`${avg}%`} />
            <MiniStat label="Highest Score" value={`${highest}%`} />
            <MiniStat label="Lowest Score" value={`${lowest}%`} />
          </div>

          {quizResults.length === 0 ? <EmptyState /> : (
            <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th></th><th>Student</th><th>Score</th><th>Percentage</th><th>Grade</th><th>Status</th></tr></thead>
                  <tbody>
                    {quizResults.map((r) => {
                      const student = students.find((s) => s.studentId === r.studentId);
                      return (
                        <tr key={r.id}>
                          <td><input type="checkbox" disabled={r.published} checked={selectedResults.includes(r.id)} onChange={() => toggle(r.id)} /></td>
                          <td style={{ fontWeight: 600 }}>{student?.name}</td>
                          <td>{r.scored}/{r.totalMarks}</td>
                          <td>{r.percentage}%</td>
                          <td>{r.grade}</td>
                          <td><StatusBadge status={r.published ? 'Published' : r.passed ? 'PASSED' : 'FAILED'} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} disabled={selectedResults.length === 0} onClick={() => setConfirming(true)}>
                Publish Results ({selectedResults.length})
              </button>
            </>
          )}
        </div>
      )}

      {confirming && (
        <ConfirmModal
          title="Publish Results?"
          message="Results will become visible to the selected students immediately."
          confirmLabel="Publish"
          onConfirm={handlePublish}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="glass-card" style={{ padding: 14 }}>
      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
