import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import Button from '../components/Button';
import Img from '../components/Img';
import Lightbox from '../components/Lightbox';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import visitedPlaces, { osmLink } from '../data/visitedPlaces';
import NotFound from './NotFound';
import './JourneyDetail.css';

export default function JourneyDetail() {
  const { id } = useParams();
  const [open, setOpen] = useState(null);
  const index = visitedPlaces.findIndex((p) => p.id === id);
  if (index === -1) return <NotFound />;

  const place = visitedPlaces[index];
  const next = visitedPlaces[(index + 1) % visitedPlaces.length];
  const photos = [
    ...(place.image ? [{ src: place.image, alt: place.alt, caption: place.name }] : []),
    ...place.gallery.filter((g) => g.src !== place.image),
  ].map((g) => ({ ...g, label: place.ownPhotos ? 'My photo' : 'Stock photo' }));
  const extra = photos.slice(1);

  return (
    <>
      <PageHero
        eyebrow={`My journeys: ${place.region}`}
        title={place.name}
        image={place.image}
        position={place.position}
        art={place.art}
        alt={place.alt}
        actions={<Link className="jd__back" to="/journeys"><ArrowLeft size={18} aria-hidden="true" /> All journeys</Link>}
      >
        {place.summary}
      </PageHero>

      <section className="jd-intro section surface-ivory" aria-labelledby="jd-intro-title">
        <div className="jd-intro__grid container">
          <Reveal>
            <p className="eyebrow">Personal introduction</p>
            <h2 id="jd-intro-title" className="jd-intro__title">{place.name}, in a few words.</h2>
            <p className="jd-intro__lead">{place.intro}</p>
          </Reveal>

          <Reveal as="aside" delay={120} className="jd-facts" aria-label="Location information">
            <dl>
              <div><dt>Location</dt><dd>{place.region}</dd></div>
              {place.date && <div><dt>When</dt><dd>{place.date}</dd></div>}
              {place.travelledWith && <div><dt>With</dt><dd>{place.travelledWith}</dd></div>}
              <div><dt>Status</dt><dd><span className="tag tag--visited"><MapPin size={12} aria-hidden="true" /> {place.status}</span></dd></div>
              <div><dt>Map</dt><dd>
                <a href={osmLink(place.coords)} target="_blank" rel="noreferrer">View on OpenStreetMap <ExternalLink size={14} aria-hidden="true" /></a>
                <Link className="jd-facts__map" to={`/travel-map?focus=${place.id}`}>Show on my travel map</Link>
              </dd></div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="jd-story section surface-sand" aria-labelledby="jd-story-title">
        <div className="jd-story__grid container">
          <Reveal className="jd-story__text">
            <p className="eyebrow">Travel story</p>
            <h2 id="jd-story-title" className="jd-story__title">The story of {place.name}.</h2>
            {place.story.map((p) => <p key={p}>{p}</p>)}
          </Reveal>
          {photos[0] && (
            <Reveal className="jd-story__media" delay={120}>
              <button type="button" className="jd-story__photo wipe" onClick={() => setOpen(0)} aria-label={`Open photo: ${photos[0].caption}`}>
                <Img src={photos[0].src} alt={photos[0].alt} position={place.position} />
              </button>
            </Reveal>
          )}
        </div>
      </section>

      <section className="jd-high section surface-forest" aria-labelledby="jd-high-title">
        <div className="container">
          <SectionHeading id="jd-high-title" eyebrow="Highlights" title={`What ${place.name} is known for`} />
          <ul className="jd-high__grid">
            {place.highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={i * 80}>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="jd-gallery section surface-ivory" aria-labelledby="jd-gal-title">
        <div className="container">
          <SectionHeading id="jd-gal-title" eyebrow="Photo gallery" title={`${place.name} in pictures`}>
            {place.ownPhotos
              ? 'Photographs from my own trip.'
              : 'Stock photographs of the destination, not pictures I took myself.'}
          </SectionHeading>
          {extra.length > 0 ? (
            <ul className="jd-gallery__grid">
              {extra.map((g, i) => (
                <Reveal as="li" key={g.src} delay={(i % 3) * 70}>
                  <button type="button" onClick={() => setOpen(i + 1)} aria-label={`Open photo: ${g.caption}`}>
                    <Img src={g.src} alt={g.alt} />
                    <span>{g.caption}</span>
                  </button>
                </Reveal>
              ))}
            </ul>
          ) : null}
          {place.credit && <p className="jd-credit">{place.credit}</p>}
        </div>
      </section>

      {place.reflection && place.reflection.text && (
        <section className="jd-reflect section surface-sand" aria-labelledby="jd-ref-title">
          <Reveal className="container jd-reflect__inner">
            <p className="eyebrow">Personal reflections</p>
            <h2 id="jd-ref-title" className="visually-hidden">Reflections on {place.name}</h2>
            <blockquote>{place.reflection.text}</blockquote>
          </Reveal>
        </section>
      )}

      <nav className="jd-pager container" aria-label="More journeys">
        <Link to="/journeys"><ArrowLeft size={18} aria-hidden="true" /> All journeys</Link>
        {next.id !== place.id && <Link to={`/journeys/${next.id}`}>{next.name} <ArrowRight size={18} aria-hidden="true" /></Link>}
        <Button to="/dream-destinations" variant="forest" icon>My dream destinations</Button>
      </nav>

      {open != null && <Lightbox items={photos} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  );
}
