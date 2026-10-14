import { ArrowUp } from 'lucide-react';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import { contact } from '../data/site';
import { photo } from '../data/photos';
import './HomeClosing.css';

export default function HomeClosing() {
  const hasEmail = Boolean(contact.email);

  return (
    <section id="contact" className="closing" aria-labelledby="closing-title">
      <div className="closing__bg" aria-hidden="true" style={{ backgroundImage: `url(${photo('bali')})` }} />
      <div className="closing__shade" aria-hidden="true" />

      <Reveal className="closing__inner container">
        <p className="eyebrow">Let’s share the journey</p>
        <h2 id="closing-title" className="closing__title">
          <span>Stay curious.</span>
          <span>Explore beyond the familiar.</span>
          <span>Learn from every culture.</span>
          <span>Play with passion.</span>
        </h2>
        <p className="closing__copy">
          I am always excited by new places, different cultures, and conversations about the
          things that inspire us.
        </p>

        <div className="closing__actions">
          {hasEmail && <Button href={`mailto:${contact.email}`}>Say hello</Button>}
          {contact.socials.map((s) => (
            <Button key={s.url} href={s.url} variant="ghost" target="_blank" rel="noreferrer">{s.label}</Button>
          ))}
          <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top <ArrowUp size={18} aria-hidden="true" />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
