import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Img from '../components/Img';
import KabaddiVisual from '../components/KabaddiVisual';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { photo } from '../data/photos';
import './HomePassions.css';

const CTA = ({ to, children }) => (
  <Link className="passion__cta" to={to}>
    {children}
    <ArrowUpRight size={18} aria-hidden="true" />
  </Link>
);

export default function HomePassions() {
  return (
    <section id="passions" className="passions section surface-forest" aria-labelledby="passions-title">
      <div className="container">
        <SectionHeading
          id="passions-title"
          eyebrow="What drives me"
          title="Three passions. One adventurous spirit."
        />

        <div className="passions__grid">
          <Reveal as="article" className="passion passion--explore">
            <Img src={photo('maldives')} alt="A small tropical island ringed by white sand in a turquoise lagoon" position="50% 40%" />
            <div className="passion__shade" />
            <div className="passion__body">
              <p className="passion__label">Exploring the world</p>
              <h3 className="passion__title">New places, wide horizons</h3>
              <p>
                I love exploring new places, discovering beautiful landscapes, and feeling the
                excitement of adventure.
              </p>
              <CTA to="/dream-destinations">Dream destinations</CTA>
            </div>
          </Reveal>

          <Reveal as="article" className="passion passion--culture" delay={120}>
            <div className="passion__thumb">
              <Img src={photo('kyoto')} alt="Two people in kimono walking a historic lane in Kyoto" position="64% 50%" />
            </div>
            <div className="passion__body">
              <p className="passion__label">Learning cultures</p>
              <h3 className="passion__title">Beyond the destination</h3>
              <p>
                Traditions, food, architecture, and festivals show how people live, and travel
                lets me see the world from different perspectives.
              </p>
              <CTA to="/cultures">Discover cultures</CTA>
            </div>
          </Reveal>

          <Reveal as="article" className="passion passion--sport" delay={240}>
            <div className="passion__court" aria-hidden="true">
              <KabaddiVisual labels={false} />
            </div>
            <div className="passion__body">
              <p className="passion__label">Playing Kabaddi</p>
              <h3 className="passion__title">Power. Strategy. Teamwork.</h3>
              <p>
                Speed, strategy, discipline, and determination come together on the court.
              </p>
              <CTA to="/kabaddi">My sport</CTA>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
