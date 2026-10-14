import { useId } from 'react';
import useInView from '../hooks/useInView';
import './KabaddiCourt.css';

const defenders = [
  [105, 215], [170, 178], [235, 152], [300, 142], [365, 152], [430, 178], [495, 215],
];
const teammates = [
  [120, 690], [200, 722], [280, 700], [360, 722], [440, 700], [510, 676],
];

// Illustrated top-down Kabaddi court: a raider crosses the midline toward a chain of defenders.
export default function KabaddiCourt({ labels = true }) {
  const uid = useId().replace(/:/g, '');
  const [ref, seen] = useInView(0.3);

  return (
    <div ref={ref} className={`court ${seen ? 'is-drawn' : ''}`}>
      <svg
        viewBox="-30 -30 660 840"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Illustration of a Kabaddi court: a raider crosses the midline toward a chain of defenders"
      >
        <defs>
          <radialGradient id={`mud-${uid}`} cx="50%" cy="50%" r="75%">
            <stop offset="0" stopColor="#5C432E" />
            <stop offset="1" stopColor="#33251A" />
          </radialGradient>
          <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        <rect x="-30" y="-30" width="660" height="840" fill="#171A18" />
        <rect x="0" y="0" width="600" height="780" fill={`url(#mud-${uid})`} />
        <rect x="0" y="0" width="600" height="780" filter={`url(#grain-${uid})`} className="court__grain" />

        <g className="court__lines" fill="none">
          <rect x="0" y="0" width="600" height="780" />
          <line x1="0" y1="390" x2="600" y2="390" className="court__mid" />
          <line x1="0" y1="165" x2="600" y2="165" />
          <line x1="0" y1="615" x2="600" y2="615" />
          <line x1="0" y1="105" x2="600" y2="105" className="court__bonus" />
          <line x1="0" y1="675" x2="600" y2="675" className="court__bonus" />
          <line x1="60" y1="0" x2="60" y2="780" className="court__lobby" />
          <line x1="540" y1="0" x2="540" y2="780" className="court__lobby" />
        </g>

        {labels && (
          <g className="court__labels">
            <text x="78" y="380">MIDLINE</text>
            <text x="78" y="155">BAULK LINE</text>
            <text x="78" y="95">BONUS LINE</text>
          </g>
        )}

        {teammates.map(([x, y]) => (
          <circle key={`t-${x}`} cx={x} cy={y} r="13" fill="#A7B9A6" />
        ))}
        {defenders.map(([x, y]) => (
          <circle key={`d-${x}`} cx={x} cy={y} r="13" fill="#F7F5EF" />
        ))}

        <path
          className="court__raid"
          d="M300 480 C 365 462 480 410 462 318 S 446 240 432 196"
          pathLength="1"
          fill="none"
        />
        <circle className="court__touch" cx="430" cy="178" r="26" fill="none" />
        <circle className="court__pulse" cx="300" cy="480" r="17" fill="none" />
        <circle cx="300" cy="480" r="17" fill="#D77A45" />
      </svg>
    </div>
  );
}
