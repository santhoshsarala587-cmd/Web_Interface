import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import { ConfirmModal } from '../../components/Modal';
import { StatusBadge } from '../../components/UI';
import { formatDate } from '../../utils/formatters';

export default function QuizDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { quizzes, assignments, registerForQuiz, results } = useQuiz();
  const toast = useToast();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const quiz = quizzes.find((q) => q.id === id);
  const studentId = currentUser.studentId;
  const assignment = assignments.find((a) => a.quizId === id && a.studentId === studentId);
  const result = results.find((r) => r.quizId === id && r.studentId === studentId);

  if (!quiz) return <div className="glass-card" style={{ padding: 24 }}>Quiz not found.</div>;

  const status = assignment?.status || 'Not Registered';
  const isRegistered = assignment?.registered;

  function handleRegister() {
    registerForQuiz(id, studentId);
    setShowConfirm(false);
    toast('Successfully registered for quiz!', 'success');
  }

  return (
    <div>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>← Back</button>

      <div className="glass-card" style={{ padding: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: '0 0 6px' }}>{quiz.title}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{quiz.subject} • by {quiz.createdBy}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <p style={{ marginTop: 18, lineHeight: 1.6, color: '#cbd5e1' }}>{quiz.description}</p>

        <div className="bento-grid" style={{ marginTop: 20 }}>
          <DetailItem label="Questions" value={quiz.questionIds.length} />
          <DetailItem label="Total Marks" value={quiz.totalMarks} />
          <DetailItem label="Duration" value={`${quiz.duration} min`} />
          <DetailItem label="Difficulty" value={quiz.difficulty} />
          <DetailItem label="Attempts Allowed" value={quiz.attemptsAllowed} />
          <DetailItem label="Pass Percentage" value={`${quiz.passPercentage}%`} />
          <DetailItem label="Available From" value={formatDate(quiz.startDate)} />
          <DetailItem label="Available Until" value={formatDate(quiz.endDate)} />
        </div>

        <div className="info-banner">
          ⚠️ Once you start the quiz, the timer will begin and cannot be paused. Ensure a stable connection before starting.
        </div>

        <div style={{ marginTop: 22, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {!isRegistered && (
            <button className="btn btn-primary" onClick={() => setShowConfirm(true)}>Register for Quiz</button>
          )}
          {isRegistered && status !== 'Submitted' && (
            <>
              <span className="badge badge-green" style={{ padding: '10px 16px', fontSize: 13 }}>Registered ✓</span>
              <button className="btn btn-primary" onClick={() => navigate(`/student/quiz/${quiz.id}`)}>Start Quiz</button>
            </>
          )}
          {status === 'Submitted' && result?.published && (
            <button className="btn btn-primary" onClick={() => navigate(`/student/results/${result.id}`)}>View Result</button>
          )}
          {status === 'Submitted' && !result?.published && (
            <span className="badge badge-yellow" style={{ padding: '10px 16px', fontSize: 13 }}>Evaluation Pending</span>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Confirm Registration"
          message="Are you sure you want to register for this quiz?"
          confirmLabel="Register"
          details={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span><b>{quiz.title}</b></span>
              <span>{quiz.questionIds.length} Questions • {quiz.duration} min</span>
              <span>Attempts: {quiz.attemptsAllowed} • Pass mark: {quiz.passPercentage}%</span>
              <span>Available: {formatDate(quiz.startDate)} – {formatDate(quiz.endDate)}</span>
            </div>
          }
          onConfirm={handleRegister}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="glass-card" style={{ padding: 14 }}>
      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
