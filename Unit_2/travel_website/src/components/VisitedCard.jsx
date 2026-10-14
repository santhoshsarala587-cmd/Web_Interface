import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import PlacePhoto from './PlacePhoto';
import Reveal from './Reveal';
import './VisitedCard.css';

// Compact "visited" card for the home page and My Story page.
export default function VisitedCard({ place, delay = 0, className = '' }) {
  return (
    <Reveal as="article" delay={delay} className={`visited-card ${className}`}>
      <div className="visited-card__media">
        <PlacePhoto place={place} />
        <span className="tag tag--visited visited-card__status">
          <MapPin size={12} aria-hidden="true" /> {place.status}
        </span>
      </div>
      <div className="visited-card__body">
        <p className="visited-card__region">{place.region}</p>
        <h3 className="visited-card__name">{place.name}</h3>
        <p className="visited-card__text">{place.summary}</p>
        <Link className="visited-card__link" to={`/visited-places#${place.id}`}>
          Read more
          <ArrowUpRight size={18} aria-hidden="true" />
          <span className="visually-hidden"> about {place.name}</span>
        </Link>
      </div>
    </Reveal>
  );
}
