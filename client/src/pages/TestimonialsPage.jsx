import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import TestimonialCard from '../components/TestimonialCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import CtaBanner from '../components/CtaBanner';
import { fetchTestimonials } from '../services/publicApi';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';

function TestimonialsPage() {
  usePageTitle('Testimonials');
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setTestimonials(await fetchTestimonials());
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
          <p className="page-hero__eyebrow">Testimonials</p>
          <h1>What Our Couples Say</h1>
          <p>
            Kind words from couples who celebrated with Wedding Point by their
            side.
          </p>
        </div>
      </header>

      <section className="section-block">
        <div className="container">
          <SectionHeading title="Stories From the Heart" />
          {loading ? <LoadingSpinner /> : null}
          {!loading && error ? <ErrorMessage message={error} onRetry={load} /> : null}
          {!loading && !error && testimonials.length === 0 ? (
            <EmptyState title="Testimonials coming soon" />
          ) : null}
          {!loading && !error && testimonials.length > 0 ? (
            <div className="card-grid card-grid--3">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}

export default TestimonialsPage;
