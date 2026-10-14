import { Link } from 'react-router-dom';
import { brand, navLinks } from '../data/site';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div>
          <p className="footer__brand">{brand}</p>
          <p className="footer__line">Explore widely. Learn always. Play with passion.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer__links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="footer__copy container">© {new Date().getFullYear()} {brand}. Made with curiosity.</p>
    </footer>
  );
}
