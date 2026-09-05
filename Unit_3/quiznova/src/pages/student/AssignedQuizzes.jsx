import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import QuizCard from '../../components/QuizCard';
import { EmptyState } from '../../components/UI';

export default function AssignedQuizzes() {
  const { currentUser } = useAuth();
  const { quizzes, assignments, results } = useQuiz();
  const studentId = currentUser.studentId;

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const myAssignments = assignments.filter((a) => a.studentId === studentId);

  let list = myAssignments
    .map((a) => ({
      assignment: a,
      quiz: quizzes.find((q) => q.id === a.quizId),
      result: results.find((r) => r.quizId === a.quizId && r.studentId === studentId),
    }))
    .filter((x) => x.quiz);

  if (search) list = list.filter((x) => x.quiz.title.toLowerCase().includes(search.toLowerCase()) || x.quiz.subject.toLowerCase().includes(search.toLowerCase()));
  if (difficulty !== 'All') list = list.filter((x) => x.quiz.difficulty === difficulty);
  if (status !== 'All') list = list.filter((x) => x.assignment.status === status);

  if (sortBy === 'date') list.sort((a, b) => new Date(a.quiz.endDate) - new Date(b.quiz.endDate));
  if (sortBy === 'name') list.sort((a, b) => a.quiz.title.localeCompare(b.quiz.title));
  if (sortBy === 'difficulty') list.sort((a, b) => a.quiz.difficulty.localeCompare(b.quiz.difficulty));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Assigned Quizzes</h1>
          <p>All quizzes assigned to you across your enrolled subjects.</p>
        </div>
      </div>

      <div className="filters-row">
        <input className="input" placeholder="🔍 Search quizzes..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 220 }} />
        <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option>All</option><option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option>Not Started</option><option>Assigned</option><option>Registered</option><option>Started</option><option>Submitted</option>
        </select>
        <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort: Due Date</option>
          <option value="name">Sort: Name</option>
          <option value="difficulty">Sort: Difficulty</option>
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="📭" title="No quizzes found" subtitle="Try adjusting your filters." />
      ) : (
        <div className="quiz-grid">
          {list.map(({ assignment, quiz, result }) => (
            <QuizCard key={assignment.id} quiz={quiz} assignment={assignment} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
