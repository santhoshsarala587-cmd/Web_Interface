import { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import Modal, { ConfirmModal } from '../../components/Modal';
import { EmptyState } from '../../components/UI';

export default function QuestionBank() {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuiz();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState([]);

  const categories = ['All', ...new Set(questions.map((q) => q.category))];

  let list = questions.filter((q) => q.text.toLowerCase().includes(search.toLowerCase()));
  if (category !== 'All') list = list.filter((q) => q.category === category);
  if (difficulty !== 'All') list = list.filter((q) => q.difficulty === difficulty);

  function toggleSelect(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function handleDelete() {
    deleteQuestion(deleteTarget.id);
    toast('Question deleted.', 'success');
    setDeleteTarget(null);
  }

  function handleSaveQuestion(q) {
    if (q.id) {
      updateQuestion(q.id, q);
      toast('Question updated.', 'success');
    } else {
      addQuestion({ ...q, id: undefined });
      toast('Question added successfully.', 'success');
    }
    setEditing(null);
    setCreating(false);
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Question Bank</h1><p>Search, manage, and reuse questions across quizzes.</p></div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>+ Add Question</button>
      </div>

      <div className="filters-row">
        <input className="input" placeholder="🔍 Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 240 }} />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option>All</option><option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        {selected.length > 0 && <span className="badge badge-blue" style={{ padding: '8px 14px' }}>{selected.length} selected</span>}
      </div>

      {list.length === 0 ? <EmptyState icon="🗂️" title="No questions found" /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th></th><th>Question</th><th>Category</th><th>Difficulty</th><th>Type</th><th>Marks</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((q) => (
                <tr key={q.id}>
                  <td><input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggleSelect(q.id)} /></td>
                  <td style={{ maxWidth: 320 }}>{q.text.slice(0, 70)}{q.text.length > 70 ? '...' : ''}</td>
                  <td>{q.category}</td>
                  <td><span className={`badge badge-${q.difficulty === 'Easy' ? 'green' : q.difficulty === 'Medium' ? 'yellow' : 'red'}`}>{q.difficulty}</span></td>
                  <td>MCQ</td>
                  <td>{q.marks}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => setPreview(q)}>Preview</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditing(q)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(q)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview && (
        <Modal title="Question Preview" onClose={() => setPreview(null)} footer={<button className="btn btn-primary" onClick={() => setPreview(null)}>Close</button>}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>{preview.text}</div>
          {preview.options.map((o, i) => (
            <div key={i} className={`option-row ${o === preview.correctAnswer ? 'selected' : ''}`} style={{ marginBottom: 8, cursor: 'default' }}>
              <span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{o}</span>
            </div>
          ))}
          {preview.explanation && <div style={{ marginTop: 10, fontSize: 13, color: '#67e8f9' }}>💡 {preview.explanation}</div>}
        </Modal>
      )}

      {(editing || creating) && (
        <QuestionForm
          initial={editing}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSave={handleSaveQuestion}
        />
      )}

      {deleteTarget && (
        <ConfirmModal title="Delete Question" message="This question will be permanently removed from the bank." confirmLabel="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}

function QuestionForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial || {
    text: '', options: ['', '', '', ''], correctAnswer: '', marks: 5, difficulty: 'Medium', category: 'General', explanation: '', type: 'mcq',
  });

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function updateOpt(i, v) { const opts = [...form.options]; opts[i] = v; setForm((f) => ({ ...f, options: opts })); }

  return (
    <Modal
      title={initial ? 'Edit Question' : 'Add Question'}
      onClose={onCancel}
      footer={<>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSave(form)}>Save Question</button>
      </>}
    >
      <div className="field"><label>Question Text</label><textarea className="input" value={form.text} onChange={(e) => update('text', e.target.value)} /></div>
      {form.options.map((o, i) => (
        <div className="field" key={i}><label>Option {String.fromCharCode(65 + i)}</label><input className="input" value={o} onChange={(e) => updateOpt(i, e.target.value)} /></div>
      ))}
      <div className="field"><label>Correct Answer</label>
        <select className="input" value={form.correctAnswer} onChange={(e) => update('correctAnswer', e.target.value)}>
          <option value="">Select</option>
          {form.options.map((o, i) => o && <option key={i} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="grid-2">
        <div className="field"><label>Category</label><input className="input" value={form.category} onChange={(e) => update('category', e.target.value)} /></div>
        <div className="field"><label>Marks</label><input type="number" className="input" value={form.marks} onChange={(e) => update('marks', Number(e.target.value))} /></div>
      </div>
      <div className="field"><label>Difficulty</label>
        <select className="input" value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
      </div>
    </Modal>
  );
}
