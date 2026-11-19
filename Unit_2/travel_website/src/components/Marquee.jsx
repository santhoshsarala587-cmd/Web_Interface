import './Marquee.css';

// Endless scrolling word band. Static (and still readable) with reduced motion.
export default function Marquee({ words, tone = 'charcoal', label }) {
  const row = (suffix) => (
    <ul className="marquee__row" aria-hidden={suffix ? 'true' : undefined} key={suffix}>
      {words.map((w) => (
        <li key={w + suffix}>
          <span>{w}</span>
          <i aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee marquee--${tone}`} role="group" aria-label={label || words.join(', ')}>
      <div className="marquee__track">
        {row('')}
        {row('-copy')}
      </div>
    </div>
  );
}
