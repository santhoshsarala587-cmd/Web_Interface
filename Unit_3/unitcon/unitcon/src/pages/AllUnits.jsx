import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryGroups, converters, getConverterCount, getUnitCount } from '../data/converters.js'

export default function AllUnits() {
  const [activeGroup, setActiveGroup] = useState(categoryGroups[0].key)
  const group = categoryGroups.find((g) => g.key === activeGroup)

  return (
    <div className="page-wrap">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>All Converters</span>
      </div>

      <h1 className="page-title">All Converters</h1>
      <p className="page-subtitle">
        {getConverterCount()} converters across {categoryGroups.length} categories covering {getUnitCount()}+ units.
        Click any converter name to open it, or use this page as a reference for what units are available.
      </p>

      <div className="group-tabs">
        {categoryGroups.map((g) => (
          <button
            key={g.key}
            className={`group-tab ${g.key === activeGroup ? 'active' : ''}`}
            onClick={() => setActiveGroup(g.key)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="converter-list-grid">
        {group.converters.map((key) => {
          const conv = converters[key]
          if (!conv) return null
          return (
            <Link key={key} to={`/convert/${key}`} className="converter-list-card">
              <span className="converter-list-icon">{conv.icon}</span>
              <div>
                <div className="converter-list-name">{conv.label} Converter</div>
                <div className="converter-list-meta">{Object.keys(conv.units).length} units</div>
              </div>
              <span className="arrow">→</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
