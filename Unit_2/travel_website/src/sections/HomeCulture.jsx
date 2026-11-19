import Button from '../components/Button';
import CultureExplorer from '../components/CultureExplorer';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import './HomeCulture.css';

export default function HomeCulture() {
  return (
    <section id="culture" className="home-culture section surface-ivory" aria-labelledby="culture-title">
      <div className="container">
        <div className="home-culture__top">
          <SectionHeading id="culture-title" eyebrow="Beyond the landscape" title="Understanding how the world lives">
            Places are only half the story. I am drawn to the traditions, food, festivals, buildings, languages and clothing that make each culture what it is. Pick a theme to explore.
          </SectionHeading>
          <Reveal>
            <Button to="/cultures" variant="outline" icon>Cultural exploration</Button>
          </Reveal>
        </div>
        <Reveal delay={100} className="home-culture__explorer">
          <CultureExplorer />
        </Reveal>
        <p className="home-culture__note">These are cultures I am learning about. Places linked here are on my dream list, not trips I have taken.</p>
      </div>
    </section>
  );
}
