import { useEffect, useId, useRef } from 'react';
import Button from '../Button';
import './ConfirmModal.css';

function ConfirmModal({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const cancelRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const wasOpenRef = useRef(false);

  onCancelRef.current = onCancel;

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return undefined;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      window.requestAnimationFrame(() => {
        cancelRef.current?.focus();
      });
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !loading) {
        onCancelRef.current();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, loading]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="confirm-modal"
      role="presentation"
      onClick={loading ? undefined : () => onCancelRef.current()}
    >
      <div
        className="confirm-modal__panel"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>{title}</h2>
        {message ? <p>{message}</p> : null}
        <div className="confirm-modal__actions">
          <Button
            ref={cancelRef}
            type="button"
            variant="secondary"
            onClick={() => onCancelRef.current()}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button type="button" variant="primary" onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
