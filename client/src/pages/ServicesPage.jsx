import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import CtaBanner from '../components/CtaBanner';
import { fetchServices } from '../services/publicApi';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';

function ServicesPage() {
  usePageTitle('Services');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setServices(await fetchServices());
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
          <p className="page-hero__eyebrow">Services</p>
          <h1>Our Wedding Services</h1>
          <p>
            Everything you need to create a beautiful, memorable and stress-free
            celebration.
          </p>
        </div>
      </header>

      <section className="section-block">
        <div className="container">
          <SectionHeading
            title="Crafted for Every Moment"
            description="From first ideas to final celebrations, our services cover the essentials of a refined wedding day."
          />
          {loading ? <LoadingSpinner /> : null}
          {!loading && error ? <ErrorMessage message={error} onRetry={load} /> : null}
          {!loading && !error && services.length === 0 ? (
            <EmptyState title="Services coming soon" />
          ) : null}
          {!loading && !error && services.length > 0 ? (
            <div className="card-grid card-grid--3">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}

export default ServicesPage;
