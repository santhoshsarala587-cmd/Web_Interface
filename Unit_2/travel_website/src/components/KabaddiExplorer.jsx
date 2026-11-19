import { useState } from 'react';
import KabaddiCourt from './KabaddiCourt';
import courtParts from '../data/court';
import './KabaddiExplorer.css';

// The court illustration plus a panel that explains whichever part is selected.
// Parts can be chosen on the court itself or from the buttons below it.
export default function KabaddiExplorer({ compact = false }) {
  const [active, setActive] = useState('raider');
  const part = courtParts.find((p) => p.id === active) || courtParts[0];

  return (
    <div className={`kex ${compact ? 'kex--compact' : ''}`}>
      <div className="kex__court">
        <KabaddiCourt interactive labels={false} active={active} onSelect={setActive} />
      </div>

      <div className="kex__panel">
        <div className="kex__tabs" role="group" aria-label="Parts of the court">
          {courtParts.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`kex__tab ${active === p.id ? 'is-active' : ''}`}
              aria-pressed={active === p.id}
              onClick={() => setActive(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="kex__detail" aria-live="polite">
          <h3 className="kex__title">{part.title}</h3>
          <p>{part.text}</p>
        </div>
      </div>
    </div>
  );
}
