import Button from '../components/Button';
import Img from '../components/Img';
import PageHero from '../components/PageHero';
import PassionEmblem from '../components/PassionEmblem';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import StatsBand from '../components/StatsBand';
import Timeline from '../components/Timeline';
import VisitedCard from '../components/VisitedCard';
import visitedPlaces from '../data/visitedPlaces';
import profile from '../data/profile';
import { photo } from '../data/photos';
import './MyStory.css';

// Chapters built from facts the site already knows. Add your own (with dates) in src/data/profile.js.
const chapters = [
  { title: 'It starts with curiosity', text: 'I want to know what is over the next hill, and how the people on the other side of it live.', tone: 'culture' },
  { title: 'Munnar, Kerala', text: 'A hill station of tea terraces, cool mist and layered green ridges in the Western Ghats.', tone: 'travel', to: '/journeys/munnar', cta: 'Read the journey' },
  { title: 'Tada Falls, Andhra Pradesh', text: 'A forest trail beside a stream that ends at a waterfall of roughly 100 metres.', tone: 'travel', to: '/journeys/tada', cta: 'Read the journey' },
  { title: 'Learning how others live', text: 'Food, festivals, languages, clothing and old buildings: every culture is a new way of seeing.', tone: 'culture', to: '/cultures', cta: 'Explore cultures' },
  { title: 'Playing Kabaddi', text: 'Teamwork, strategy, discipline and determination, one raid at a time.', tone: 'kabaddi', to: '/kabaddi', cta: 'My Kabaddi story' },
  { title: 'Next: the dream list', text: 'Ladakh, the Swiss Alps, Kyoto, Bali and more are waiting on the wishlist.', tone: 'travel', to: '/dream-destinations', cta: 'See the wishlist' },
];

export default function MyStory() {
  const { name, portrait, portraitAlt, headline, bio, personality, kabaddi, timeline } = profile;
  const extra = [
    ...kabaddi.journey.map((e) => ({ ...e, tone: 'kabaddi' })),
    ...timeline,
  ];
  const entries = [...chapters, ...extra];
  const facts = [kabaddi.role, kabaddi.team, kabaddi.since].filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="My story"
        title="A journey shaped by curiosity and passion."
        image={photo('munnar-1')}
        position="50% 45%"
        alt="Sunrise glowing over layered green ridges above Munnar"
      >
        Exploring places, understanding cultures and playing Kabaddi: three passions, one way of
        looking at the world.
      </PageHero>

      <section className="mystory-about section surface-ivory" aria-labelledby="ms-about-title">
        <div className="mystory-about__grid container">
          <Reveal className="mystory-about__media">
            <figure className="mystory-about__portrait wipe">
              {portrait ? <Img src={portrait} alt={portraitAlt} position="50% 25%" /> : <PassionEmblem />}
            </figure>
          </Reveal>
          <div>
            <SectionHeading id="ms-about-title" eyebrow={name ? `About ${name}` : 'About me'} title={headline} />
            <Reveal className="mystory-about__copy" delay={120}>
              {bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              {facts.length > 0 && <p className="mystory-about__facts">{facts.join(' · ')}</p>}
            </Reveal>
          </div>
        </div>

        <div className="container mystory-about__traits">
          <ul className="traits">
            {personality.map((t, i) => (
              <Reveal as="li" key={t.trait} delay={i * 60}>
                <h3>{t.trait}</h3>
                <p>{t.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mystory-numbers section surface-forest" aria-label="My journey in numbers">
        <div className="container"><StatsBand /></div>
      </section>

      <section className="mystory-timeline section surface-sand" aria-labelledby="ms-timeline-title">
        <div className="container">
          <SectionHeading id="ms-timeline-title" eyebrow="My journey so far" title="The chapters so far">
            Not a strict calendar, more a map of how my interests fit together and where they lead.
          </SectionHeading>
          <Timeline entries={entries} />
        </div>
      </section>

      <section id="travelled" className="mystory-travel section surface-ivory" aria-labelledby="travel-title">
        <div className="container">
          <SectionHeading id="travel-title" eyebrow="My travel so far" title="Where my journey has already taken me">
            I have travelled to Munnar in Kerala and to Tada Falls in Andhra Pradesh. Open a journey to read the story and see the photographs.
          </SectionHeading>
          <div className="mystory-travel__grid">
            {visitedPlaces.map((p, i) => <VisitedCard key={p.id} place={p} delay={i * 100} />)}
          </div>
        </div>
      </section>

      <section className="mystory-cta section surface-forest">
        <Reveal className="container mystory-cta__inner">
          <h2>Live curious. Learn always. Play with passion.</h2>
          <div className="mystory-cta__actions">
            <Button to="/passions" icon>My passions</Button>
            <Button to="/contact" variant="ghost" icon>Get in touch</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
