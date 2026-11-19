import Button from '../components/Button';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import VisitedCard from '../components/VisitedCard';
import visitedPlaces from '../data/visitedPlaces';
import './HomeVisited.css';

export default function HomeVisited() {
  return (
    <section id="visited" className="home-visited section surface-sand" aria-labelledby="visited-title">
      <div className="container">
        <div className="home-visited__top">
          <SectionHeading
            id="visited-title"
            eyebrow="Where I have been"
            title="Places that are part of my journey"
          >
            Two places I have really been to. Open a journey for the story, the photographs and what makes each place worth the trip. Places I only dream of visiting are kept separate, just below.
          </SectionHeading>
          <Reveal>
            <Button to="/journeys" variant="outline" icon>All my journeys</Button>
          </Reveal>
        </div>

        <div className="home-visited__grid">
          {visitedPlaces.map((place, i) => (
            <VisitedCard key={place.id} place={place} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
