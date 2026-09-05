import { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import { StatusBadge, EmptyState } from '../../components/UI';
import { formatDate } from '../../utils/formatters';
import { uid } from '../../utils/storage';

export default function Assignments() {
  const { quizzes, students, assignments, saveAssignments } = useQuiz();
  const toast = useToast();

  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [deptFilter, setDeptFilter] = useState('All');
  const [monitorQuiz, setMonitorQuiz] = useState('');

  function toggleStudent(id) {
    setSelectedStudents((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function selectByDept(dept) {
    const ids = students.filter((s) => s.department === dept).map((s) => s.studentId);
    setSelectedStudents((prev) => Array.from(new Set([...prev, ...ids])));
  }

  function handleAssign() {
    if (!selectedQuiz || selectedStudents.length === 0) {
      toast('Select a quiz and at least one student.', 'error');
      return;
    }
    const quiz = quizzes.find((q) => q.id === selectedQuiz);
    const newAssignments = [];
    selectedStudents.forEach((sid) => {
      const exists = assignments.some((a) => a.quizId === selectedQuiz && a.studentId === sid);
      if (!exists) {
        newAssignments.push({
          id: uid('asg'), quizId: selectedQuiz, studentId: sid,
          assignedDate: new Date().toISOString(), startDate: quiz.startDate, endDate: quiz.endDate,
          status: 'Assigned', registered: false,
        });
      }
    });
    saveAssignments([...assignments, ...newAssignments]);
    toast(`Quiz assigned to ${newAssignments.length} student(s) successfully.`, 'success');
    setSelectedStudents([]);
  }

  const filteredStudents = deptFilter === 'All' ? students : students.filter((s) => s.department === deptFilter);

  const monitorData = monitorQuiz
    ? assignments.filter((a) => a.quizId === monitorQuiz).map((a) => ({
        ...a,
        student: students.find((s) => s.studentId === a.studentId),
      }))
    : [];

  return (
    <div>
      <div className="page-header">
        <div><h1>Quiz Assignments</h1><p>Assign quizzes to students and monitor participation.</p></div>
      </div>

      <div className="glass-card" style={{ padding: 22, marginBottom: 24 }}>
        <div className="section-title">Assign a Quiz</div>
        <div className="grid-2">
          <div className="field">
            <label>Select Quiz</label>
            <select className="input" value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)}>
              <option value="">Choose quiz...</option>
              {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Filter by Department / Class</label>
            <select className="input" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option>All</option><option>CSE</option><option>IT</option><option>ECE</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-sm btn-secondary" onClick={() => selectByDept('CSE')}>+ Select All CSE</button>
          <button className="btn btn-sm btn-secondary" onClick={() => selectByDept('IT')}>+ Select All IT</button>
          <button className="btn btn-sm btn-secondary" onClick={() => selectByDept('ECE')}>+ Select All ECE</button>
          <button className="btn btn-sm btn-secondary" onClick={() => setSelectedStudents(students.map((s) => s.studentId))}>+ Select All Students</button>
          <button className="btn btn-sm btn-secondary" onClick={() => setSelectedStudents([])}>Clear Selection</button>
        </div>

        <div className="student-select-grid">
          {filteredStudents.map((s) => (
            <label key={s.studentId} className={`student-chip ${selectedStudents.includes(s.studentId) ? 'selected' : ''}`}>
              <input type="checkbox" checked={selectedStudents.includes(s.studentId)} onChange={() => toggleStudent(s.studentId)} />
              {s.name} <span style={{ opacity: 0.6 }}>({s.department}-{s.year})</span>
            </label>
          ))}
        </div>

        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleAssign}>
          Assign to {selectedStudents.length} Student(s)
        </button>
      </div>

      <div className="glass-card" style={{ padding: 22 }}>
        <div className="section-title">Participation Monitoring</div>
        <div className="field" style={{ maxWidth: 320 }}>
          <select className="input" value={monitorQuiz} onChange={(e) => setMonitorQuiz(e.target.value)}>
            <option value="">Select a quiz to monitor...</option>
            {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
          </select>
        </div>

        {monitorQuiz && (
          <>
            <div className="bento-grid" style={{ margin: '16px 0' }}>
              <MiniStat label="Total Assigned" value={monitorData.length} />
              <MiniStat label="Registered" value={monitorData.filter((a) => a.registered).length} />
              <MiniStat label="Started" value={monitorData.filter((a) => ['Started', 'Submitted'].includes(a.status)).length} />
              <MiniStat label="Submitted" value={monitorData.filter((a) => a.status === 'Submitted').length} />
            </div>
            {monitorData.length === 0 ? <EmptyState /> : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Student</th><th>Registration</th><th>Started</th><th>Submitted</th><th>Status</th></tr></thead>
                  <tbody>
                    {monitorData.map((a) => (
                      <tr key={a.id}>
                        <td>{a.student?.name}</td>
                        <td>{a.registered ? '✅' : '—'}</td>
                        <td>{['Started', 'Submitted'].includes(a.status) ? '✅' : '—'}</td>
                        <td>{a.status === 'Submitted' ? '✅' : '—'}</td>
                        <td><StatusBadge status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div className="glass-card" style={{ padding: 22, marginTop: 20 }}>
        <div className="section-title">All Assignments</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Quiz</th><th>Assigned</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
            <tbody>
              {assignments.slice(-15).reverse().map((a) => {
                const quiz = quizzes.find((q) => q.id === a.quizId);
                const student = students.find((s) => s.studentId === a.studentId);
                return (
                  <tr key={a.id}>
                    <td>{student?.name}</td>
                    <td>{quiz?.title}</td>
                    <td>{formatDate(a.assignedDate)}</td>
                    <td>{formatDate(a.startDate)}</td>
                    <td>{formatDate(a.endDate)}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="glass-card" style={{ padding: 14 }}>
      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
