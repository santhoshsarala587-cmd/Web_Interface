import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categoryGroups } from '../data/converters.js'
import { useTheme } from '../ThemeContext.jsx'

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">⇄</span>
          <span className="brand-name">UnitCon</span>
        </Link>

        <nav className="nav-links">
          <div className="nav-dropdown" ref={dropdownRef}>
            <button
              className="nav-link nav-dropdown-btn"
              onClick={() => setDropdownOpen((o) => !o)}
            >
              Converters
              <span className={`chevron ${dropdownOpen ? 'open' : ''}`}>⌄</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {categoryGroups.map((group) => (
                  <Link
                    key={group.key}
                    to={`/category/${group.key}`}
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {group.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/all-units" className="nav-link">All Units</Link>
          <Link to="/articles" className="nav-link">Articles</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        <div className="navbar-actions">
          <button className="icon-btn" aria-label="Search">🔍</button>
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
