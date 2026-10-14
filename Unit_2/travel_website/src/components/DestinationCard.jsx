import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PlacePhoto from './PlacePhoto';
import Reveal from './Reveal';
import './DestinationCard.css';

// Dream destination card. Text sits over the image; the whole card is one link to the details page.
export default function DestinationCard({ place, delay = 0, size = place.size }) {
  return (
    <Reveal as="article" delay={delay} className={`dest dest--${size}`}>
      <div className="dest__media">
        <PlacePhoto place={place} />
      </div>
      <div className="dest__shade" />
      <div className="dest__top">
        <span className="tag">{place.categories[0]}</span>
        <span className="tag tag--dream">Dream destination</span>
      </div>
      <div className="dest__body">
        <p className="dest__region">{place.region}</p>
        <h3 className="dest__name">{place.name}</h3>
        <p className="dest__text">{place.summary}</p>
        <Link className="dest__link" to={`/dream-destinations/${place.id}`}>
          View details
          <ArrowUpRight size={18} aria-hidden="true" />
          <span className="visually-hidden"> about {place.name}</span>
        </Link>
      </div>
    </Reveal>
  );
}
