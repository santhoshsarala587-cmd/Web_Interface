import PageHero from '../components/PageHero';
import CultureBlock from '../components/CultureBlock';
import CultureExplorer from '../components/CultureExplorer';
import Marquee from '../components/Marquee';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import cultures from '../data/cultures';
import { photo } from '../data/photos';
import './Cultures.css';

export default function Cultures() {
  return (
    <>
      <PageHero
        eyebrow="Cultural exploration"
        title="Travel to discover. Learn to understand."
        image={photo('bali-temple')}
        position="50% 45%"
        alt="A tiered Balinese temple shrine beside a misty lake"
      >
        Every culture carries its own traditions, flavours, stories, art and ways of life.
        Exploring these differences makes every journey more meaningful.
      </PageHero>

      <section id="explore" className="cultures-explore section surface-sand" aria-labelledby="cx-title">
        <div className="container">
          <SectionHeading id="cx-title" eyebrow="Seven ways in" title="Explore by theme">
            Traditions, food, festivals, architecture, languages, clothing and historical places. These are things I am learning about; places marked as “on my list” are dreams, not trips I have taken.
          </SectionHeading>
          <Reveal delay={100} className="cultures-explore__tabs">
            <CultureExplorer />
          </Reveal>
        </div>
      </section>

      {cultures.map((item, i) => (
        <CultureBlock key={item.id} item={item} flip={i % 2 === 1} />
      ))}

      <Marquee words={['Traditions', 'Flavours', 'Festivals', 'Architecture', 'Languages', 'Clothing', 'History']} />

      <section className="section surface-forest cultures-cta">
        <Reveal className="container cultures-cta__inner">
          <h2>Culture starts with a place.</h2>
          <p>Follow the stories to the destinations that inspire them.</p>
          <Button to="/dream-destinations" icon>Explore dream destinations</Button>
        </Reveal>
      </section>
    </>
  );
}
