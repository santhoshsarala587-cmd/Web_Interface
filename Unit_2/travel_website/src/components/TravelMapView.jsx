import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TravelMapView.css';

// Leaflet map with OpenStreetMap tiles. Visited and dream places get different marker shapes AND colours.
// `points`: [{ id, name, region, coords, image, href, kind: 'visited' | 'dream' }]
export default function TravelMapView({ points, focusId }) {
  const el = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const markers = useRef({});
  const navigate = useNavigate();

  // Create the map once, and remove it on unmount
  useEffect(() => {
    map.current = L.map(el.current, { scrollWheelZoom: false, worldCopyJump: true }).setView([22, 60], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    const m = map.current;
    // Let people zoom with the wheel only after clicking the map, so page scrolling isn't hijacked
    m.on('click', () => m.scrollWheelZoom.enable());
    m.on('blur mouseout', () => m.scrollWheelZoom.disable());
    return () => { m.remove(); map.current = null; };
  }, []);

  // (Re)draw markers whenever the visible points change
  useEffect(() => {
    if (!map.current) return;
    layer.current.clearLayers();
    markers.current = {};
    points.forEach((p) => {
      const visited = p.kind === 'visited';
      const icon = L.divIcon({
        className: `pin pin--${p.kind}`,
        html: `<span aria-hidden="true">${visited ? '✓' : '★'}</span>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -32],
      });
      const marker = L.marker(p.coords, { icon, title: `${p.name} (${visited ? 'visited' : 'dream destination'})`, alt: p.name, keyboard: true });

      const box = document.createElement('div');
      box.className = 'map-pop';
      if (p.image) {
        const img = document.createElement('img');
        img.src = p.image; img.alt = ''; img.loading = 'lazy';
        img.onerror = () => img.remove();
        box.appendChild(img);
      }
      const tag = document.createElement('span');
      tag.className = `map-pop__tag map-pop__tag--${p.kind}`;
      tag.textContent = visited ? 'Visited' : 'Dream destination';
      const h = document.createElement('strong'); h.textContent = p.name;
      const r = document.createElement('small'); r.textContent = p.region;
      const a = document.createElement('a');
      a.href = p.href; a.textContent = visited ? 'Read my story →' : 'View details →';
      a.addEventListener('click', (e) => { e.preventDefault(); navigate(p.href); });
      box.append(tag, h, r, a);
      marker.bindPopup(box, { minWidth: 200, maxWidth: 240 });
      marker.addTo(layer.current);
      markers.current[p.id] = marker;
    });

    if (points.length) {
      const target = focusId && markers.current[focusId];
      if (target) {
        map.current.setView(target.getLatLng(), 6);
        target.openPopup();
      } else {
        map.current.fitBounds(L.latLngBounds(points.map((p) => p.coords)), { padding: [50, 50], maxZoom: 4 });
      }
    }
  }, [points, focusId, navigate]);

  return <div ref={el} className="travel-map" role="region" aria-label="Interactive travel map" />;
}
