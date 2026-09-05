import { Link } from 'react-router-dom'
import { categoryGroups, converters, getConverterCount, getUnitCount } from '../data/converters.js'

const FEATURED = ['length', 'weight', 'temperature', 'volume', 'speed', 'area']

export default function Home() {
  return (
    <div className="page-wrap">
      <section className="hero">
        <h1>Convert anything, instantly.</h1>
        <p>{getConverterCount()} converters across {categoryGroups.length} categories, covering {getUnitCount()}+ units.</p>
        <Link to="/all-units" className="btn btn-primary hero-cta">Browse All Converters</Link>
      </section>

      <section>
        <h2 className="section-label">Popular Converters</h2>
        <div className="converter-list-grid">
          {FEATURED.map((key) => {
            const conv = converters[key]
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
      </section>

      <section>
        <h2 className="section-label">Browse by Category</h2>
        <div className="category-groups-grid">
          {categoryGroups.map((g) => (
            <Link key={g.key} to={`/category/${g.key}`} className="category-group-card">
              <div className="category-group-name">{g.label}</div>
              <div className="category-group-count">{g.converters.length} converters</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
