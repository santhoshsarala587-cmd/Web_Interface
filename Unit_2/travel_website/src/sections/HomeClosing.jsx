import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import { allLinks } from '../data/site';
import profile from '../data/profile';
import { photo } from '../data/photos';
import './HomeClosing.css';

const quickLinks = allLinks.filter((l) => l.to !== '/' && l.to !== '/contact');

export default function HomeClosing() {
  const { email, socials } = profile.contact;

  return (
    <section id="contact" className="closing" aria-labelledby="closing-title">
      <div className="closing__bg" aria-hidden="true" style={{ backgroundImage: `url(${photo('bali')})` }} />
      <div className="closing__shade" aria-hidden="true" />

      <Reveal className="closing__inner container">
        <p className="eyebrow">One last thing</p>
        <h2 id="closing-title" className="closing__title">
          <span>There is more to explore,</span>
          <span>more to learn</span>
          <span>and more to experience.</span>
        </h2>
        <p className="closing__copy">
          Thank you for stopping by. Wherever you start, every passion on this site leads somewhere new.
        </p>

        <ul className="closing__links" aria-label="Pages on this site">
          {quickLinks.map((l) => (
            <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
          ))}
        </ul>

        <div className="closing__actions">
          {email && <Button href={`mailto:${email}`}><Mail size={18} aria-hidden="true" /> Say hello</Button>}
          {socials.map((s) => (
            <Button key={s.url} href={s.url} variant="ghost" target="_blank" rel="noreferrer">{s.label}</Button>
          ))}
          <Button to="/contact" variant={email ? 'ghost' : 'primary'} icon>Get in touch</Button>
        </div>
      </Reveal>
    </section>
  );
}
