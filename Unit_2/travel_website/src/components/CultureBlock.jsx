import { Link } from 'react-router-dom';
import Img from './Img';
import Reveal from './Reveal';
import dreamDestinations from '../data/dreamDestinations';
import './CultureBlock.css';

const nameOf = (id) => dreamDestinations.find((d) => d.id === id);

// One cultural theme. Photo blocks show an image; tone blocks are typographic panels.
export default function CultureBlock({ item, flip = false }) {
  const hasImage = Boolean(item.image);
  const links = item.dreams.map(nameOf).filter(Boolean);

  const text = (
    <Reveal className="cblock__text" delay={100}>
      <p className="cblock__kicker">{item.kicker}</p>
      <h2 className="cblock__title" id={`${item.id}-t`}>{item.title}</h2>
      <p className="cblock__lead">{item.text}</p>
      <p className="cblock__note">{item.note}</p>
      <div className="cblock__links">
        <span>Places that inspire this:</span>
        <ul>
          {links.map((p) => (
            <li key={p.id}><Link to={`/dream-destinations/${p.id}`}>{p.name}</Link></li>
          ))}
        </ul>
      </div>
    </Reveal>
  );

  if (!hasImage) {
    return (
      <section className={`cblock cblock--panel cblock--${item.tone}`} aria-labelledby={`${item.id}-t`}>
        <div className="container cblock__panel-inner">
          <span className="cblock__rings" aria-hidden="true" />
          {text}
        </div>
      </section>
    );
  }

  return (
    <section className={`cblock cblock--photo ${flip ? "cblock--flip" : ""}`} aria-labelledby={`${item.id}-t`}>
      <div className="container cblock__inner">
        <Reveal className={`cblock__media ${item.secondImage ? 'cblock__media--duo' : ''}`}>
          <figure className="cblock__img cblock__img--a wipe">
            <Img src={item.image} alt={item.alt} position={item.position} />
          </figure>
          {item.secondImage && (
            <figure className="cblock__img cblock__img--b wipe">
              <Img src={item.secondImage} alt={item.secondAlt} position={item.secondPosition} />
            </figure>
          )}
        </Reveal>
        {text}
      </div>
    </section>
  );
}
