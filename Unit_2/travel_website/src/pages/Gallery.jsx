import { useMemo, useState } from 'react';
import Img from '../components/Img';
import Lightbox from '../components/Lightbox';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import galleryItems, { galleryFilters } from '../data/gallery';
import { photo } from '../data/photos';
import './Gallery.css';

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);
  const items = useMemo(
    () => (filter === 'All' ? galleryItems : galleryItems.filter((g) => g.place === filter)),
    [filter]
  );
  const countFor = (f) => (f === 'All' ? galleryItems.length : galleryItems.filter((g) => g.place === f).length);

  return (
    <>
      <PageHero
        eyebrow="Personal gallery"
        title="Landscapes, light and a little wonder."
        image={photo('munnar-1')}
        position="50% 45%"
        alt="Sunrise glowing over layered green ridges above Munnar"
      >
        Tea-covered hills in Munnar, misty pine forests in Ooty and forest waterfalls near Tada.
        Select any photograph to view it larger.
      </PageHero>

      <section className="gallery section surface-ivory" aria-labelledby="gallery-title">
        <div className="container">
          <h2 id="gallery-title" className="visually-hidden">Photo gallery</h2>
          <p className="gallery__honesty">
            Photos marked <strong>Stock photo</strong> are professional images used to represent a
            place, not pictures I took. Munnar and Tada Falls are places I have visited; Ooty is
            included as a place I love the look of. Photos I took myself are marked <strong>My photo</strong>.
          </p>

          <div className="gallery__filters" role="group" aria-label="Filter photos">
            {galleryFilters.map((f) => (
              <button key={f} type="button" className={`chip ${filter === f ? 'is-active' : ''}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f}<span className="chip__count">{countFor(f)}</span>
              </button>
            ))}
          </div>
          <p className="gallery__count" aria-live="polite">Showing {items.length} photographs{filter !== 'All' ? ` of ${filter}` : ''}</p>

          <ul className="gallery__grid">
            {items.map((g, i) => (
              <Reveal as="li" key={g.id} delay={(i % 4) * 60} className="gallery__item">
                <button type="button" onClick={() => setOpen(i)} aria-label={`View larger: ${g.caption}`}>
                  <Img src={g.src} alt={g.alt} />
                  <span className="gallery__cap">
                    <b>{g.caption}</b>
                    <i>{g.mine ? 'My photo' : 'Stock photo'}</i>
                  </span>
                </button>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {open != null && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  );
}
