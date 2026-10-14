import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import PageHero from '../components/PageHero';
import PlacePhoto from '../components/PlacePhoto';
import Reveal from '../components/Reveal';
import dreamDestinations from '../data/dreamDestinations';
import NotFound from './NotFound';
import './DestinationDetail.css';

export default function DestinationDetail() {
  const { id } = useParams();
  const index = dreamDestinations.findIndex((d) => d.id === id);
  if (index === -1) return <NotFound />;

  const place = dreamDestinations[index];
  const prev = dreamDestinations[(index - 1 + dreamDestinations.length) % dreamDestinations.length];
  const next = dreamDestinations[(index + 1) % dreamDestinations.length];
  const related = dreamDestinations
    .filter((d) => d.id !== place.id && d.categories.some((c) => place.categories.includes(c)))
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`Dream destination · ${place.region}`}
        title={place.name}
        image={place.image}
        position={place.position}
        art={place.art}
        alt={place.alt}
        actions={<Link className="detail__back" to="/dream-destinations"><ArrowLeft size={18} aria-hidden="true" /> All dream destinations</Link>}
      >
        {place.summary}
      </PageHero>

      <section className="detail section surface-ivory" aria-label={`About ${place.name}`}>
        <div className="detail__grid container">
          <Reveal className="detail__main">
            <h2 className="detail__heading">About {place.name}</h2>
            <p className="detail__text">{place.description}</p>
            <h3 className="detail__sub">Known for</h3>
            <ul className="detail__chips">
              {place.knownFor.map((k) => <li key={k}>{k}</li>)}
            </ul>
          </Reveal>

          <Reveal as="aside" className="detail__aside" delay={120} aria-label="Destination summary">
            <figure className="detail__figure wipe">
              <PlacePhoto place={place} />
            </figure>
            {place.credit && place.image && (
              <p className="detail__credit">
                Photo by <a href={place.source} target="_blank" rel="noreferrer">{place.credit}</a> on Unsplash
              </p>
            )}
            <dl className="detail__facts">
              <div><dt>Region</dt><dd>{place.region}</dd></div>
              <div><dt>Categories</dt><dd>{place.categories.join(', ')}</dd></div>
              <div><dt>Status</dt><dd><span className="tag tag--dream-light">Dream destination</span> not visited yet</dd></div>
            </dl>
          </Reveal>
        </div>

        <nav className="detail__pager container" aria-label="More destinations">
          <Link to={`/dream-destinations/${prev.id}`}><ArrowLeft size={18} aria-hidden="true" /> {prev.name}</Link>
          <Link to={`/dream-destinations/${next.id}`}>{next.name} <ArrowRight size={18} aria-hidden="true" /></Link>
        </nav>
      </section>

      {related.length > 0 && (
        <section className="detail-related section surface-forest" aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title">More places like this</h2>
            <div className="detail-related__grid">
              {related.map((r, i) => <DestinationCard key={r.id} place={r} size="standard" delay={i * 90} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
