import Counter from './Counter';
import Reveal from './Reveal';
import visitedPlaces from '../data/visitedPlaces';
import dreamDestinations from '../data/dreamDestinations';
import { cultureThemes } from '../data/cultures';
import passions from '../data/passions';
import './StatsBand.css';

// Every number is counted from the site's own data, so it can never drift from the content.
const stats = [
  { value: visitedPlaces.length, label: 'Places I have visited' },
  { value: dreamDestinations.length, label: 'Dream destinations on my list' },
  { value: cultureThemes.length, label: 'Cultural themes I am exploring' },
  { value: passions.length, label: 'Passions, one way of seeing' },
];

export default function StatsBand({ className = '' }) {
  return (
    <Reveal as="dl" className={`stats ${className}`}>
      {stats.map((s) => (
        <div key={s.label} className="stats__item">
          <dt className="stats__label">{s.label}</dt>
          <dd className="stats__value"><Counter to={s.value} /></dd>
        </div>
      ))}
    </Reveal>
  );
}
