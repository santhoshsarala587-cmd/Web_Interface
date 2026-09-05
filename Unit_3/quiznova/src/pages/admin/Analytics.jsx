import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { useQuiz } from '../../context/QuizContext';

const PIE_COLORS = ['#22C55E', '#EF4444'];

export default function Analytics() {
  const { quizzes, assignments, submissions, results, questions } = useQuiz();

  const participationRate = assignments.length ? Math.round((submissions.length / assignments.length) * 100) : 0;
  const passCount = results.filter((r) => r.passed).length;
  const failCount = results.filter((r) => !r.passed).length;
  const passRate = results.length ? Math.round((passCount / results.length) * 100) : 0;

  const quizComparison = quizzes.slice(0, 8).map((q) => {
    const rs = results.filter((r) => r.quizId === q.id);
    return {
      name: q.title.length > 12 ? q.title.slice(0, 12) + '…' : q.title,
      avgScore: rs.length ? Math.round(rs.reduce((a, r) => a + r.percentage, 0) / rs.length) : 0,
    };
  });

  const scoreDistribution = [
    { range: '0-40', count: results.filter((r) => r.percentage < 40).length },
    { range: '40-60', count: results.filter((r) => r.percentage >= 40 && r.percentage < 60).length },
    { range: '60-80', count: results.filter((r) => r.percentage >= 60 && r.percentage < 80).length },
    { range: '80-100', count: results.filter((r) => r.percentage >= 80).length },
  ];

  const submissionTrend = quizzes.slice(0, 8).map((q, i) => ({
    name: `Q${i + 1}`,
    submissions: submissions.filter((s) => s.quizId === q.id).length,
  }));

  const questionSuccess = questions.slice(0, 8).map((q) => {
    let total = 0, correct = 0;
    submissions.forEach((s) => {
      if (s.answers[q.id] !== undefined) {
        total++;
        if (s.answers[q.id] === q.correctAnswer) correct++;
      }
    });
    return { name: q.text.slice(0, 10) + '…', rate: total ? Math.round((correct / total) * 100) : 0 };
  }).filter((x) => x.rate !== undefined).slice(0, 6);

  return (
    <div>
      <div className="page-header">
        <div><h1>Analytics</h1><p>Platform-wide performance and engagement metrics.</p></div>
      </div>

      <div className="bento-grid" style={{ marginBottom: 22 }}>
        <MiniStat label="Participation Rate" value={`${participationRate}%`} />
        <MiniStat label="Submission Rate" value={`${assignments.length ? Math.round((submissions.length / assignments.length) * 100) : 0}%`} />
        <MiniStat label="Pass Rate" value={`${passRate}%`} />
        <MiniStat label="Fail Rate" value={`${100 - passRate}%`} />
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Quiz Comparison — Average Score</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f1b33', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="avgScore" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Pass / Fail Split</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'Passed', value: passCount }, { name: 'Failed', value: failCount }]} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: '#0f1b33', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Score Distribution</div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f1b33', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 22 }}>
          <div className="section-title">Submission Trend</div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionTrend}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f1b33', border: '1px solid #334155', borderRadius: 8 }} />
                <Area type="monotone" dataKey="submissions" stroke="#3B82F6" fill="url(#colorSub)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 22 }}>
        <div className="section-title">Question-wise Success Rate</div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={questionSuccess}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0f1b33', border: '1px solid #334155', borderRadius: 8 }} />
              <Line type="monotone" dataKey="rate" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="glass-card stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
