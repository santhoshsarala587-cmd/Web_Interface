import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './UI';
import { formatDate } from '../utils/formatters';

export default function QuizCard({ quiz, assignment, result }) {
  const navigate = useNavigate();
  const status = assignment?.status || 'Not Registered';

  let actionLabel = 'View Details';
  let actionFn = () => navigate(`/student/quizzes/${quiz.id}`);

  if (status === 'Submitted' && result?.published) {
    actionLabel = 'View Result';
    actionFn = () => navigate(`/student/results/${result.id}`);
  } else if (status === 'Submitted') {
    actionLabel = 'Evaluation Pending';
    actionFn = () => {};
  } else if (status === 'Registered' || status === 'Started') {
    actionLabel = 'Start Quiz';
    actionFn = () => navigate(`/student/quiz/${quiz.id}`);
  } else {
    actionLabel = 'View Details';
  }

  const diffColor = { Easy: 'green', Medium: 'yellow', Hard: 'red' }[quiz.difficulty] || 'gray';

  return (
    <div className="glass-card hoverable quiz-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15.5 }}>{quiz.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{quiz.subject}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.5 }}>{quiz.description}</p>
      <div className="quiz-meta-row">
        <span>📄 {quiz.questionIds.length} Qs</span>
        <span>⏱ {quiz.duration} min</span>
        <span className={`badge badge-${diffColor}`}>{quiz.difficulty}</span>
      </div>
      <div className="quiz-meta-row" style={{ marginTop: 6 }}>
        <span>📅 {formatDate(quiz.startDate)} – {formatDate(quiz.endDate)}</span>
      </div>
      <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={actionFn} disabled={actionLabel === 'Evaluation Pending'}>
        {actionLabel}
      </button>
    </div>
  );
}
