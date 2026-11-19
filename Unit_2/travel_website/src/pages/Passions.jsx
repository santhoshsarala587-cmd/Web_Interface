import Button from '../components/Button';
import Img from '../components/Img';
import KabaddiVisual from '../components/KabaddiVisual';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import passions from '../data/passions';
import { photo } from '../data/photos';
import './Passions.css';

export default function Passions() {
  return (
    <>
      <PageHero
        eyebrow="My passions"
        title="Three passions. One way of seeing the world."
        image={photo('fuji')}
        position="50% 35%"
        alt="Snow-capped Mount Fuji above a pagoda and town"
      >
        Travel gives me places, culture gives me meaning, and Kabaddi gives me discipline and
        teamwork. Together they shape how I look at everything.
      </PageHero>

      <section className="passions section surface-ivory" aria-label="My three passions">
        <div className="container">
          {passions.map((p, i) => (
            <article key={p.id} id={p.id} className={`passion ${i % 2 ? 'passion--flip' : ''}`} aria-labelledby={`${p.id}-title`}>
              <Reveal className="passion__media">
                <div className="passion__frame wipe">
                  {p.visual ? <KabaddiVisual labels={false} /> : <Img src={p.image} alt={p.alt} position={p.position} />}
                </div>
              </Reveal>
              <Reveal className="passion__text" delay={120}>
                <h2 id={`${p.id}-title`} className="passion__title">{p.title}</h2>
                <p className="passion__lead">{p.text}</p>
                <h3 className="passion__label">What I love</h3>
                <ul className="passion__loves">
                  {p.loves.map((l) => <li key={l}>{l}</li>)}
                </ul>
                <Button to={p.to} variant="outline" icon>{p.cta}</Button>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <section className="passions-cta section surface-forest">
        <Reveal className="container passions-cta__inner">
          <h2>Live curious. Learn always. Play with passion.</h2>
          <div className="passions-cta__actions">
            <Button to="/my-story" icon>Read my story</Button>
            <Button to="/gallery" variant="ghost" icon>See the gallery</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
