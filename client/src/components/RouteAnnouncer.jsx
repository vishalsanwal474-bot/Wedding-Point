import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function RouteAnnouncer() {
  const location = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    const pageLabel = document.title || 'Page updated';
    if (ref.current) {
      ref.current.textContent = pageLabel;
    }
  }, [location.pathname, location.search]);

  return (
    <div
      ref={ref}
      className="visually-hidden"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    />
  );
}

export default RouteAnnouncer;
