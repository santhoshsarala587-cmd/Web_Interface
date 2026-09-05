import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import { ConfirmModal } from '../../components/Modal';
import { StatusBadge, EmptyState } from '../../components/UI';
import { uid } from '../../utils/storage';

export default function QuizManagement() {
  const { quizzes, assignments, submissions, deleteQuiz, createQuiz } = useQuiz();
  const toast = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = quizzes.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()));

  function handleDuplicate(q) {
    const copy = { ...q, id: undefined, title: `${q.title} (Copy)`, status: 'Draft' };
    createQuiz(copy);
    toast('Quiz duplicated successfully.', 'success');
  }

  function handleDelete() {
    deleteQuiz(deleteTarget.id);
    toast('Quiz deleted.', 'success');
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Quiz Management</h1><p>Manage all created assessments.</p></div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/quizzes/create')}>+ Create New Quiz</button>
      </div>

      <div className="filters-row">
        <input className="input" placeholder="🔍 Search quizzes..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 240 }} />
      </div>

      {filtered.length === 0 ? <EmptyState icon="📭" title="No quizzes found" /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Quiz</th><th>Subject</th><th>Questions</th><th>Duration</th><th>Assigned</th><th>Participants</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((q) => {
                const assigned = assignments.filter((a) => a.quizId === q.id).length;
                const participants = submissions.filter((s) => s.quizId === q.id).length;
                return (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>{q.title}</td>
                    <td>{q.subject}</td>
                    <td>{q.questionIds.length}</td>
                    <td>{q.duration} min</td>
                    <td>{assigned}</td>
                    <td>{participants}</td>
                    <td><StatusBadge status={q.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/admin/quizzes/${q.id}`)}>View</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate('/admin/assignments')}>Assign</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate('/admin/results')}>Results</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleDuplicate(q)}>Duplicate</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(q)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Quiz"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
