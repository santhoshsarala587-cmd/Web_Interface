import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import Button from '../components/Button';
import DestinationCard from '../components/DestinationCard';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import dreamDestinations, { categories } from '../data/dreamDestinations';
import { photo } from '../data/photos';
import './DreamDestinations.css';

export default function DreamDestinations() {
  const [active, setActive] = useState('All');
  const shown = active === 'All' ? dreamDestinations : dreamDestinations.filter((d) => d.categories.includes(active));
  const countFor = (cat) => dreamDestinations.filter((d) => d.categories.includes(cat)).length;

  return (
    <>
      <PageHero
        eyebrow="My future adventures"
        title="A world of places still waiting to be discovered."
        image={photo('bali')}
        position="50% 45%"
        alt="Aerial view of a turquoise bay below green coastal cliffs"
      >
        From breathtaking mountain landscapes to historic cities and vibrant cultural
        destinations, these are some of the places that inspire my desire to explore the world.
      </PageHero>

      <section className="dreams section surface-ivory" aria-labelledby="dreams-collection">
        <div className="container">
          <div className="dreams__intro">
            <h2 id="dreams-collection" className="dreams__title">Dream destinations</h2>
            <p>
              None of these are places I have been to yet. They are the ones that keep pulling at my
              curiosity. Places I have actually visited are on my{' '}
              <Link className="dreams__inline" to="/visited-places">travel journal</Link>.
            </p>
          </div>

          <div className="dreams__filters" role="group" aria-label="Filter destinations by category">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${active === cat ? 'is-active' : ''}`}
                aria-pressed={active === cat}
                onClick={() => setActive(cat)}
              >
                {cat}
                <span className="chip__count">{cat === 'All' ? dreamDestinations.length : countFor(cat)}</span>
              </button>
            ))}
            {active !== 'All' && (
              <button type="button" className="dreams__reset" onClick={() => setActive('All')}>
                <RotateCcw size={16} aria-hidden="true" /> Reset
              </button>
            )}
          </div>

          <p className="dreams__count" aria-live="polite">
            Showing {shown.length} of {dreamDestinations.length} destinations
            {active !== 'All' ? ` in ${active}` : ''}
          </p>

          <div className="dreams__grid">
            {shown.map((place, i) => (
              <DestinationCard key={place.id} place={place} size={active === 'All' ? place.size : 'standard'} delay={(i % 3) * 80} />
            ))}
          </div>
        </div>
      </section>

      <section className="dreams-cta section surface-forest">
        <Reveal className="container dreams-cta__inner">
          <h2>Where I have already been.</h2>
          <p>Every dream list starts with a first trip. Read about the places already in my journey.</p>
          <Button to="/visited-places" icon>Places I’ve visited</Button>
        </Reveal>
      </section>
    </>
  );
}
