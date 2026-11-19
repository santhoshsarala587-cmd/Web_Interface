import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cultureThemes } from '../data/cultures';
import dreamDestinations from '../data/dreamDestinations';
import './CultureExplorer.css';

const dreamName = (id) => dreamDestinations.find((d) => d.id === id);

// Seven cultural themes in an accessible tab set (arrow keys, Home/End).
export default function CultureExplorer({ tone = 'light' }) {
  const [active, setActive] = useState(cultureThemes[0].id);
  const tabs = useRef({});
  const theme = cultureThemes.find((t) => t.id === active);

  const onKeyDown = (e) => {
    const i = cultureThemes.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % cultureThemes.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + cultureThemes.length) % cultureThemes.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = cultureThemes.length - 1;
    else return;
    e.preventDefault();
    const id = cultureThemes[next].id;
    setActive(id);
    tabs.current[id]?.focus();
  };

  return (
    <div className={`cex cex--${tone}`}>
      <div className="cex__tabs" role="tablist" aria-label="Cultural themes" onKeyDown={onKeyDown}>
        {cultureThemes.map((t) => (
          <button
            key={t.id}
            ref={(el) => { tabs.current[t.id] = el; }}
            type="button"
            role="tab"
            id={`cex-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls="cex-panel"
            tabIndex={active === t.id ? 0 : -1}
            className={`cex__tab ${active === t.id ? 'is-active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={theme.id} id="cex-panel" role="tabpanel" aria-labelledby={`cex-tab-${theme.id}`} className="cex__panel">
        <p className="cex__lead">{theme.lead}</p>
        <ul className="cex__items">
          {theme.items.map((item) => {
            const place = item.dream ? dreamName(item.dream) : null;
            return (
              <li key={item.name} className="cex__item">
                <p className="cex__where">{item.where}</p>
                <h3 className="cex__name">{item.name}</h3>
                <p className="cex__note">{item.note}</p>
                {place && (
                  <Link className="cex__link" to={`/dream-destinations/${place.id}`}>
                    On my list: {place.name} <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
