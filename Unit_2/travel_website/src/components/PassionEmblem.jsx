// A small emblem of the three passions (a mountain, a Kabaddi court and a ring of cultures).
// Shown in About until a real portrait (src/assets/photos/me.jpg) is added.
export default function PassionEmblem() {
  return (
    <svg viewBox="0 0 400 480" role="img" aria-label="An emblem of my three passions: mountains, a Kabaddi court line and a compass" preserveAspectRatio="xMidYMid slice" className="emblem">
      <rect width="400" height="480" fill="#173d32" />
      <circle cx="285" cy="130" r="54" fill="#d77a45" />
      <path d="M0 330 L90 210 L150 280 L230 170 L330 300 L400 240 V480 H0Z" fill="#0f2a22" />
      <path d="M0 380 L70 300 L140 360 L220 270 L310 370 L400 320 V480 H0Z" fill="#a7b9a6" opacity="0.9" />
      <path d="M0 430 L100 370 L200 420 L300 360 L400 410 V480 H0Z" fill="#f7f5ef" opacity="0.92" />
      <g fill="none" stroke="#f7f5ef" strokeWidth="3" opacity="0.85">
        <circle cx="105" cy="120" r="34" />
        <path d="M105 82 V158 M67 120 H143" />
        <path d="M105 92 L113 120 L105 148 L97 120Z" fill="#f7f5ef" />
      </g>
      <g stroke="#f7f5ef" strokeWidth="2.5" opacity="0.5">
        <path d="M40 455 H360" />
        <path d="M200 440 V470" />
      </g>
    </svg>
  );
}
