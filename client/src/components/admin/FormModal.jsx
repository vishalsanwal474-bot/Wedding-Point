import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import './FormModal.css';

function FormModal({ open, title, onClose, children, wide = false }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const wasOpenRef = useRef(false);

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return undefined;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus only when the modal opens — not on parent re-renders while typing.
    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      const firstField = panelRef.current?.querySelector(
        'input:not([type="hidden"]), select, textarea, button:not([aria-label="Close dialog"])'
      );
      window.requestAnimationFrame(() => {
        firstField?.focus();
      });
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="form-modal" role="presentation" onClick={() => onCloseRef.current()}>
      <div
        ref={panelRef}
        className={`form-modal__panel ${wide ? 'form-modal__panel--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="form-modal__header">
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className="form-modal__close"
            aria-label="Close dialog"
            onClick={() => onCloseRef.current()}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="form-modal__body">{children}</div>
      </div>
    </div>
  );
}

export default FormModal;
