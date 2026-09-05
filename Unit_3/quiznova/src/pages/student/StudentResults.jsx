import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { EmptyState, StatusBadge } from '../../components/UI';
import { formatDate } from '../../utils/formatters';

export default function StudentResults() {
  const { currentUser } = useAuth();
  const { quizzes, results } = useQuiz();
  const navigate = useNavigate();

  const myResults = results.filter((r) => r.studentId === currentUser.studentId);
  const published = myResults.filter((r) => r.published);
  const pending = myResults.filter((r) => !r.published);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Results</h1>
          <p>Track your published scores and pending evaluations.</p>
        </div>
      </div>

      <div className="section-title">Published Results</div>
      {published.length === 0 ? (
        <EmptyState icon="📊" title="No published results yet" />
      ) : (
        <div className="table-wrap" style={{ marginBottom: 28 }}>
          <table className="data-table">
            <thead><tr><th>Quiz</th><th>Score</th><th>Percentage</th><th>Grade</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {published.map((r) => {
                const quiz = quizzes.find((q) => q.id === r.quizId);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{quiz?.title}</td>
                    <td>{r.scored} / {r.totalMarks}</td>
                    <td>{r.percentage}%</td>
                    <td>{r.grade}</td>
                    <td><StatusBadge status={r.passed ? 'PASSED' : 'FAILED'} /></td>
                    <td>{formatDate(quiz?.endDate)}</td>
                    <td><button className="btn btn-sm btn-outline" onClick={() => navigate(`/student/results/${r.id}`)}>View Details</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="section-title">Pending Evaluation</div>
      {pending.length === 0 ? (
        <EmptyState icon="⏳" title="Nothing pending" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Quiz</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {pending.map((r) => {
                const quiz = quizzes.find((q) => q.id === r.quizId);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{quiz?.title}</td>
                    <td>{formatDate(quiz?.endDate)}</td>
                    <td><StatusBadge status="Evaluation Pending" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
