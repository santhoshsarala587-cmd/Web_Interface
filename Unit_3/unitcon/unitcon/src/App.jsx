import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import AllUnits from './pages/AllUnits.jsx'
import CategoryGroup from './pages/CategoryGroup.jsx'
import Converter from './pages/Converter.jsx'
import Articles from './pages/Articles.jsx'
import About from './pages/About.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-units" element={<AllUnits />} />
          <Route path="/category/:groupKey" element={<CategoryGroup />} />
          <Route path="/convert/:key" element={<Converter />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>UnitCon — built with React. All conversions run locally in your browser.</p>
      </footer>
    </div>
  )
}
