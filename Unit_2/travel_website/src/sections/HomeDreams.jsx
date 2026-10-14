import Button from '../components/Button';
import DestinationCard from '../components/DestinationCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import dreamDestinations from '../data/dreamDestinations';
import './HomeDreams.css';

const previewIds = ['kyoto', 'bali', 'himalaya', 'maldives'];
const preview = previewIds.map((id) => dreamDestinations.find((d) => d.id === id));

export default function HomeDreams() {
  return (
    <section id="dreams" className="home-dreams section surface-forest" aria-labelledby="dreams-title">
      <div className="container">
        <SectionHeading
          id="dreams-title"
          eyebrow="My future adventures"
          title="The places I dream of exploring"
        >
          Not visited yet, but high on my list. These are the landscapes and cultures that fuel my curiosity.
        </SectionHeading>

        <div className="home-dreams__grid">
          {preview.map((place, i) => (
            <DestinationCard key={place.id} place={place} size="standard" delay={i * 90} />
          ))}
        </div>

        <Reveal className="home-dreams__cta">
          <Button to="/dream-destinations" icon>See all dream destinations</Button>
        </Reveal>
      </div>
    </section>
  );
}
