import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { EmptyState, Avatar } from '../../components/UI';

export default function StudentManagement() {
  const { students, assignments } = useQuiz();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  let list = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase()));
  if (dept !== 'All') list = list.filter((s) => s.department === dept);

  return (
    <div>
      <div className="page-header">
        <div><h1>Student Management</h1><p>View and manage all enrolled students.</p></div>
      </div>

      <div className="filters-row">
        <input className="input" placeholder="🔍 Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 240 }} />
        <select className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
          <option>All</option><option>CSE</option><option>IT</option><option>ECE</option>
        </select>
      </div>

      {list.length === 0 ? <EmptyState icon="🎓" title="No students found" /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Student ID</th><th>Department</th><th>Year</th><th>Assigned</th><th>Completed</th><th>Avg Score</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((s) => {
                const assignedCount = assignments.filter((a) => a.studentId === s.studentId).length;
                return (
                  <tr key={s.studentId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={s.name} size={30} />
                        <div><div style={{ fontWeight: 600 }}>{s.name}</div><div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{s.email}</div></div>
                      </div>
                    </td>
                    <td>{s.studentId}</td>
                    <td>{s.department}</td>
                    <td>{s.year}</td>
                    <td>{assignedCount}</td>
                    <td>{s.completedQuizzes}</td>
                    <td>{s.averageScore}%</td>
                    <td><span className="badge badge-green">{s.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate('/admin/assignments')}>Assign Quiz</button>
                      </div>
                    </td>
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
