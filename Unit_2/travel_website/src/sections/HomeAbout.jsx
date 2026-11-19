import Img from '../components/Img';
import PassionEmblem from '../components/PassionEmblem';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import StatsBand from '../components/StatsBand';
import profile from '../data/profile';
import { photo } from '../data/photos';
import './HomeAbout.css';

export default function HomeAbout() {
  const { portrait, portraitAlt, name, headline, bio, personality, interests } = profile;
  return (
    <section id="about" className="about section surface-ivory" aria-labelledby="about-title">
      <div className="about__grid container">
        <Reveal className="about__art">
          <figure className="about__portrait wipe">
            {portrait ? <Img src={portrait} alt={portraitAlt} position="50% 25%" /> : <PassionEmblem />}
          </figure>
          <figure className="about__small wipe wipe--delay">
            <Img src={photo('munnar-3')} alt="Clouds drifting below a rocky mountain peak at sunrise" position="50% 50%" />
          </figure>
        </Reveal>

        <div className="about__text">
          <SectionHeading id="about-title" eyebrow={name ? `Hello, I am ${name}` : 'A little about me'} title={headline} />
          <Reveal className="about__copy" delay={120}>
            {bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </Reveal>

          <Reveal className="about__lists" delay={160}>
            <div>
              <h3 className="about__label">My personality</h3>
              <ul className="about__traits">
                {personality.map((t) => (
                  <li key={t.trait} title={t.text}>{t.trait}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="about__label">What I love</h3>
              <ul className="about__interests">
                {interests.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container about__stats">
        <StatsBand />
      </div>
    </section>
  );
}
