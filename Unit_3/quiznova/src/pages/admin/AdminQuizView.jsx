import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { StatusBadge } from '../../components/UI';
import { formatDate } from '../../utils/formatters';

export default function AdminQuizView() {
  const { id } = useParams();
  const { quizzes, questions, assignments, submissions } = useQuiz();
  const navigate = useNavigate();

  const quiz = quizzes.find((q) => q.id === id);
  if (!quiz) return <div className="glass-card" style={{ padding: 24 }}>Quiz not found.</div>;

  const qList = questions.filter((q) => quiz.questionIds.includes(q.id));
  const assigned = assignments.filter((a) => a.quizId === id).length;
  const submitted = submissions.filter((s) => s.quizId === id).length;

  return (
    <div>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>← Back</button>

      <div className="glass-card" style={{ padding: 26, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: '0 0 6px' }}>{quiz.title}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{quiz.subject} • {quiz.category}</p>
          </div>
          <StatusBadge status={quiz.status} />
        </div>
        <p style={{ marginTop: 16, color: '#cbd5e1' }}>{quiz.description}</p>

        <div className="bento-grid" style={{ marginTop: 18 }}>
          <MiniStat label="Questions" value={qList.length} />
          <MiniStat label="Total Marks" value={quiz.totalMarks} />
          <MiniStat label="Duration" value={`${quiz.duration} min`} />
          <MiniStat label="Assigned" value={assigned} />
          <MiniStat label="Submitted" value={submitted} />
          <MiniStat label="Pass %" value={`${quiz.passPercentage}%`} />
        </div>
        <div style={{ marginTop: 14, fontSize: 13, color: 'var(--text-secondary)' }}>
          Available: {formatDate(quiz.startDate)} – {formatDate(quiz.endDate)}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/assignments')}>Manage Assignments</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/results')}>View Results</button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-title">Questions ({qList.length})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {qList.map((q, idx) => (
            <div key={q.id} className="mini-quiz-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Q{idx + 1}. {q.text}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 6 }}>{q.marks} marks • {q.difficulty} • Answer: {q.correctAnswer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="glass-card" style={{ padding: 14 }}>
      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
