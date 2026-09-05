import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useQuiz } from '../../context/QuizContext';
import { StatusBadge } from '../../components/UI';
import { formatTime } from '../../utils/formatters';

const COLORS = ['#22C55E', '#EF4444', '#94A3B8'];

export default function ResultDetails() {
  const { id } = useParams();
  const { results, quizzes, submissions, questions } = useQuiz();
  const navigate = useNavigate();

  const result = results.find((r) => r.id === id);
  if (!result) return <div className="glass-card" style={{ padding: 24 }}>Result not found.</div>;

  const quiz = quizzes.find((q) => q.id === result.quizId);
  const submission = submissions.find((s) => s.id === result.submissionId);
  const quizQuestions = quiz ? questions.filter((q) => quiz.questionIds.includes(q.id)) : [];

  const chartData = [
    { name: 'Correct', value: result.correct },
    { name: 'Incorrect', value: result.incorrect },
    { name: 'Unanswered', value: result.unanswered },
  ];

  return (
    <div>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>← Back</button>

      <div className="glass-card" style={{ padding: 26, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: '0 0 6px' }}>{quiz?.title}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{quiz?.subject}</p>
          </div>
          <StatusBadge status={result.passed ? 'PASSED' : 'FAILED'} />
        </div>

        <div className="grid-2" style={{ marginTop: 24, alignItems: 'center' }}>
          <div className="bento-grid">
            <StatBox label="Score" value={`${result.scored}/${result.totalMarks}`} />
            <StatBox label="Percentage" value={`${result.percentage}%`} />
            <StatBox label="Grade" value={result.grade} />
            <StatBox label="Time Taken" value={formatTime(submission?.timeTaken || 0)} />
            <StatBox label="Correct" value={result.correct} color="#22C55E" />
            <StatBox label="Incorrect" value={result.incorrect} color="#EF4444" />
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: '#0f1b33', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {quiz?.showExplanations && submission && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-title">Question-wise Review</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
            {quizQuestions.map((q, idx) => {
              const given = submission.answers[q.id];
              const correct = given === q.correctAnswer;
              return (
                <div key={q.id} className="review-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Q{idx + 1}. {q.text}</div>
                    <span className={`badge ${correct ? 'badge-green' : given ? 'badge-red' : 'badge-gray'}`}>
                      {correct ? 'Correct' : given ? 'Incorrect' : 'Unanswered'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, marginTop: 8, color: 'var(--text-secondary)' }}>
                    Your answer: <b style={{ color: correct ? '#86efac' : '#fca5a5' }}>{given || '—'}</b>
                  </div>
                  {!correct && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Correct answer: <b style={{ color: '#86efac' }}>{q.correctAnswer}</b></div>}
                  {q.explanation && <div style={{ fontSize: 12.5, marginTop: 6, color: '#67e8f9' }}>💡 {q.explanation}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color = 'var(--text)' }) {
  return (
    <div className="glass-card" style={{ padding: 14 }}>
      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color }}>{value}</div>
    </div>
  );
}
