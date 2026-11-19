import { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Img from './Img';
import './Lightbox.css';

// Accessible image viewer: Esc closes, arrow keys / buttons / swipe navigate, focus is trapped and restored.
export default function Lightbox({ items, index, onClose, onIndex }) {
  const closeBtn = useRef(null);
  const touchX = useRef(null);
  const item = items[index];
  const many = items.length > 1;

  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    const opener = document.activeElement;
    document.body.style.overflow = 'hidden';
    if (closeBtn.current) closeBtn.current.focus();
    return () => {
      document.body.style.overflow = '';
      if (opener && opener.focus) opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && many) prev();
      else if (e.key === 'ArrowRight' && many) next();
      else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const nodes = document.querySelectorAll('.lightbox button');
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [many, next, onClose, prev]);

  if (!item) return null;

  const onTouchEnd = (e) => {
    if (touchX.current == null || !many) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
    touchX.current = null;
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${item.caption}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
    >
      <button ref={closeBtn} type="button" className="lightbox__btn lightbox__close" aria-label="Close viewer" onClick={onClose}>
        <X size={26} aria-hidden="true" />
      </button>
      {many && (
        <button type="button" className="lightbox__btn lightbox__nav lightbox__nav--prev" aria-label="Previous photo" onClick={prev}>
          <ChevronLeft size={30} aria-hidden="true" />
        </button>
      )}
      <figure className="lightbox__figure">
        <div className="lightbox__img" key={item.src}>
          <Img src={item.src} alt={item.alt} eager />
        </div>
        <figcaption>
          <strong>{item.caption}</strong>
          <span>{item.label}</span>
          {many && <em>{index + 1} / {items.length}</em>}
        </figcaption>
      </figure>
      {many && (
        <button type="button" className="lightbox__btn lightbox__nav lightbox__nav--next" aria-label="Next photo" onClick={next}>
          <ChevronRight size={30} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
