import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { brand, navLinks } from '../data/site';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu whenever the route changes
  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 1080 && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const isActive = (to) => {
    if (to === '/#contact') return pathname === '/' && hash === '#contact';
    if (to === '/') return pathname === '/' && hash !== '#contact';
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <header className={`navbar ${solid || open ? 'is-solid' : ''}`}>
      <nav className="navbar__inner container" aria-label="Primary">
        <Link className="navbar__brand" to="/">
          {brand}
          <span className="navbar__dot" aria-hidden="true" />
        </Link>

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

        <ul id="primary-menu" className={`navbar__list ${open ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={isActive(link.to) ? 'is-active' : ''}
                aria-current={isActive(link.to) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
