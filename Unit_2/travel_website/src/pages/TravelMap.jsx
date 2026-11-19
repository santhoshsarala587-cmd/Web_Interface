import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import PageHero from '../components/PageHero';
import PlacePhoto from '../components/PlacePhoto';
import Reveal from '../components/Reveal';
import TravelMapView from '../components/TravelMapView';
import dreamDestinations from '../data/dreamDestinations';
import visitedPlaces, { osmLink } from '../data/visitedPlaces';
import { photo } from '../data/photos';
import './TravelMap.css';

const visited = visitedPlaces.map((p) => ({ id: p.id, name: p.name, region: p.region, coords: p.coords, image: p.image, art: p.art, alt: p.alt, position: p.position, href: `/journeys/${p.id}`, kind: 'visited' }));
const dreams = dreamDestinations.map((d) => ({ id: d.id, name: d.name, region: d.region, coords: d.coords, image: d.image, art: d.art, alt: d.alt, position: d.position, href: `/dream-destinations/${d.id}`, kind: 'dream' }));

const views = [
  { id: 'all', label: 'Everything' },
  { id: 'visited', label: 'Visited' },
  { id: 'dream', label: 'Dream destinations' },
];

export default function TravelMap() {
  const [params] = useSearchParams();
  const focus = params.get('focus');
  const [view, setView] = useState('all');

  const points = useMemo(
    () => (view === 'visited' ? visited : view === 'dream' ? dreams : [...visited, ...dreams]),
    [view]
  );
  const focusId = points.some((p) => p.id === focus) ? focus : null;

  return (
    <>
      <PageHero
        eyebrow="Travel map"
        title="Where I’ve been. Where I’m going."
        image={photo('maldives')}
        position="50% 45%"
        alt="Turquoise lagoon around a small tropical island seen from above"
      >
        Orange pins with a tick are places I have visited. Green diamonds with a star are places
        I dream of visiting. Select a marker to see the place.
      </PageHero>

      <section className="tmap section surface-ivory" aria-labelledby="tmap-title">
        <div className="container">
          <h2 id="tmap-title" className="visually-hidden">Interactive map</h2>
          <div className="tmap__bar">
            <ul className="tmap__legend" aria-label="Map legend">
              <li><span className="tmap__pin tmap__pin--visited" aria-hidden="true">✓</span> Visited ({visited.length})</li>
              <li><span className="tmap__pin tmap__pin--dream" aria-hidden="true">★</span> Dream destination ({dreams.length})</li>
            </ul>
            <div className="tmap__views" role="group" aria-label="Choose which places to show">
              {views.map((v) => (
                <button key={v.id} type="button" className={`chip ${view === v.id ? 'is-active' : ''}`} aria-pressed={view === v.id} onClick={() => setView(v.id)}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <TravelMapView points={points} focusId={focusId} />
          <p className="tmap__note">Map data © OpenStreetMap contributors. Click the map once to enable scroll-wheel zoom. Tada’s pin marks the nearby town, so treat it as approximate.</p>
        </div>
      </section>

      <section className="tlist section surface-sand" aria-labelledby="tlist-title">
        <div className="container">
          <h2 id="tlist-title" className="tlist__title">Every pin, as a list.</h2>
          <p className="tlist__lead">The same places in text, with links to open each one in OpenStreetMap.</p>
          <ul className="tlist__grid">
            {points.map((p, i) => (
              <Reveal as="li" key={p.id} delay={(i % 4) * 60} className={`tlist__item tlist__item--${p.kind}`}>
                <div className="tlist__media">
                  <PlacePhoto place={p} />
                  <span className="tag">{p.kind === 'visited' ? 'Visited' : 'Dream'}</span>
                </div>
                <div className="tlist__body">
                  <h3>{p.name}</h3>
                  <p>{p.region}</p>
                  <div>
                    <Link to={p.href}>{p.kind === 'visited' ? 'Read my story' : 'View details'}</Link>
                    <a href={osmLink(p.coords, 6)} target="_blank" rel="noreferrer">Open map <ExternalLink size={13} aria-hidden="true" /></a>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
