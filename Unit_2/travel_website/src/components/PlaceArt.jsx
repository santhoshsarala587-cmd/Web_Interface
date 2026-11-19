import { useId } from 'react';
import './PlaceArt.css';

// Illustrated landscapes shown ONLY when no photograph exists for a place.
// They are generic scenes for the type of place, not depictions of a real trip.
const W = 800;
const H = 600;

const ridge = (base, amp, freq, phase) => {
  let d = `M0 ${H}`;
  for (let x = 0; x <= W; x += 16) {
    const y = base + amp * (Math.sin(x * freq + phase) + 0.5 * Math.sin(x * freq * 2.3 + phase * 1.7));
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return `${d} L${W} ${H} Z`;
};

const Peak = ({ x, top, w, base, c, snow = '#f4f6f7' }) => {
  const k = (base - top) * 0.3;
  return (
    <g>
      <polygon points={`${x - w},${base} ${x},${top} ${x + w},${base}`} fill={c} />
      {snow && (
        <polygon
          points={`${x - w * 0.3},${top + k} ${x},${top} ${x + w * 0.3},${top + k} ${x + w * 0.12},${top + k * 0.75} ${x},${top + k * 1.05} ${x - w * 0.14},${top + k * 0.75}`}
          fill={snow}
        />
      )}
    </g>
  );
};

const themes = {
  tea: {
    sky: ['#bfd9d0', '#f4efdc'],
    sun: [610, 140, 46, '#fff7dc'],
    ridges: [['#a6c7a5', 330, 28, 0.008, 1], ['#78a97f', 395, 32, 0.011, 2], ['#468259', 455, 28, 0.015, 3], ['#245f41', 525, 22, 0.02, 4]],
    front: () => (
      <g fill="none" stroke="#e9f4d8" strokeOpacity="0.28" strokeWidth="2">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M0 ${430 + i * 22} Q200 ${405 + i * 22} 400 ${440 + i * 22} T800 ${420 + i * 22}`} />
        ))}
      </g>
    ),
    mist: 300,
  },
  falls: {
    sky: ['#a9cbbd', '#e8ecdc'],
    sun: [130, 110, 38, '#fffbe8'],
    ridges: [['#7fa88b', 290, 24, 0.009, 2], ['#4a8660', 350, 28, 0.012, 5]],
    front: () => (
      <g>
        {/* sheer rock face with the cascade */}
        <path d="M250 235 L560 235 L610 380 L650 600 L170 600 L215 380 Z" fill="#2c4a3b" />
        <path d="M250 235 L330 235 L300 420 L215 380 Z" fill="#223c30" />
        <path d="M470 235 L560 235 L610 380 L560 430 Z" fill="#35574a" />
        {/* three-step waterfall */}
        <path d="M376 235 h62 c6 46 -4 70 0 100 h-70 c4 -30 -6 -54 8 -100 z" fill="#f6fbf9" />
        <path d="M368 335 h80 c6 40 -2 62 2 96 h-90 c6 -34 -4 -56 8 -96 z" fill="#eef6f3" opacity="0.96" />
        <path d="M360 431 h96 c8 44 -2 70 4 112 h-108 c8 -42 -6 -68 8 -112 z" fill="#ffffff" opacity="0.96" />
        {/* ledges */}
        <rect x="356" y="331" width="104" height="8" fill="#223c30" opacity="0.7" />
        <rect x="350" y="427" width="116" height="8" fill="#223c30" opacity="0.7" />
        {/* spray and pool */}
        <ellipse cx="410" cy="548" rx="96" ry="18" fill="#dff0ee" opacity="0.7" />
        <ellipse cx="410" cy="566" rx="150" ry="22" fill="#4f8f93" />
        <ellipse cx="410" cy="563" rx="108" ry="12" fill="#7fb8b8" opacity="0.8" />
        {/* boulders */}
        <ellipse cx="248" cy="572" rx="62" ry="34" fill="#3a3f3c" />
        <ellipse cx="575" cy="578" rx="70" ry="30" fill="#454b47" />
        <ellipse cx="170" cy="598" rx="60" ry="26" fill="#2f3431" />
        {/* trees clinging to the cliff */}
        {[[200, 330], [235, 290], [590, 320], [625, 400], [180, 430]].map(([x, y]) => (
          <polygon key={x + y} points={`${x - 22},${y + 52} ${x},${y} ${x + 22},${y + 52}`} fill="#1c4a30" />
        ))}
      </g>
    ),
    mist: 470,
  },
  rainforest: {
    sky: ['#b5d6c6', '#eef0dd'],
    sun: [660, 120, 38, '#fffbe8'],
    ridges: [['#86b392', 290, 30, 0.008, 3], ['#4d9061', 370, 34, 0.011, 1], ['#27744a', 450, 30, 0.015, 4], ['#14502f', 525, 22, 0.02, 2]],
    front: () => (
      <g>
        <rect x="200" y="330" width="16" height="140" fill="#f3f8f6" opacity="0.9" />
        <rect x="540" y="300" width="22" height="190" fill="#f3f8f6" opacity="0.9" />
        <ellipse cx="208" cy="472" rx="34" ry="8" fill="#f3f8f6" opacity="0.5" />
        <ellipse cx="551" cy="492" rx="42" ry="9" fill="#f3f8f6" opacity="0.5" />
      </g>
    ),
    mist: 360,
  },
  alps: {
    sky: ['#7fa9d6', '#e9f1f8'],
    sun: [120, 110, 34, '#ffffff'],
    back: () => (
      <g>
        <Peak x={230} top={170} w={230} base={470} c="#8697ae" />
        <Peak x={520} top={110} w={270} base={470} c="#6b7f9c" />
        <Peak x={710} top={210} w={180} base={470} c="#8697ae" />
      </g>
    ),
    ridges: [['#4d7060', 470, 14, 0.02, 1], ['#2d5a45', 530, 16, 0.025, 3]],
    mist: 400,
  },
  patagonia: {
    sky: ['#e0a46a', '#f6e2bd'],
    sun: [560, 250, 70, '#fff0cf'],
    back: () => (
      <g>
        <Peak x={300} top={110} w={90} base={470} c="#4a4651" snow="#e9e4e0" />
        <Peak x={400} top={150} w={80} base={470} c="#5a5560" snow="#e9e4e0" />
        <Peak x={500} top={95} w={100} base={470} c="#413d47" snow="#e9e4e0" />
        <Peak x={160} top={250} w={150} base={470} c="#625c66" snow="#e9e4e0" />
        <Peak x={680} top={240} w={160} base={470} c="#625c66" snow="#e9e4e0" />
      </g>
    ),
    ridges: [['#bd9d5e', 465, 14, 0.015, 2], ['#8d7640', 510, 14, 0.02, 5]],
    front: () => <rect x="0" y="548" width="800" height="52" fill="#5c8fa2" />,
  },
  ladakh: {
    sky: ['#5f9ad2', '#eee6d2'],
    sun: [120, 100, 30, '#ffffff'],
    back: () => (
      <g>
        <Peak x={220} top={190} w={280} base={480} c="#b99a74" snow="#f1ebe0" />
        <Peak x={570} top={140} w={320} base={480} c="#a38059" snow="#f1ebe0" />
      </g>
    ),
    ridges: [['#cdb084', 470, 16, 0.014, 2], ['#a98a5e', 525, 14, 0.02, 4]],
    front: () => (
      <g fill="#fbf8f0">
        <path d="M588 470 a34 34 0 0 1 68 0 Z" />
        <rect x="618" y="415" width="8" height="18" />
        <rect x="578" y="470" width="88" height="10" />
      </g>
    ),
  },
  skyline: {
    sky: ['#f0a977', '#f8e6c6'],
    sun: [400, 360, 110, '#fff0c9'],
    back: () => (
      <g fill="#2f3f4a">
        <path d="M290 460 a110 110 0 0 1 220 0 Z" />
        <path d="M335 360 a65 65 0 0 1 130 0 Z" />
        <rect x="150" y="280" width="14" height="180" />
        <polygon points="150,280 157,240 164,280" />
        <rect x="236" y="320" width="12" height="140" />
        <polygon points="236,320 242,285 248,320" />
        <rect x="552" y="320" width="12" height="140" />
        <polygon points="552,320 558,285 564,320" />
        <rect x="636" y="280" width="14" height="180" />
        <polygon points="636,280 643,240 650,280" />
        <rect x="0" y="430" width="150" height="40" />
        <rect x="650" y="430" width="150" height="40" />
      </g>
    ),
    front: () => (
      <g>
        <rect x="0" y="460" width="800" height="140" fill="#3b6b80" />
        <g stroke="#f6dfb8" strokeOpacity="0.4" strokeWidth="3">
          {[490, 520, 550].map((y) => <line key={y} x1="220" y1={y} x2="580" y2={y} />)}
        </g>
      </g>
    ),
  },
  chimneys: {
    sky: ['#efb79a', '#fae9d0'],
    sun: [120, 150, 48, '#fff4de'],
    ridges: [['#dcae86', 400, 20, 0.009, 1], ['#c48f66', 480, 24, 0.012, 3]],
    front: () => (
      <g>
        {[[230, 470, 36, 150], [330, 490, 28, 110], [470, 480, 40, 170], [570, 500, 30, 120], [680, 480, 34, 130]].map(([x, y, w, h]) => (
          <g key={x}>
            <polygon points={`${x - w},${y + 40} ${x - w * 0.35},${y - h} ${x + w * 0.35},${y - h} ${x + w},${y + 40}`} fill="#b57c56" />
            <ellipse cx={x} cy={y - h} rx={w * 0.5} ry="10" fill="#8f5d3d" />
          </g>
        ))}
        {[[600, 160], [690, 230], [260, 210]].map(([x, y]) => (
          <g key={x}>
            <ellipse cx={x} cy={y} rx="26" ry="32" fill="#e56a54" />
            <rect x={x - 6} y={y + 40} width="12" height="9" fill="#5a3a24" />
          </g>
        ))}
      </g>
    ),
  },
  fort: {
    sky: ['#f0a56a', '#fbe3b8'],
    sun: [600, 250, 80, '#fff0cc'],
    back: () => (
      <g fill="#8a4a29">
        <rect x="170" y="330" width="460" height="140" />
        {Array.from({ length: 15 }).map((_, i) => (
          <rect key={i} x={170 + i * 32} y="312" width="18" height="20" />
        ))}
        <rect x="150" y="270" width="64" height="200" />
        <rect x="586" y="270" width="64" height="200" />
        <path d="M150 270 a32 32 0 0 1 64 0 Z" />
        <path d="M586 270 a32 32 0 0 1 64 0 Z" />
        <path d="M360 470 v-70 a40 40 0 0 1 80 0 v70 Z" fill="#3b1f12" />
      </g>
    ),
    ridges: [['#dba35f', 480, 14, 0.012, 2], ['#bf8545', 540, 18, 0.015, 4]],
  },
  ghats: {
    sky: ['#f3a06a', '#fbe3bb'],
    sun: [400, 300, 90, '#fff0cc'],
    back: () => (
      <g fill="#8a4a38">
        <rect x="0" y="300" width="90" height="170" />
        <polygon points="90,300 130,250 170,300" />
        <rect x="130" y="260" width="110" height="210" />
        <rect x="240" y="320" width="120" height="150" />
        <rect x="520" y="300" width="100" height="170" />
        <polygon points="560,300 570,230 580,300" />
        <rect x="620" y="270" width="180" height="200" />
      </g>
    ),
    front: () => (
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={0} y={470 + i * 10} width={800} height="6" fill="#c98a5c" opacity={0.9 - i * 0.12} />
        ))}
        <rect x="0" y="520" width="800" height="80" fill="#476f86" />
        <g stroke="#f5dcb5" strokeOpacity="0.45" strokeWidth="3">
          {[545, 570].map((y) => <line key={y} x1="120" y1={y} x2="680" y2={y} />)}
        </g>
        <path d="M330 540 q40 22 100 0 Z" fill="#2d2a28" />
      </g>
    ),
  },
};

export default function PlaceArt({ theme = 'tea', label }) {
  const uid = useId().replace(/:/g, '');
  const t = themes[theme] || themes.tea;

  return (
    <svg
      className="place-art"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label || `Illustrated ${theme} landscape`}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.sky[0]} />
          <stop offset="1" stopColor={t.sky[1]} />
        </linearGradient>
        <linearGradient id={`mist-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#sky-${uid})`} />
      {t.sun && <circle cx={t.sun[0]} cy={t.sun[1]} r={t.sun[2]} fill={t.sun[3]} opacity="0.95" />}
      {t.back && t.back()}
      {t.ridges && t.ridges.map(([c, b, a, f, p]) => <path key={c + b} d={ridge(b, a, f, p)} fill={c} />)}
      {t.front && t.front()}
      {t.mist && <rect x="0" y={t.mist} width={W} height="90" fill={`url(#mist-${uid})`} />}
    </svg>
  );
}
