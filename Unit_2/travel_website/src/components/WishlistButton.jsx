import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import './WishlistButton.css';

// Heart button. `variant="icon"` for cards, `variant="label"` for detail pages.
export default function WishlistButton({ place, variant = 'icon' }) {
  const { has, toggle } = useWishlist();
  const on = has(place.id);

  return (
    <button
      type="button"
      className={`wish wish--${variant} ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      aria-label={on ? `Remove ${place.name} from wishlist` : `Save ${place.name} to wishlist`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(place); }}
    >
      <Heart size={variant === 'icon' ? 20 : 18} fill={on ? 'currentColor' : 'none'} aria-hidden="true" />
      {variant === 'label' && <span>{on ? 'Saved to wishlist' : 'Save to wishlist'}</span>}
    </button>
  );
}
