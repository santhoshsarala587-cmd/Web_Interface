import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { brand, moreLinks, navLinks } from '../data/site';
import { useWishlist } from '../context/WishlistContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [solid, setSolid] = useState(false);
  const moreRef = useRef(null);
  const { pathname, hash } = useLocation();
  const { count } = useWishlist();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus whenever the route changes
  useEffect(() => { setOpen(false); setMore(false); }, [pathname, hash]);

  // Mobile menu: lock scroll, Esc closes, closes when resized to desktop
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 1240 && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  // "More" dropdown: Esc or a click outside closes it
  useEffect(() => {
    if (!more) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMore(false);
    const onDown = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMore(false); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [more]);

  const isActive = (to) => pathname === to || pathname.startsWith(`${to}/`);
  const moreActive = moreLinks.some((l) => isActive(l.to));

  const item = (link) => (
    <li key={link.to}>
      <Link
        to={link.to}
        className={isActive(link.to) ? 'is-active' : ''}
        aria-current={isActive(link.to) ? 'page' : undefined}
      >
        {link.label}
        {link.to === '/dream-destinations' && count > 0 && (
          <span className="navbar__count" aria-label={`${count} saved`}>{count}</span>
        )}
      </Link>
    </li>
  );

  return (
    <header className={`navbar ${solid || open ? 'is-solid' : ''}`}>
      <nav className="navbar__inner container" aria-label="Primary">
        <Link className="navbar__brand" to="/" aria-label={`${brand}, home`}>
          {brand}
          <span className="navbar__dot" aria-hidden="true" />
        </Link>

        <ul id="primary-menu" className={`navbar__list ${open ? 'is-open' : ''}`}>
          {navLinks.map(item)}
          <li className="navbar__more" ref={moreRef}>
            <button
              type="button"
              className={`navbar__more-btn ${moreActive ? 'is-active' : ''}`}
              aria-expanded={more}
              aria-controls="more-menu"
              onClick={() => setMore((v) => !v)}
            >
              More <ChevronDown size={16} aria-hidden="true" />
            </button>
            <ul id="more-menu" className={`navbar__sub ${more ? 'is-open' : ''}`}>
              {moreLinks.map(item)}
            </ul>
          </li>
        </ul>

        <div className="navbar__tools">
          <ThemeToggle />
          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={open}
            aria-controls="primary-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
