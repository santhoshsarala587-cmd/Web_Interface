import { useState } from 'react';
import Button from '../components/Button';
import Img from '../components/Img';
import KabaddiExplorer from '../components/KabaddiExplorer';
import Lightbox from '../components/Lightbox';
import KabaddiVisual from '../components/KabaddiVisual';
import Marquee from '../components/Marquee';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import Timeline from '../components/Timeline';
import { gallery } from '../data/photos';
import profile from '../data/profile';
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
  const [open, setOpen] = useState(null);
  const shots = photos.map((src, i) => ({ src, alt: `Kabaddi, photo ${i + 1}`, caption: `Kabaddi, photo ${i + 1}`, label: 'My photo' }));
  const { role, team, since, achievements, journey } = profile.kabaddi;
  const facts = [role, team, since].filter(Boolean);

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
            {facts.length > 0 && <p className="kwhy__facts">{facts.join(' · ')}</p>}
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
            <KabaddiExplorer />
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

      {(achievements.length > 0 || journey.length > 0) && (
        <section className="kmine section surface-ivory" aria-labelledby="mine-title">
          <div className="container">
            <SectionHeading id="mine-title" eyebrow="My sporting journey" title="On the court so far" />
            {journey.length > 0 && <Timeline entries={journey} />}
            {achievements.length > 0 && (
              <ul className="kmine__awards" aria-label="Achievements">
                {achievements.map((a) => (
                  <Reveal as="li" key={a.title}>
                    <h3>{a.title}</h3>
                    {a.text && <p>{a.text}</p>}
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="kphotos section surface-sand" aria-labelledby="kphotos-title">
          <div className="container">
            <SectionHeading id="kphotos-title" eyebrow="On and off the court" title="Kabaddi in pictures" />
            <ul className="kphotos__grid">
              {shots.map((g, i) => (
                <li key={g.src}>
                  <button type="button" onClick={() => setOpen(i)} aria-label={`View larger: ${g.caption}`}>
                    <Img src={g.src} alt={g.alt} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
      {open != null && <Lightbox items={shots} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  );
}
