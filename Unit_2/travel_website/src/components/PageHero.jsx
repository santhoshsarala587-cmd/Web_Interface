import { useRef } from 'react';
import Img from './Img';
import useParallax from '../hooks/useParallax';
import PlaceArt from './PlaceArt';
import './PageHero.css';

// Cinematic page opener. Pass `image` (photo URL) or `art` (illustration theme),
// or `visual` for a custom background node.
export default function PageHero({ eyebrow, title, children, image, position, art, visual, tone = 'forest', actions, alt = '' }) {
  const bg = useRef(null);
  useParallax(bg, 0.25);
  return (
    <header className={`page-hero page-hero--${tone}`}>
      <div className="page-hero__bg" ref={bg} aria-hidden={alt ? undefined : 'true'}>
        {visual || (image ? <Img src={image} alt={alt} position={position} eager /> : art ? <PlaceArt theme={art} /> : null)}
      </div>
      <div className="page-hero__shade" />
      <div className="page-hero__inner container">
        <p className="eyebrow page-hero__eyebrow">{eyebrow}</p>
        <h1 className="page-hero__title">{title}</h1>
        {children && <p className="page-hero__text">{children}</p>}
        {actions && <div className="page-hero__actions">{actions}</div>}
      </div>
    </header>
  );
}
