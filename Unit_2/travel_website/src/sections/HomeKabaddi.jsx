import Button from '../components/Button';
import KabaddiExplorer from '../components/KabaddiExplorer';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import './HomeKabaddi.css';

const values = ['Teamwork', 'Strategy', 'Discipline', 'Determination'];

export default function HomeKabaddi() {
  return (
    <section id="kabaddi-preview" className="home-kabaddi section surface-charcoal" aria-labelledby="hk-title">
      <div className="home-kabaddi__grid container">
        <div className="home-kabaddi__text">
          <SectionHeading id="hk-title" eyebrow="My sporting passion" title="When I am not travelling, I play Kabaddi.">
            Travel taught me curiosity. Kabaddi teaches me teamwork, strategy and determination. Different adventures, the same hunger to learn and improve.
          </SectionHeading>
          <Reveal className="home-kabaddi__why" delay={120}>
            <h3>Why I love it</h3>
            <p>
              A raid is a test of nerve, but it is never only about the raider. It works because
              a whole team trusts each other, trains together and keeps showing up.
            </p>
            <ul className="home-kabaddi__values" aria-label="What Kabaddi teaches me">
              {values.map((v) => <li key={v}>{v}</li>)}
            </ul>
            <Button to="/kabaddi" variant="ghost" icon>My Kabaddi story</Button>
          </Reveal>
        </div>

        <Reveal className="home-kabaddi__visual" delay={120}>
          <KabaddiExplorer compact />
        </Reveal>
      </div>
    </section>
  );
}
