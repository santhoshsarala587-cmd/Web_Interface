import { useEffect, useRef, useState } from 'react';

// Image with lazy loading, a soft fade-in once loaded, and a styled fallback if it fails.
export default function Img({ src, alt, className = '', eager = false, position, onFail }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  // Handles images that finished loading before React attached the handler
  useEffect(() => {
    if (ref.current && ref.current.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [src]);

  if (failed) {
    return <div className={`img-fallback ${className}`} role="img" aria-label={alt} />;
  }

  return (
    <img
      ref={ref}
      className={`${className} ${eager ? '' : 'img-fade'} ${loaded && !eager ? 'img-loaded' : ''}`}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      style={position ? { objectPosition: position } : undefined}
      onLoad={() => setLoaded(true)}
      onError={() => { setFailed(true); if (onFail) onFail(); }}
    />
  );
}
