import PassionPanels from '../components/PassionPanels';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import './HomePassions.css';

export default function HomePassions() {
  return (
    <section id="passions" className="home-passions section surface-charcoal" aria-labelledby="passions-title">
      <div className="container">
        <SectionHeading id="passions-title" eyebrow="What drives me" title="Three passions, one way of seeing the world">
          Each one teaches me something different, and each one makes the others richer.
        </SectionHeading>
        <Reveal className="home-passions__panels" delay={100}>
          <PassionPanels />
        </Reveal>
      </div>
    </section>
  );
}
