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
            eyebrow="Places I have visited"
            title="Places that are part of my journey"
          >
            These are destinations I have really been to. Each one is a chapter in my travel story.
          </SectionHeading>
          <Reveal>
            <Button to="/visited-places" variant="outline" icon>My travel journal</Button>
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
