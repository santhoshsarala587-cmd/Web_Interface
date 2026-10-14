import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollManager from './components/ScrollManager';
import ScrollProgress from './components/ScrollProgress';
import Cultures from './pages/Cultures';
import DestinationDetail from './pages/DestinationDetail';
import DreamDestinations from './pages/DreamDestinations';
import Home from './pages/Home';
import Kabaddi from './pages/Kabaddi';
import MyStory from './pages/MyStory';
import NotFound from './pages/NotFound';
import VisitedPlaces from './pages/VisitedPlaces';

// Re-mounts on every path change so each page fades in.
function AnimatedRoutes() {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-enter">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-story" element={<MyStory />} />
        <Route path="/visited-places" element={<VisitedPlaces />} />
        <Route path="/dream-destinations" element={<DreamDestinations />} />
        <Route path="/dream-destinations/:id" element={<DestinationDetail />} />
        <Route path="/cultures" element={<Cultures />} />
        <Route path="/kabaddi" element={<Kabaddi />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <ScrollProgress />
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <AnimatedRoutes />
      </main>
      <Footer />
      <BackToTop />
    </BrowserRouter>
  );
}
