import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, RotateCcw, Search, X } from 'lucide-react';
import Button from '../components/Button';
import DestinationCard from '../components/DestinationCard';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { useWishlist } from '../context/WishlistContext';
import dreamDestinations, { categories } from '../data/dreamDestinations';
import { photo } from '../data/photos';
import './DreamDestinations.css';

export default function DreamDestinations() {
  const [params] = useSearchParams();
  const initialCategory = params.get('category');
  const [active, setActive] = useState(
    initialCategory === 'Saved' || categories.includes(initialCategory) ? initialCategory : 'All'
  );
  const [query, setQuery] = useState(params.get('q') || '');
  const { ids, count, clear } = useWishlist();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dreamDestinations.filter((d) => {
      if (active === 'Saved' && !ids.includes(d.id)) return false;
      if (active !== 'All' && active !== 'Saved' && !d.categories.includes(active)) return false;
      if (!q) return true;
      return [d.name, d.region, d.summary, ...d.categories].join(' ').toLowerCase().includes(q);
    });
  }, [active, query, ids]);

  const filtering = active !== 'All' || query.trim() !== '';
  const reset = () => { setActive('All'); setQuery(''); };
  const countFor = (cat) => dreamDestinations.filter((d) => d.categories.includes(cat)).length;

  return (
    <>
      <PageHero
        eyebrow="My future adventures"
        title="A world of places still waiting to be discovered."
        image={photo('bali')}
        position="50% 45%"
        alt="Aerial view of a turquoise bay below green coastal cliffs"
      >
        From mountain landscapes to waterfalls, coastlines and historic cities, these are the places
        that inspire me. Save the ones you love to build your own wishlist.
      </PageHero>

      <section className="dreams section surface-ivory" aria-labelledby="dreams-collection">
        <div className="container">
          <div className="dreams__intro">
            <h2 id="dreams-collection" className="dreams__title">My travel wishlist</h2>
            <p>
              None of these are places I have been to yet. Tap the heart to save a destination. Saved
              places stay on this device, even after you refresh. Places I have actually visited are on{' '}
              <Link className="dreams__inline" to="/journeys">My Journeys</Link>.
            </p>
          </div>

          <div className="dreams__tools">
            <div className="dreams__search">
              <label htmlFor="dream-search" className="visually-hidden">Search destinations</label>
              <Search size={18} aria-hidden="true" />
              <input
                id="dream-search"
                type="search"
                placeholder="Search by place, country or type…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && (
                <button type="button" className="dreams__clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="dreams__filters" role="group" aria-label="Filter destinations by category">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip ${active === cat ? 'is-active' : ''}`}
                  aria-pressed={active === cat}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                  <span className="chip__count">{cat === 'All' ? dreamDestinations.length : countFor(cat)}</span>
                </button>
              ))}
              <button
                type="button"
                className={`chip chip--saved ${active === 'Saved' ? 'is-active' : ''}`}
                aria-pressed={active === 'Saved'}
                onClick={() => setActive('Saved')}
              >
                <Heart size={14} fill={count ? 'currentColor' : 'none'} aria-hidden="true" /> Saved
                <span className="chip__count">{count}</span>
              </button>
              {filtering && (
                <button type="button" className="dreams__reset" onClick={reset}>
                  <RotateCcw size={16} aria-hidden="true" /> Reset
                </button>
              )}
            </div>
          </div>

          <p className="dreams__count" aria-live="polite">
            Showing {filtered.length} of {dreamDestinations.length} destinations
            {active !== 'All' ? ` · ${active}` : ''}{query.trim() ? ` · “${query.trim()}”` : ''}
          </p>

          {filtered.length > 0 ? (
            <div className="dreams__grid">
              {filtered.map((place, i) => (
                <DestinationCard key={place.id} place={place} size={filtering ? 'standard' : place.size} delay={(i % 3) * 80} />
              ))}
            </div>
          ) : (
            <div className="dreams__empty" role="status">
              {active === 'Saved' && !query.trim() ? (
                <>
                  <Heart size={34} aria-hidden="true" />
                  <h3>Your wishlist is empty</h3>
                  <p>Tap the heart on any destination and it will appear here. It stays saved on this device.</p>
                  <Button onClick={reset}>Browse all destinations</Button>
                </>
              ) : (
                <>
                  <Search size={34} aria-hidden="true" />
                  <h3>No destinations match</h3>
                  <p>Try a different word, or clear the filters to see everything.</p>
                  <Button onClick={reset}>Clear search and filters</Button>
                </>
              )}
            </div>
          )}

          {active === 'Saved' && count > 0 && (
            <button type="button" className="dreams__clearall" onClick={clear}>Clear my whole wishlist</button>
          )}
        </div>
      </section>

      <section className="dreams-cta section surface-forest">
        <Reveal className="container dreams-cta__inner">
          <h2>Where I have already been.</h2>
          <p>Every dream list starts with a first trip. Read about the places already in my journey, or see them all on the map.</p>
          <div className="dreams-cta__actions">
            <Button to="/journeys" icon>My journeys</Button>
            <Button to="/travel-map" variant="ghost" icon>Travel map</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
