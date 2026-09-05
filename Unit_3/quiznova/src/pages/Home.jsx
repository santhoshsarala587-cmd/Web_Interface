import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: '📝', title: 'Create Assessments', desc: 'Build MCQ quizzes in minutes with a guided step-by-step wizard.' },
  { icon: '⏱️', title: 'Timed Attempts', desc: 'Live timers, question navigators, and auto-submit keep exams fair.' },
  { icon: '📊', title: 'Instant Analytics', desc: 'Track participation, scores, and pass rates with rich dashboards.' },
  { icon: '🏆', title: 'Controlled Publishing', desc: "Evaluate submissions and publish results exactly when you're ready." },
];

const AUTO_ADVANCE_SECONDS = 10;

export default function Home() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(AUTO_ADVANCE_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          navigate('/login');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [navigate]);

  function goNow(path) {
    clearInterval(timerRef.current);
    navigate(path);
  }

  const progressPct = ((AUTO_ADVANCE_SECONDS - secondsLeft) / AUTO_ADVANCE_SECONDS) * 100;

  return (
    <div className="home-page">
      <div className="home-glow home-glow-a" />
      <div className="home-glow home-glow-b" />

      <div className="home-nav">
        <div className="home-nav-logo">
          <div className="logo-mark">Q</div>
          <span>QuizNova</span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => goNow('/login')}>Skip Intro →</button>
      </div>

      <div className="home-hero">
        <div className="home-badge fade-in-up d1">🎓 Built for modern classrooms</div>
        <h1 className="home-title fade-in-up d2">
          Create. <span className="gradient-text">Challenge.</span> Evaluate.
        </h1>
        <p className="home-subtitle fade-in-up d3">
          QuizNova is a complete online assessment platform for colleges — build quizzes, assign them to
          students, run timed exams, and publish results, all from one clean dashboard.
        </p>
        <div className="home-cta-row fade-in-up d4">
          <button className="btn btn-primary" onClick={() => goNow('/login')}>Get Started →</button>
          <button className="btn btn-outline" onClick={() => goNow('/signup')}>Create an Account</button>
        </div>
      </div>

      <div className="home-features fade-in-up d5">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="glass-card hoverable home-feature-card" style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
            <div className="home-feature-icon">{f.icon}</div>
            <div className="home-feature-title">{f.title}</div>
            <div className="home-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      <div className="home-footer fade-in-up d6">
        <div className="home-autoadvance">
          <div className="progress-track" style={{ width: 160 }}>
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span>Continuing to login in {secondsLeft}s</span>
        </div>
      </div>
    </div>
  );
}
