import Button from '../components/Button';
import KabaddiVisual from '../components/KabaddiVisual';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import './HomeKabaddi.css';

const values = ['Teamwork', 'Strategy', 'Discipline', 'Agility', 'Determination'];

export default function HomeKabaddi() {
  return (
    <section id="kabaddi-preview" className="home-kabaddi section surface-charcoal" aria-labelledby="hk-title">
      <div className="home-kabaddi__grid container">
        <div>
          <SectionHeading
            id="hk-title"
            eyebrow="My sport. My energy."
            title="My sport. My energy. My passion."
          >
            I love playing Kabaddi. It asks for quick thinking, a strong team, and the courage to
            keep going, and that is exactly why it excites me.
          </SectionHeading>

          <Reveal as="ul" className="home-kabaddi__values" delay={100} aria-label="What Kabaddi stands for">
            {values.map((v) => <li key={v}>{v}</li>)}
          </Reveal>

          <Reveal delay={180}>
            <Button to="/kabaddi" icon>Enter the Kabaddi world</Button>
          </Reveal>
        </div>

        <Reveal className="home-kabaddi__visual" delay={120}>
          <KabaddiVisual labels={false} />
        </Reveal>
      </div>
    </section>
  );
}
