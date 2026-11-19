import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// Wishlist of dream destinations, kept in React state and saved in this browser's localStorage.
// Nothing is sent anywhere.
const KEY = 'my-travel-wishlist-v1';

const load = () => {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY));
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
};

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(load);
  const [toast, setToast] = useState({ text: '', show: false });
  const timer = useRef(0);

  // Persist on every change
  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) { /* storage unavailable */ }
  }, [ids]);

  // Keep several tabs in sync
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setIds(load()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const notify = useCallback((text) => {
    clearTimeout(timer.current);
    setToast({ text, show: true });
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2600);
  }, []);

  const toggle = useCallback((place) => {
    const has = ids.includes(place.id);
    setIds(has ? ids.filter((x) => x !== place.id) : [...ids, place.id]);
    notify(has ? `Removed ${place.name} from your wishlist` : `Saved ${place.name} to your wishlist`);
  }, [ids, notify]);

  const clear = useCallback(() => {
    setIds([]);
    notify('Wishlist cleared');
  }, [notify]);

  const value = useMemo(
    () => ({ ids, count: ids.length, has: (id) => ids.includes(id), toggle, clear }),
    [ids, toggle, clear]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <div className={`toast ${toast.show ? 'is-shown' : ''}`} role="status" aria-live="polite">
        {toast.text}
      </div>
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
