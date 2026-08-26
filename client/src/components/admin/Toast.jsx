import { useEffect } from 'react';
import './FormModal.css';

function Toast({ message, onClose, duration = 3200 }) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="admin-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default Toast;
