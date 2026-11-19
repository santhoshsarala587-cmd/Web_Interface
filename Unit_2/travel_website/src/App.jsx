import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollManager from './components/ScrollManager';
import ScrollProgress from './components/ScrollProgress';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import Contact from './pages/Contact';
import Cultures from './pages/Cultures';
import DestinationDetail from './pages/DestinationDetail';
import DreamDestinations from './pages/DreamDestinations';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import JourneyDetail from './pages/JourneyDetail';
import Journeys from './pages/Journeys';
import Kabaddi from './pages/Kabaddi';
import MyStory from './pages/MyStory';
import NotFound from './pages/NotFound';
import Passions from './pages/Passions';

// The map (and Leaflet) is only downloaded when someone opens the Travel Map page
const TravelMap = lazy(() => import('./pages/TravelMap'));

// Re-mounts on every path change so each page fades in, and sets a page title.
function AnimatedRoutes() {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-enter">
      <Suspense fallback={<p className="route-loading" role="status">Loading…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-story" element={<MyStory />} />
          <Route path="/passions" element={<Passions />} />
          <Route path="/journeys" element={<Journeys />} />
          <Route path="/journeys/:id" element={<JourneyDetail />} />
          <Route path="/dream-destinations" element={<DreamDestinations />} />
          <Route path="/dream-destinations/:id" element={<DestinationDetail />} />
          <Route path="/travel-map" element={<TravelMap />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/cultures" element={<Cultures />} />
          <Route path="/kabaddi" element={<Kabaddi />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/visited-places" element={<Navigate to="/journeys" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <WishlistProvider>
        <ScrollManager />
        <ScrollProgress />
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        <main id="main">
          <AnimatedRoutes />
        </main>
        <Footer />
        <BackToTop />
      </WishlistProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
