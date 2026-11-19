import { Link } from "react-router-dom";
import Button from '../components/Button';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import VisitedCard from '../components/VisitedCard';
import visitedPlaces from '../data/visitedPlaces';
import './Journeys.css';

export default function Journeys() {
  const lead = visitedPlaces[0];
  return (
    <>
      <PageHero
        eyebrow="My journeys"
        title="Places I’ve explored. Memories I’ll carry."
        image={lead.image}
        position="50% 45%"
        art={lead.art}
        alt={lead.alt}
      >
        Every place offers a different perspective. These are the destinations that are already
        part of my story, and each one has a page of its own.
      </PageHero>

      <section className="journeys section surface-ivory" aria-label="Visited destinations">
        <div className="container">
          <Reveal className="journeys__intro">
            <p className="eyebrow">Visited</p>
            <p className="journeys__lead">
              Open a journey to read about the place and see its photographs. Dream destinations live on a{' '}
              <Link className="inline-link" to="/dream-destinations">separate page</Link>, so the two never get mixed up.
            </p>
          </Reveal>

          <div className="journeys__grid">
            {visitedPlaces.map((place, i) => (
              <VisitedCard key={place.id} place={place} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      <section className="journeys-cta section surface-forest">
        <Reveal className="container journeys-cta__inner">
          <h2>More journeys ahead.</h2>
          <p>The places I have been are only the beginning. See where I want to go next, or find everything on the map.</p>
          <div className="journeys-cta__actions">
            <Button to="/dream-destinations" icon>Explore my travel wishlist</Button>
            <Button to="/travel-map" variant="ghost" icon>Open the travel map</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
