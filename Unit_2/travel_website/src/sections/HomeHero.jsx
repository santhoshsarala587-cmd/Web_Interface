import { useRef } from 'react';
import Img from '../components/Img';
import useParallax from '../hooks/useParallax';
import Button from '../components/Button';
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
        src={photo('himalaya')}
        alt="Snow-covered Himalayan peaks under streaks of cloud and a deep blue sky"
        position="50% 35%"
        eager
      />
      </div>
      <div className="hero__shade" />

      <div className="hero__inner container">
        <h1 id="hero-title" className="hero__title">
          <span style={{ '--i': 1 }}>My world.</span>
          <span style={{ '--i': 2 }}>My journey.</span>
          <span style={{ '--i': 3 }}>My passions.</span>
        </h1>
        <p className="hero__tagline" style={{ '--i': 4 }}>
          Explore new places. Discover different cultures. Play with passion.
        </p>
        <p className="hero__lead" style={{ '--i': 5 }}>
          Every destination has a story, every culture has something to teach, and every game
          brings a new challenge. This is my journey through the experiences and passions that
          inspire me.
        </p>
        <div className="hero__actions" style={{ '--i': 6 }}>
          <Button to="/visited-places">Explore my journey</Button>
          <Button to="/dream-destinations" variant="ghost">View my dream destinations</Button>
        </div>
      </div>

      <a className="hero__scroll" href="#intro" aria-label="Scroll down to the introduction">
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
