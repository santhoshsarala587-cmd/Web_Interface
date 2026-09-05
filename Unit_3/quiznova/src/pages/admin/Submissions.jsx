import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { StatusBadge, EmptyState } from '../../components/UI';
import { formatDate } from '../../utils/formatters';

export default function Submissions() {
  const { submissions, quizzes, students, results } = useQuiz();
  const navigate = useNavigate();

  const [quizFilter, setQuizFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  let list = submissions.map((s) => ({
    sub: s,
    quiz: quizzes.find((q) => q.id === s.quizId),
    student: students.find((st) => st.studentId === s.studentId),
    result: results.find((r) => r.submissionId === s.id),
  }));

  if (quizFilter !== 'All') list = list.filter((x) => x.quiz?.id === quizFilter);
  if (statusFilter !== 'All') list = list.filter((x) => x.sub.status === statusFilter);
  if (search) list = list.filter((x) => x.student?.name.toLowerCase().includes(search.toLowerCase()));

  list.sort((a, b) => new Date(b.sub.submittedAt) - new Date(a.sub.submittedAt));

  return (
    <div>
      <div className="page-header">
        <div><h1>Submissions</h1><p>Review and evaluate all quiz submissions.</p></div>
      </div>

      <div className="filters-row">
        <input className="input" placeholder="🔍 Search student..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 200 }} />
        <select className="input" value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
          <option value="All">All Quizzes</option>
          {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
        </select>
        <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option>Under Evaluation</option><option>Evaluated</option><option>Published</option>
        </select>
      </div>

      {list.length === 0 ? <EmptyState icon="📥" title="No submissions found" /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Quiz</th><th>Submitted At</th><th>Score</th><th>Evaluation Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map(({ sub, quiz, student, result }) => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 600 }}>{student?.name}</td>
                  <td>{quiz?.title}</td>
                  <td>{formatDate(sub.submittedAt)}</td>
                  <td>{result ? `${result.scored}/${result.totalMarks}` : '—'}</td>
                  <td><StatusBadge status={sub.status} /></td>
                  <td><button className="btn btn-sm btn-outline" onClick={() => navigate(`/admin/evaluation/${sub.id}`)}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
