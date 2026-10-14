import Button from '../components/Button';
import Img from '../components/Img';
import KabaddiVisual from '../components/KabaddiVisual';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import VisitedCard from '../components/VisitedCard';
import visitedPlaces from '../data/visitedPlaces';
import { photo } from '../data/photos';
import { showPlaceholders } from '../data/site';
import './MyStory.css';

const themes = [
  {
    id: 'places',
    kicker: 'Exploring unfamiliar places',
    title: 'The thrill of somewhere new',
    text: 'I am drawn to the moment of arriving somewhere unfamiliar: new landscapes, new air, new roads. Exploring makes me curious about everything beyond what I already know.',
    image: photo('maldives'),
    alt: 'A small tropical island ringed by white sand in a turquoise lagoon',
    position: '50% 40%',
    cta: { to: '/dream-destinations', label: 'Dream destinations' },
  },
  {
    id: 'people',
    kicker: 'Understanding people and cultures',
    title: 'Learning how others live',
    text: 'Travel is more than reaching a destination. It is understanding traditions, food, architecture, and everyday life, and seeing the world from different perspectives.',
    image: photo('kyoto'),
    alt: 'Two people walking down a historic lane in Kyoto at dusk',
    position: '62% 50%',
    cta: { to: '/cultures', label: 'Cultural discovery' },
  },
  {
    id: 'play',
    kicker: 'Playing Kabaddi',
    title: 'Teamwork, strategy, determination',
    text: 'On the Kabaddi court I enjoy the challenge of learning, improving, and working with a team. It keeps me active, and it teaches me something every time.',
    visual: true,
    cta: { to: '/kabaddi', label: 'My sport' },
  },
];

export default function MyStory() {
  return (
    <>
      <PageHero
        eyebrow="My story"
        title="A journey shaped by curiosity and passion."
        image={photo('fuji')}
        position="50% 35%"
        alt="Snow-capped Mount Fuji above a pagoda and town"
      >
        Exploring places, understanding cultures, and playing Kabaddi: three passions, one way of
        looking at the world.
      </PageHero>

      <section className="story section surface-ivory" aria-label="My three passions">
        <div className="container">
          {themes.map((t, i) => (
            <article key={t.id} className={`story__row ${i % 2 ? 'story__row--flip' : ''}`}>
              <Reveal className="story__media">
                <div className="story__frame wipe">
                  {t.visual ? <KabaddiVisual labels={false} /> : <Img src={t.image} alt={t.alt} position={t.position} />}
                </div>
              </Reveal>
              <Reveal className="story__text" delay={120}>
                <p className="story__kicker">{t.kicker}</p>
                <h2 className="story__title">{t.title}</h2>
                <p>{t.text}</p>
                <Button to={t.cta.to} variant="outline" icon>{t.cta.label}</Button>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <section id="travelled" className="mystory-travel section surface-sand" aria-labelledby="travel-title">
        <div className="container">
          <SectionHeading id="travel-title" eyebrow="My travel so far" title="Where my journey has already taken me">
            I have travelled to Munnar in Kerala and to Tada Falls in Andhra Pradesh. These are real chapters of my story.
          </SectionHeading>

          <div className="mystory-travel__grid">
            {visitedPlaces.map((p, i) => <VisitedCard key={p.id} place={p} delay={i * 100} />)}
          </div>

          {showPlaceholders && (
            <Reveal className="mystory-key" delay={100}>
              <h3>What is real, and what is still to be written</h3>
              <div className="mystory-key__cols">
                <div>
                  <p className="mystory-key__label">Supplied facts</p>
                  <ul>
                    <li>I have visited Munnar, Kerala.</li>
                    <li>I have visited Tada Falls, Andhra Pradesh.</li>
                    <li>I love exploring places, learning cultures, and playing Kabaddi.</li>
                  </ul>
                </div>
                <div className="mystory-key__ph">
                  <p className="mystory-key__label">Placeholders to fill in</p>
                  <ul>
                    <li>Travel dates and trip details</li>
                    <li>My own photographs</li>
                    <li>Memories and personal reflections</li>
                    <li>My Kabaddi journey: how I started, my team</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="mystory-cta section surface-forest">
        <Reveal className="container mystory-cta__inner">
          <h2>Live curious. Learn always. Play with passion.</h2>
          <div className="mystory-cta__actions">
            <Button to="/visited-places" icon>My travel journal</Button>
            <Button to="/dream-destinations" variant="ghost" icon>Dream destinations</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
