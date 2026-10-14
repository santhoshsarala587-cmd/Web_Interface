import Img from './Img';
import KabaddiCourt from './KabaddiCourt';
import { photo } from '../data/photos';

// Shows a real Kabaddi photo if src/assets/photos/kabaddi.jpg exists,
// otherwise the illustrated court.
export default function KabaddiVisual({ labels = true }) {
  const src = photo('kabaddi');
  if (src) {
    return <Img className="fill-img" src={src} alt="Kabaddi players in action on the court" />;
  }
  return <KabaddiCourt labels={labels} />;
}
