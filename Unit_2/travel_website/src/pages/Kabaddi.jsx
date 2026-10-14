import Button from '../components/Button';
import Img from '../components/Img';
import KabaddiCourt from '../components/KabaddiCourt';
import KabaddiVisual from '../components/KabaddiVisual';
import Marquee from '../components/Marquee';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { gallery } from '../data/photos';
import './Kabaddi.css';

const values = [
  { name: 'Teamwork', text: 'A raid is only as strong as the team standing behind it.' },
  { name: 'Agility', text: 'Quick feet and sharper reflexes, on both sides of the midline.' },
  { name: 'Strategy', text: 'Reading the court, the defenders, and the moment.' },
  { name: 'Discipline', text: 'Showing up, training, and staying composed under pressure.' },
  { name: 'Determination', text: 'Giving everything to the next raid, win or lose.' },
];

const raid = [
  { title: 'Cross the line', text: 'The raider steps into the opposing half, which is guarded by a chain of defenders.' },
  { title: 'Hold the breath', text: 'The raider must keep chanting “kabaddi” in a single breath for the whole raid.' },
  { title: 'Tag and escape', text: 'Touching defenders and slipping out of their grasp is how the raid scores.' },
  { title: 'Return home', text: 'Reaching their own half safely completes the raid. Defenders win it by stopping the raider first.' },
];

export default function Kabaddi() {
  const photos = gallery('kabaddi');

  return (
    <>
      <PageHero
        eyebrow="My sporting passion"
        title="Power. Precision. Teamwork."
        tone="charcoal"
        visual={<div className="khero-visual"><KabaddiVisual labels={false} /></div>}
        alt="Kabaddi action"
        actions={<Button href="#why" variant="ghost">Why Kabaddi matters to me</Button>}
      >
        Kabaddi challenges the body and mind. It brings together agility, quick decisions,
        discipline, strategy, and the strength of working as a team.
      </PageHero>

      <section id="why" className="kwhy section surface-ivory" aria-labelledby="why-title">
        <div className="kwhy__grid container">
          <SectionHeading id="why-title" eyebrow="Why Kabaddi matters to me" title="More than a game." />
          <Reveal className="kwhy__copy" delay={120}>
            <p>
              I love playing Kabaddi. It keeps me active, alert, and connected to a team, and it
              asks for something different from every player: courage on the raid, trust in the
              chain, and the discipline to keep improving.
            </p>
            <p>
              What I enjoy most is the challenge of learning and getting better, and the feeling
              of giving everything I have to the next move.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="spirit" className="kspirit section surface-charcoal" aria-labelledby="spirit-title">
        <div className="container">
          <SectionHeading id="spirit-title" eyebrow="The spirit of the game" title="Five things the court teaches." />
          <Reveal as="ul" className="kspirit__list" delay={100}>
            {values.map((v) => (
              <li key={v.name}>
                <span className="kspirit__name">{v.name}</span>
                <span className="kspirit__text">{v.text}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <Marquee tone="orange" words={['Teamwork', 'Agility', 'Strategy', 'Discipline', 'Determination']} />

      <section className="kskill section surface-forest" aria-labelledby="skill-title">
        <div className="kskill__grid container">
          <Reveal className="kskill__court">
            <KabaddiCourt />
          </Reveal>
          <div>
            <SectionHeading id="skill-title" eyebrow="A sport of skill and courage" title="One raid, four moments.">
              Played by two teams of seven, Kabaddi has deep roots in India. It is a contact sport
              built on speed, nerve, and teamwork. Here is the general shape of a raid.
            </SectionHeading>
            <ol className="kskill__steps">
              {raid.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 80}>
                  <span className="kskill__n" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section surface-sand" aria-label="Kabaddi photos">
          <ul className="container gallery">
            {photos.map((src, i) => (
              <li key={src}><Img src={src} alt={`Kabaddi, photo ${i + 1}`} /></li>
            ))}
          </ul>
        </section>
      )}

      <section className="kjourney section surface-sand" aria-labelledby="journey-title">
        <div className="container kjourney__inner">
          <SectionHeading id="journey-title" eyebrow="My passions, one journey" title="Same curiosity. Same determination." />
          <Reveal className="kjourney__copy" delay={120}>
            <p>
              Whether I am standing at the edge of a new place or stepping onto the Kabaddi court,
              I enjoy the challenge of learning, improving, and giving every experience my best.
              The curiosity that pulls me toward new destinations and cultures is the same drive
              that keeps me training.
            </p>
            <div className="kjourney__actions">
              <Button to="/dream-destinations" variant="forest" icon>Dream destinations</Button>
              <Button to="/cultures" variant="outline" icon>Cultural discovery</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
