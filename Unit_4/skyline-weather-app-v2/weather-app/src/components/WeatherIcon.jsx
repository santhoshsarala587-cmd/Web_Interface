const ICONS = {
  'clear-day': (
    <>
      <circle cx="32" cy="32" r="13" fill="var(--sun-400)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="32" y1="10" x2="32" y2="4"
          stroke="var(--sun-400)" strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
    </>
  ),
  'clear-night': (
    <path
      d="M40 14a18 18 0 1 0 10 32.6A14 14 0 0 1 40 14z"
      fill="var(--mist-200)"
    />
  ),
  'cloud-day': (
    <>
      <circle cx="24" cy="26" r="10" fill="var(--sun-400)" />
      <path
        d="M20 44a11 11 0 0 1 3-21.6A13 13 0 0 1 47 28a9 9 0 0 1-2 16H20z"
        fill="var(--mist-100)"
      />
    </>
  ),
  'cloud-night': (
    <>
      <path d="M22 20a9 9 0 1 0 6 15.7A7 7 0 0 1 22 20z" fill="var(--mist-400)" />
      <path
        d="M20 44a11 11 0 0 1 3-21.6A13 13 0 0 1 47 28a9 9 0 0 1-2 16H20z"
        fill="var(--mist-100)"
      />
    </>
  ),
  clouds: (
    <>
      <path
        d="M14 40a10 10 0 0 1 3-19.6A12 12 0 0 1 40 24a8 8 0 0 1-1 16H14z"
        fill="var(--mist-400)"
      />
      <path
        d="M22 48a9 9 0 0 1 2.5-17.6A11 11 0 0 1 46 33a7.5 7.5 0 0 1-1.5 15H22z"
        fill="var(--mist-100)"
      />
    </>
  ),
  rain: (
    <>
      <path
        d="M16 34a10 10 0 0 1 3-19.6A12 12 0 0 1 42 18a8 8 0 0 1-1 16H16z"
        fill="var(--mist-200)"
      />
      {[20, 30, 40].map((x, i) => (
        <line
          key={x}
          x1={x} y1="40" x2={x - 4} y2="52"
          stroke="var(--rain-400)" strokeWidth="3" strokeLinecap="round"
          opacity={1 - i * 0.15}
        />
      ))}
    </>
  ),
  drizzle: (
    <>
      <path
        d="M16 32a10 10 0 0 1 3-19.6A12 12 0 0 1 42 16a8 8 0 0 1-1 16H16z"
        fill="var(--mist-200)"
      />
      {[20, 30, 40].map((x, i) => (
        <line
          key={x}
          x1={x} y1="38" x2={x - 2} y2="46"
          stroke="var(--rain-400)" strokeWidth="2.5" strokeLinecap="round"
          opacity={1 - i * 0.15}
        />
      ))}
    </>
  ),
  thunder: (
    <>
      <path
        d="M16 30a10 10 0 0 1 3-19.6A12 12 0 0 1 42 14a8 8 0 0 1-1 16H16z"
        fill="var(--mist-400)"
      />
      <path d="M33 32l-9 14h6l-4 12 13-16h-7l5-10z" fill="var(--sun-400)" />
    </>
  ),
  snow: (
    <>
      <path
        d="M16 30a10 10 0 0 1 3-19.6A12 12 0 0 1 42 14a8 8 0 0 1-1 16H16z"
        fill="var(--mist-200)"
      />
      {[22, 32, 42].map((x, i) => (
        <g key={x} transform={`translate(${x} ${46 + (i % 2) * 6})`}>
          <line x1="-5" y1="0" x2="5" y2="0" stroke="var(--mist-100)" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="var(--mist-100)" strokeWidth="2" strokeLinecap="round" />
          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="var(--mist-100)" strokeWidth="2" strokeLinecap="round" />
          <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" stroke="var(--mist-100)" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  mist: (
    <>
      {[18, 26, 34, 42].map((y, i) => (
        <line
          key={y}
          x1={12 + (i % 2) * 4} y1={y} x2={52 - (i % 2) * 4} y2={y}
          stroke="var(--mist-400)" strokeWidth="3.5" strokeLinecap="round"
          opacity={0.9 - i * 0.1}
        />
      ))}
    </>
  ),
}

export default function WeatherIcon({ conditionKey, size = 64, className = '' }) {
  const icon = ICONS[conditionKey] || ICONS.clouds
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-hidden="true"
    >
      {icon}
    </svg>
  )
}
