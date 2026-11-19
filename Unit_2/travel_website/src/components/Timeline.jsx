import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import './Timeline.css';

// Vertical chapter timeline. `when` is optional: nothing is shown for a date unless one is supplied.
export default function Timeline({ entries }) {
  return (
    <ol className="timeline">
      {entries.map((e, i) => (
        <Reveal as="li" key={e.title} delay={(i % 3) * 70} className={`timeline__item ${e.tone ? `timeline__item--${e.tone}` : ''}`}>
          <span className="timeline__dot" aria-hidden="true" />
          {e.when && <p className="timeline__when">{e.when}</p>}
          <h3 className="timeline__title">{e.title}</h3>
          <p className="timeline__text">{e.text}</p>
          {e.to && <Link className="timeline__link" to={e.to}>{e.cta || 'Read more'}</Link>}
        </Reveal>
      ))}
    </ol>
  );
}
