import { Link } from 'react-router-dom';
import { brand, allLinks } from '../data/site';
import profile from '../data/profile';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div>
          <p className="footer__brand">{brand}</p>
          <p className="footer__line">Travel. Culture. Kabaddi. A life full of curiosity, adventure and passion.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer__links">
            {allLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="footer__copy container">© {new Date().getFullYear()} {profile.name || profile.siteName}. Made with curiosity.</p>
    </footer>
  );
}
