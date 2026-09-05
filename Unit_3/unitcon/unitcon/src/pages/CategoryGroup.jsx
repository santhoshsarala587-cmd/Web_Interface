import { useParams, Link, Navigate } from 'react-router-dom'
import { categoryGroups, converters } from '../data/converters.js'

export default function CategoryGroup() {
  const { groupKey } = useParams()
  const group = categoryGroups.find((g) => g.key === groupKey)

  if (!group) return <Navigate to="/all-units" replace />

  return (
    <div className="page-wrap">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/all-units">All Converters</Link> / <span>{group.label}</span>
      </div>

      <h1 className="page-title">{group.label}</h1>
      <p className="page-subtitle">{group.converters.length} converters in this category.</p>

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
