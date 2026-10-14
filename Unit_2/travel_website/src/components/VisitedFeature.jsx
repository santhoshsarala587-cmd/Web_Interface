import { MapPin } from 'lucide-react';
import PlacePhoto from './PlacePhoto';
import Reveal from './Reveal';
import Img from './Img';
import { showPlaceholders } from '../data/site';
import './VisitedFeature.css';

// Editorial feature for one visited place. Alternates sides via `flip`.
export default function VisitedFeature({ place, flip = false }) {
  // The main photo is already shown large, so the gallery only lists the extra ones
  const extras = [
    ...place.gallery.filter((src) => src !== place.image).map((src, i) => ({ src, alt: `${place.name}, photo ${i + 1}` })),
    ...(place.remoteGallery || []),
  ];
  const hasGallery = extras.length > 0;

  return (
    <article id={place.id} className={`vfeature ${flip ? 'vfeature--flip' : ''}`} aria-labelledby={`${place.id}-title`}>
      <Reveal className="vfeature__media">
        <div className="vfeature__frame wipe">
          <PlacePhoto place={place} />
        </div>
        {place.image && place.credit && <p className="vfeature__credit">{place.credit}</p>}
        <span className="tag tag--visited vfeature__status">
          <MapPin size={12} aria-hidden="true" /> {place.status}
        </span>
      </Reveal>

      <Reveal className="vfeature__text" delay={120}>
        <p className="vfeature__region">{place.region}</p>
        <h2 id={`${place.id}-title`} className="vfeature__name">{place.name}</h2>
        {place.about.map((p) => <p key={p} className="vfeature__about">{p}</p>)}

        <ul className="vfeature__chips" aria-label={`${place.name} is known for`}>
          {place.knownFor.map((k) => <li key={k}>{k}</li>)}
        </ul>

        {showPlaceholders && (
          <div className="placeholder" role="note">
            <p className="placeholder__title">Placeholder: my own memories</p>
            <ul>
              {place.placeholders.map((item) => <li key={item}>{item}: <em>to be added</em></li>)}
            </ul>
          </div>
        )}
      </Reveal>

      {(hasGallery || showPlaceholders) && (
        <div className="vfeature__gallery">
          {hasGallery ? (
            <ul className="gallery" aria-label={`${place.name} photo gallery`}>
              {extras.map((item) => (
                <li key={item.src}>
                  <Img src={item.src} alt={item.alt} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="placeholder placeholder--wide" role="note">
              <span className="placeholder__title">Placeholder: photo gallery</span>
              Add photos named <code>{place.id}-1.jpg</code>, <code>{place.id}-2.jpg</code> … to
              <code> src/assets/photos</code> and they will appear here automatically.
            </p>
          )}
        </div>
      )}
    </article>
  );
}
