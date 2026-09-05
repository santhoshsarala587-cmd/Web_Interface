import { useEffect, useState } from 'react';

const MESSAGES = [
  'Initializing QuizNova...',
  'Loading assessment engine...',
  'Preparing your dashboard...',
  'Almost ready...',
];

export default function LoadingScreen({ onDone, duration = 2200 }) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      setMsgIndex(Math.min(MESSAGES.length - 1, Math.floor((pct / 100) * MESSAGES.length)));
      if (pct >= 100) {
        clearInterval(tick);
        setTimeout(onDone, 250);
      }
    }, 40);
    return () => clearInterval(tick);
  }, [duration, onDone]);

  return (
    <div className="loading-screen">
      <div className="loading-glow" />
      <div className="loading-logo">
        <div className="logo-mark loading-logo-mark">Q</div>
      </div>
      <div className="loading-title">QuizNova</div>
      <div className="loading-tagline">Create. Challenge. Evaluate.</div>

      <div className="loading-bar-track">
        <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-status">
        <span>{MESSAGES[msgIndex]}</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}
