import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../components/Button';
import DestinationCard from '../components/DestinationCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { useWishlist } from '../context/WishlistContext';
import dreamDestinations, { categories } from '../data/dreamDestinations';
import './HomeDreams.css';

const previewIds = ['ladakh', 'swiss-alps', 'bali', 'meghalaya'];
const preview = previewIds.map((id) => dreamDestinations.find((d) => d.id === id)).filter(Boolean);

export default function HomeDreams() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { count } = useWishlist();

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/dream-destinations?q=${encodeURIComponent(q)}` : '/dream-destinations');
  };

  return (
    <section id="dreams" className="home-dreams section surface-forest" aria-labelledby="dreams-title">
      <div className="container">
        <SectionHeading
          id="dreams-title"
          eyebrow="Not visited yet"
          title="The places I dream of exploring"
        >
          None of these are trips I have taken. They are the places I would love to reach one day. Tap the heart to save the ones that call to you.
        </SectionHeading>

        <Reveal className="home-dreams__tools" delay={100}>
          <form className="home-dreams__search" role="search" onSubmit={search}>
            <label htmlFor="home-dream-search" className="visually-hidden">Search dream destinations</label>
            <Search size={18} aria-hidden="true" />
            <input
              id="home-dream-search"
              type="search"
              placeholder="Search by place, country or type…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="home-dreams__go">Search</button>
          </form>
          <ul className="home-dreams__chips" aria-label="Browse by category">
            {categories.map((c) => (
              <li key={c}>
                <Button to={`/dream-destinations?category=${encodeURIComponent(c)}`} variant="ghost">{c}</Button>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="home-dreams__grid">
          {preview.map((place, i) => (
            <DestinationCard key={place.id} place={place} size="standard" delay={i * 90} />
          ))}
        </div>

        <Reveal className="home-dreams__cta">
          <Button to="/dream-destinations" icon>Explore my travel wishlist</Button>
          {count > 0 && (
            <Button to="/dream-destinations?category=Saved" variant="ghost">
              {count} saved {count === 1 ? 'place' : 'places'}
            </Button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
