import PageHero from '../components/PageHero';
import CultureBlock from '../components/CultureBlock';
import Marquee from '../components/Marquee';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import cultures, { greetings } from '../data/cultures';
import { photo } from '../data/photos';
import './Cultures.css';

export default function Cultures() {
  return (
    <>
      <PageHero
        eyebrow="Cultural discovery"
        title="Travel to discover. Learn to understand."
        image={photo('bali-temple')}
        position="50% 45%"
        alt="A tiered Balinese temple shrine beside a misty lake"
      >
        Every culture carries its own traditions, flavors, stories, art, and ways of life.
        Exploring these differences makes every journey more meaningful.
      </PageHero>

      {cultures.map((item, i) => (
        <CultureBlock key={item.id} item={item} flip={i % 2 === 1} />
      ))}

      <Marquee words={['Traditions', 'Flavours', 'Stories', 'Crafts', 'Languages', 'Festivals']} />

      <section className="greetings surface-charcoal section" aria-labelledby="greet-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Language & cultural expression</p>
            <h2 id="greet-title" className="greetings__title">One hello, many voices.</h2>
            <p className="greetings__copy">
              Language carries humour, history, and ways of seeing the world. A simple greeting is
              often the first step into a culture. Here are hellos from some of the places and
              regions on this site.
            </p>
          </Reveal>
          <ul className="greetings__grid">
            {greetings.map((g, i) => (
              <Reveal as="li" key={g.word} delay={i * 70}>
                <span className="greetings__word">{g.word}</span>
                <span className="greetings__lang">{g.language}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

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
