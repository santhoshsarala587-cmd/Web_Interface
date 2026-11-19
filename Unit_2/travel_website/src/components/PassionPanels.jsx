import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Img from './Img';
import KabaddiVisual from './KabaddiVisual';
import passions from '../data/passions';
import './PassionPanels.css';

// Three equal panels. On wide screens the one you hover or focus widens a little; on small screens they stack.
export default function PassionPanels() {
  return (
    <ul className="panels">
      {passions.map((p) => (
        <li key={p.id} className={`panel panel--${p.id}`}>
          <div className="panel__media" aria-hidden={p.visual ? undefined : 'true'}>
            {p.visual ? <KabaddiVisual labels={false} /> : <Img src={p.image} alt="" position={p.position} />}
          </div>
          <div className="panel__shade" />
          <div className="panel__body">
            <h3 className="panel__title">{p.title}</h3>
            <p className="panel__text">{p.text}</p>
            <Link className="panel__cta" to={p.to}>
              {p.cta}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
