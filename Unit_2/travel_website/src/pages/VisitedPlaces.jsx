import { Link } from 'react-router-dom';
import Button from '../components/Button';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import VisitedFeature from '../components/VisitedFeature';
import visitedPlaces from '../data/visitedPlaces';
import { photo } from '../data/photos';
import './VisitedPlaces.css';

export default function VisitedPlaces() {
  const lead = visitedPlaces[0];

  return (
    <>
      <PageHero
        eyebrow="My travel journal"
        title="Places I’ve explored. Memories I’ll carry."
        image={photo('munnar-1') || lead.image}
        art={lead.art}
        alt={lead.alt}
      >
        Every place offers a different perspective. Here are some of the destinations that are
        already part of my journey.
      </PageHero>

      <section className="visited-intro surface-ivory" aria-label="How to read this page">
        <div className="container visited-intro__inner">
          <p><span className="tag tag--visited">Visited</span> Places I have really been to. These are real parts of my journey.</p>
          <p><span className="tag tag--dream-light">Dream</span> Places I hope to see one day. They live on the <Link className="inline-link" to="/dream-destinations">Dream Destinations page</Link>.</p>
        </div>
      </section>

      <section className="section surface-ivory visited-features" aria-label="Visited destinations">
        <div className="container">
          {visitedPlaces.map((place, i) => (
            <VisitedFeature key={place.id} place={place} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      <section className="visited-cta section surface-forest">
        <Reveal className="container visited-cta__inner">
          <h2>More journeys ahead.</h2>
          <p>The list of places I have been to is only the beginning. See where I want to go next.</p>
          <Button to="/dream-destinations" icon>Explore my dream destinations</Button>
        </Reveal>
      </section>
    </>
  );
}
