import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import GalleryGrid from '../components/GalleryGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CtaBanner from '../components/CtaBanner';
import { fetchGallery } from '../services/publicApi';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';

function GalleryPage() {
  usePageTitle('Gallery');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchGallery());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Gallery</p>
          <h1>Wedding Gallery</h1>
          <p>
            Explore ceremonies, décor, and celebrations — filtered by category,
            with a lightbox for a closer look.
          </p>
        </div>
      </header>

      <section className="section-block">
        <div className="container">
          <SectionHeading
            title="A Collection of Beautiful Days"
            description="Browse by category to find inspiration for your own celebration."
          />
          {loading ? <LoadingSpinner /> : null}
          {!loading && error ? <ErrorMessage message={error} onRetry={load} /> : null}
          {!loading && !error ? <GalleryGrid items={items} /> : null}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}

export default GalleryPage;
