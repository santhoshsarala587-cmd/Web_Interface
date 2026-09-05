import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import { Avatar, StatusBadge } from '../../components/UI';

export default function Evaluation() {
  const { submissionId } = useParams();
  const { submissions, quizzes, students, questions, results, saveEvaluation } = useQuiz();
  const toast = useToast();
  const navigate = useNavigate();

  const submission = submissions.find((s) => s.id === submissionId);
  const quiz = quizzes.find((q) => q.id === submission?.quizId);
  const student = students.find((s) => s.studentId === submission?.studentId);
  const result = results.find((r) => r.submissionId === submissionId);
  const qList = quiz ? questions.filter((q) => quiz.questionIds.includes(q.id)) : [];

  const [feedback, setFeedback] = useState('');

  if (!submission || !quiz) return <div className="glass-card" style={{ padding: 24 }}>Submission not found.</div>;

  function handleSaveEvaluation() {
    saveEvaluation(submissionId, { feedback });
    toast('Evaluation saved successfully.', 'success');
    navigate('/admin/submissions');
  }

  return (
    <div>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>← Back</button>

      <div className="glass-card" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar name={student?.name} size={50} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{student?.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{student?.studentId} • {quiz.title}</div>
            </div>
          </div>
          <StatusBadge status={submission.status} />
        </div>

        {result && (
          <div className="bento-grid" style={{ marginTop: 18 }}>
            <MiniStat label="Score" value={`${result.scored}/${result.totalMarks}`} />
            <MiniStat label="Percentage" value={`${result.percentage}%`} />
            <MiniStat label="Correct" value={result.correct} />
            <MiniStat label="Incorrect" value={result.incorrect} />
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: 22 }}>
        <div className="section-title">Answer Review</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {qList.map((q, idx) => {
            const given = submission.answers[q.id];
            const correct = given === q.correctAnswer;
            return (
              <div key={q.id} className="review-item">
                <div style={{ fontWeight: 600, fontSize: 14 }}>Q{idx + 1}. {q.text}</div>
                <div className="grid-2" style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ color: 'var(--text-secondary)' }}>Student Answer</div>
                    <div style={{ fontWeight: 600, color: correct ? '#86efac' : '#fca5a5' }}>{given || 'Not answered'}</div>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ color: 'var(--text-secondary)' }}>Expected Answer</div>
                    <div style={{ fontWeight: 600 }}>{q.correctAnswer}</div>
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 12.5 }}>
                  <span className={`badge ${correct ? 'badge-green' : 'badge-red'}`}>{correct ? `+${q.marks} marks` : '0 marks'}</span>
                  <span style={{ marginLeft: 10, color: 'var(--text-secondary)' }}>Max: {q.marks} marks</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="field" style={{ marginTop: 18 }}>
          <label>Overall Feedback (optional)</label>
          <textarea className="input" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Add feedback for the student..." />
        </div>

        <button className="btn btn-primary" onClick={handleSaveEvaluation}>Save Evaluation</button>
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
