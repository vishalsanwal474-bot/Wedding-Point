import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { resolveMediaUrl } from '../utils/content';
import './GalleryModal.css';

function GalleryModal({ item, onClose }) {
  const titleId = useId();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!item) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const imageUrl = resolveMediaUrl(item.imageUrl);

  return (
    <div
      className="gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="gallery-modal__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="gallery-modal__close"
          onClick={onClose}
          aria-label="Close gallery image"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="gallery-modal__media">
          {imageUrl ? (
            <img src={imageUrl} alt={item.altText || item.title} />
          ) : (
            <div className="gallery-modal__placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="gallery-modal__meta">
          <p className="gallery-modal__category">{item.category}</p>
          <h3 id={titleId}>{item.title}</h3>
          {item.description ? <p>{item.description}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default GalleryModal;
