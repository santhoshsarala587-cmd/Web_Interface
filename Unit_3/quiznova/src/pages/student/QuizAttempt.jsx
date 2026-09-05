import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import { ConfirmModal } from '../../components/Modal';
import { ProgressBar } from '../../components/UI';
import Timer from '../../components/Timer';
import { getData, setData } from '../../utils/storage';

export default function QuizAttempt() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { quizzes, questions, submitQuiz, markAssignmentStatus } = useQuiz();
  const toast = useToast();
  const navigate = useNavigate();

  const quiz = quizzes.find((q) => q.id === id);
  const quizQuestions = quiz ? questions.filter((q) => quiz.questionIds.includes(q.id)) : [];
  const storageKey = `attempt_${id}_${currentUser.studentId}`;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [visited, setVisited] = useState([]);
  const [seconds, setSeconds] = useState(quiz ? quiz.duration * 60 : 0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startedRef = useRef(false);

  // restore saved progress
  useEffect(() => {
    if (!quiz) return;
    const saved = getData(storageKey, null);
    if (saved) {
      setAnswers(saved.answers || {});
      setMarked(saved.marked || []);
      setCurrent(saved.current || 0);
      setSeconds(saved.seconds ?? quiz.duration * 60);
    }
    if (!startedRef.current) {
      startedRef.current = true;
      markAssignmentStatus(id, currentUser.studentId, 'Started');
    }
    // eslint-disable-next-line
  }, [quiz]);

  const handleSubmit = useCallback(() => {
    if (submitted || !quiz) return;
    setSubmitted(true);
    const timeTaken = quiz.duration * 60 - seconds;
    submitQuiz({ quizId: id, studentId: currentUser.studentId, answers, timeTaken, markedForReview: marked });
    localStorage.removeItem(`quiznova_${storageKey}`);
    toast('Quiz Submitted Successfully ✓', 'success');
    navigate(`/student/quizzes/${id}`, { state: { justSubmitted: true } });
  }, [submitted, quiz, seconds, answers, marked, id, currentUser.studentId, submitQuiz, navigate, toast, storageKey]);

  // timer
  useEffect(() => {
    if (!quiz || submitted) return;
    if (seconds <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds, quiz, submitted, handleSubmit]);

  // persist progress
  useEffect(() => {
    if (!quiz) return;
    setData(storageKey, { answers, marked, current, seconds });
  }, [answers, marked, current, seconds, quiz, storageKey]);

  useEffect(() => {
    setVisited((v) => (v.includes(current) ? v : [...v, current]));
  }, [current]);

  if (!quiz) return <div className="glass-card" style={{ padding: 24 }}>Quiz not found.</div>;
  if (quizQuestions.length === 0) return <div className="glass-card" style={{ padding: 24 }}>No questions available for this quiz.</div>;

  const q = quizQuestions[current];
  const answeredCount = Object.keys(answers).filter((k) => answers[k]).length;
  const unansweredCount = quizQuestions.length - answeredCount;

  function selectOption(opt) {
    setAnswers((a) => ({ ...a, [q.id]: opt }));
  }
  function clearAnswer() {
    setAnswers((a) => { const n = { ...a }; delete n[q.id]; return n; });
  }
  function toggleMark() {
    setMarked((m) => (m.includes(q.id) ? m.filter((x) => x !== q.id) : [...m, q.id]));
  }

  function navState(idx) {
    const qq = quizQuestions[idx];
    if (idx === current) return 'current';
    if (marked.includes(qq.id)) return 'marked';
    if (answers[qq.id]) return 'answered';
    if (visited.includes(idx)) return 'unanswered';
    return 'unvisited';
  }

  return (
    <div className="quiz-attempt">
      <div className="quiz-attempt-header glass-card">
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{quiz.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Question {current + 1} / {quizQuestions.length}</div>
        </div>
        <Timer seconds={seconds} />
      </div>

      <div style={{ margin: '14px 0' }}>
        <ProgressBar percent={((current + 1) / quizQuestions.length) * 100} />
      </div>

      <div className="attempt-layout">
        <div className="glass-card question-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="badge badge-blue">{q.marks} marks</span>
            <button className={`btn btn-sm ${marked.includes(q.id) ? 'btn-primary' : 'btn-secondary'}`} onClick={toggleMark}>
              {marked.includes(q.id) ? '★ Marked' : '☆ Mark for Review'}
            </button>
          </div>
          <div style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.5, marginBottom: 22 }}>{q.text}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => (
              <label key={i} className={`option-row ${answers[q.id] === opt ? 'selected' : ''}`}>
                <input type="radio" name={q.id} checked={answers[q.id] === opt} onChange={() => selectOption(opt)} />
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>← Previous</button>
            <button className="btn btn-secondary" onClick={clearAnswer}>Clear Answer</button>
            {current < quizQuestions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrent((c) => c + 1)}>Next →</button>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowSubmitConfirm(true)}>Submit Quiz</button>
            )}
          </div>
        </div>

        <div className="glass-card navigator-card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Question Navigator</div>
          <div className="navigator-grid">
            {quizQuestions.map((_, idx) => (
              <button key={idx} className={`nav-cell ${navState(idx)}`} onClick={() => setCurrent(idx)}>
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="nav-legend">
            <LegendItem cls="answered" label="Answered" />
            <LegendItem cls="unanswered" label="Unanswered" />
            <LegendItem cls="marked" label="Marked for Review" />
            <LegendItem cls="current" label="Current" />
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => setShowSubmitConfirm(true)}>
            Submit Quiz
          </button>
        </div>
      </div>

      {showSubmitConfirm && (
        <ConfirmModal
          title="Submit Quiz?"
          message="Are you sure you want to submit this quiz? This action cannot be undone."
          confirmLabel="Submit Quiz"
          cancelLabel="Go Back"
          details={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>Answered: <b>{answeredCount}/{quizQuestions.length}</b></span>
              <span>Unanswered: <b>{unansweredCount}</b></span>
              <span>Marked for Review: <b>{marked.length}</b></span>
            </div>
          }
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitConfirm(false)}
        />
      )}
    </div>
  );
}

function LegendItem({ cls, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
      <span className={`nav-cell ${cls}`} style={{ width: 18, height: 18, fontSize: 0, pointerEvents: 'none' }} />
      {label}
    </div>
  );
}
