import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/Toast';
import { uid } from '../../utils/storage';

const STEPS = ['Basic Information', 'Configuration', 'Availability', 'Questions'];

export default function CreateQuiz() {
  const { createQuiz, addQuestion, questions } = useQuiz();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', description: '', subject: '', category: 'Core CS', difficulty: 'Medium',
    duration: 30, passPercentage: 40, attemptsAllowed: 1, randomize: false, showExplanations: true,
    startDate: '', startTime: '09:00', endDate: '', endTime: '18:00',
  });
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showBank, setShowBank] = useState(false);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  const totalMarks = quizQuestions.reduce((a, q) => a + (q.marks || 5), 0);

  function addNewQuestion() {
    setQuizQuestions((qs) => [...qs, {
      id: uid('newq'), text: '', type: 'mcq', options: ['', '', '', ''],
      correctAnswer: '', marks: 5, difficulty: 'Medium', category: form.subject || 'General', explanation: '',
    }]);
  }

  function updateQuestion(id, patch) {
    setQuizQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }
  function updateOption(id, idx, val) {
    setQuizQuestions((qs) => qs.map((q) => {
      if (q.id !== id) return q;
      const opts = [...q.options]; opts[idx] = val;
      return { ...q, options: opts };
    }));
  }
  function removeQuestion(id) {
    setQuizQuestions((qs) => qs.filter((q) => q.id !== id));
  }

  function addFromBank(q) {
    if (quizQuestions.some((x) => x.id === q.id)) return;
    setQuizQuestions((qs) => [...qs, q]);
    toast(`Added "${q.text.slice(0, 30)}..." to quiz.`, 'success');
  }

  function buildQuizObject(status) {
    const start = form.startDate ? new Date(`${form.startDate}T${form.startTime}`) : new Date();
    const end = form.endDate ? new Date(`${form.endDate}T${form.endTime}`) : new Date(Date.now() + 7 * 86400000);

    // persist any newly-authored questions to question bank
    const persistedIds = [];
    quizQuestions.forEach((q) => {
      if (q.id.startsWith('newq_')) {
        const saved = addQuestion({ ...q, id: undefined });
        persistedIds.push(saved.id);
      } else {
        persistedIds.push(q.id);
      }
    });

    return {
      title: form.title || 'Untitled Quiz',
      description: form.description,
      subject: form.subject || 'General',
      category: form.category,
      difficulty: form.difficulty,
      duration: Number(form.duration),
      totalMarks: totalMarks || persistedIds.length * 5,
      passPercentage: Number(form.passPercentage),
      attemptsAllowed: Number(form.attemptsAllowed),
      randomize: form.randomize,
      showExplanations: form.showExplanations,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      questionIds: persistedIds,
      status,
      createdBy: 'Dr. Anil Verma',
      resultsPublished: false,
    };
  }

  function handleSaveDraft() {
    createQuiz(buildQuizObject('Draft'));
    toast('Quiz saved as draft.', 'success');
    navigate('/admin/quizzes');
  }

  function handlePublish() {
    if (!form.title) return toast('Please enter a quiz title.', 'error');
    if (quizQuestions.length === 0) return toast('Add at least one question before publishing.', 'error');
    createQuiz(buildQuizObject('Scheduled'));
    toast('Quiz created successfully.', 'success');
    navigate('/admin/quizzes');
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Create Quiz</h1><p>Build a new assessment step by step.</p></div>
      </div>

      <div className="stepper-track">
        {STEPS.map((s, i) => (
          <div key={s} className={`stepper-item ${i === step ? 'active' : i < step ? 'done' : ''}`} onClick={() => setStep(i)}>
            <div className="stepper-dot">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 26, marginTop: 20 }}>
        {step === 0 && (
          <>
            <div className="field"><label>Quiz Title</label><input className="input" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. JavaScript Fundamentals" /></div>
            <div className="field"><label>Description</label><textarea className="input" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Brief description of what this quiz covers..." /></div>
            <div className="grid-2">
              <div className="field"><label>Subject</label><input className="input" value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="e.g. Web Development" /></div>
              <div className="field"><label>Category</label>
                <select className="input" value={form.category} onChange={(e) => update('category', e.target.value)}>
                  <option>Core CS</option><option>Web Dev</option><option>Databases</option><option>Networking</option>
                </select>
              </div>
            </div>
            <div className="field"><label>Difficulty</label>
              <select className="input" value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid-2">
              <div className="field"><label>Duration (minutes)</label><input type="number" className="input" value={form.duration} onChange={(e) => update('duration', e.target.value)} /></div>
              <div className="field"><label>Pass Percentage</label><input type="number" className="input" value={form.passPercentage} onChange={(e) => update('passPercentage', e.target.value)} /></div>
            </div>
            <div className="field"><label>Attempts Allowed</label><input type="number" className="input" value={form.attemptsAllowed} onChange={(e) => update('attemptsAllowed', e.target.value)} /></div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, fontSize: 14 }}>
              <input type="checkbox" checked={form.randomize} onChange={(e) => update('randomize', e.target.checked)} /> Randomize question order
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
              <input type="checkbox" checked={form.showExplanations} onChange={(e) => update('showExplanations', e.target.checked)} /> Show explanations after results are published
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid-2">
              <div className="field"><label>Start Date</label><input type="date" className="input" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} /></div>
              <div className="field"><label>Start Time</label><input type="time" className="input" value={form.startTime} onChange={(e) => update('startTime', e.target.value)} /></div>
            </div>
            <div className="grid-2">
              <div className="field"><label>End Date</label><input type="date" className="input" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} /></div>
              <div className="field"><label>End Time</label><input type="time" className="input" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} /></div>
            </div>
          </>
        )}

        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>Total questions: <b>{quizQuestions.length}</b> • Total marks: <b>{totalMarks}</b></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowBank(!showBank)}>{showBank ? 'Hide' : 'Browse'} Question Bank</button>
                <button className="btn btn-primary btn-sm" onClick={addNewQuestion}>+ Add Question</button>
              </div>
            </div>

            {showBank && (
              <div className="glass-card" style={{ padding: 14, marginBottom: 16, maxHeight: 220, overflowY: 'auto' }}>
                {questions.slice(0, 30).map((q) => (
                  <div key={q.id} className="mini-quiz-row" style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 13 }}>{q.text.slice(0, 60)}...</div>
                    <button className="btn btn-sm btn-outline" onClick={() => addFromBank(q)}>Add</button>
                  </div>
                ))}
              </div>
            )}

            {quizQuestions.length === 0 ? (
              <div className="empty-state">No questions added yet. Add from the bank or create new ones.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="glass-card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <b>Question {idx + 1}</b>
                      <button className="btn btn-sm btn-danger" onClick={() => removeQuestion(q.id)}>Delete</button>
                    </div>
                    <div className="field"><textarea className="input" placeholder="Question text" value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })} /></div>
                    <div className="grid-2">
                      {q.options.map((opt, i) => (
                        <div className="field" key={i}>
                          <label>Option {String.fromCharCode(65 + i)}</label>
                          <input className="input" value={opt} onChange={(e) => updateOption(q.id, i, e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div className="grid-2">
                      <div className="field"><label>Correct Answer</label>
                        <select className="input" value={q.correctAnswer} onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}>
                          <option value="">Select correct option</option>
                          {q.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Marks</label><input type="number" className="input" value={q.marks} onChange={(e) => updateQuestion(q.id, { marks: Number(e.target.value) })} /></div>
                    </div>
                    <div className="field"><label>Explanation (optional)</label><input className="input" value={q.explanation} onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })} /></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22, flexWrap: 'wrap', gap: 10 }}>
        <button className="btn btn-secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>← Back</button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleSaveDraft}>Save Draft</button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>Continue →</button>
          ) : (
            <button className="btn btn-primary" onClick={handlePublish}>Publish Quiz</button>
          )}
        </div>
      </div>
    </div>
  );
}
