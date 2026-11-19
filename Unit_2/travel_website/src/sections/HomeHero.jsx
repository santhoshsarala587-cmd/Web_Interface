import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Img from '../components/Img';
import useParallax from '../hooks/useParallax';
import Button from '../components/Button';
import passions from '../data/passions';
import { photo } from '../data/photos';
import './HomeHero.css';

export default function HomeHero() {
  const bg = useRef(null);
  useParallax(bg, 0.3);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__parallax" ref={bg}>
        <Img
          className="hero__bg"
          src={photo('munnar-1') || photo('himalaya')}
          alt="Sunrise glowing over layered green mountain ridges and tea plantations"
          position="50% 45%"
          eager
        />
      </div>
      <div className="hero__shade" />

      <div className="hero__inner container">
        <h1 id="hero-title" className="hero__title">
          <span style={{ '--i': 1 }}>A life full of</span>
          <span style={{ '--i': 2 }}>curiosity, adventure</span>
          <span style={{ '--i': 3 }}>&amp; passion.</span>
        </h1>
        <p className="hero__lead hero__lead--story" style={{ '--i': 4 }}>
          I love discovering new places, exploring different cultures and playing Kabaddi.
          Every passion gives me a different way to experience life.
        </p>
        <div className="hero__actions" style={{ '--i': 5 }}>
          <Button to="/my-story">Discover My Story</Button>
          <Button to="/#passions" variant="ghost">Explore My Passions</Button>
        </div>

        <ul className="hero__passions" style={{ '--i': 6 }} aria-label="My three passions">
          {passions.map((p) => (
            <li key={p.id}>
              <Link to={p.anchor}>{p.short}</Link>
            </li>
          ))}
        </ul>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll down to the introduction">
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
