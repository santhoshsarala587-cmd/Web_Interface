import Reveal from './Reveal';
import './SectionHeading.css';

export default function SectionHeading({ id, eyebrow, title, children, className = '' }) {
  const words = title.split(' ');
  return (
    <Reveal as="header" className={`section-heading ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="section-heading__title">
        {words.map((w, i) => (
          <span key={`${w}-${i}`}>
            <span className="word" style={{ '--w': i }}><span>{w}</span></span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h2>
      {children && <p className="section-heading__copy">{children}</p>}
    </Reveal>
  );
}
