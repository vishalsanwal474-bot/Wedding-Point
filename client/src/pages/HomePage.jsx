import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import Stats from '../components/Stats';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import PackageCard from '../components/PackageCard';
import WhyChooseUs from '../components/WhyChooseUs';
import GalleryGrid from '../components/GalleryGrid';
import TestimonialCard from '../components/TestimonialCard';
import CtaBanner from '../components/CtaBanner';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import usePageTitle from '../hooks/usePageTitle';
import useHomeContent from '../hooks/useHomeContent';
import './HomePage.css';

function HomePage() {
  usePageTitle('Home');
  const {
    services,
    packages,
    gallery,
    testimonials,
    loading,
    error,
    reload,
  } = useHomeContent();

  return (
    <div className="home-page">
      <Hero />
      <AboutSection />
      <Stats />

      <section className="section-block" aria-labelledby="services-heading">
        <div className="container">
          <SectionHeading
            id="services-heading"
            eyebrow="Our Services"
            title="Our Wedding Services"
            description="Everything you need to create a beautiful, memorable and stress-free celebration."
          />

          {loading ? <LoadingSpinner label="Loading services…" /> : null}
          {!loading && error ? (
            <ErrorMessage message={error} onRetry={reload} />
          ) : null}
          {!loading && !error && services.length === 0 ? (
            <EmptyState
              title="Services coming soon"
              description="Wedding services will appear here once they are published."
            />
          ) : null}
          {!loading && !error && services.length > 0 ? (
            <>
              <div className="card-grid card-grid--3">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
              <div className="section-actions">
                <Button to="/services" variant="secondary">
                  View All Services
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <WhyChooseUs />

      <section className="section-block" aria-labelledby="packages-heading">
        <div className="container">
          <SectionHeading
            id="packages-heading"
            eyebrow="Packages"
            title="Thoughtfully Designed Packages"
            description="Choose a foundation that fits your celebration — then refine every detail with us."
          />

          {loading ? <LoadingSpinner label="Loading packages…" /> : null}
          {!loading && !error && packages.length === 0 ? (
            <EmptyState title="Packages coming soon" />
          ) : null}
          {!loading && !error && packages.length > 0 ? (
            <>
              <div className="card-grid card-grid--3">
                {packages.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} />
                ))}
              </div>
              <div className="section-actions">
                <Button to="/packages" variant="secondary">
                  Explore Packages
                </Button>
                <Button to="/packages#calculator" variant="primary">
                  Package Calculator
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section
        className="section-block section-block--secondary"
        aria-labelledby="gallery-heading"
      >
        <div className="container">
          <SectionHeading
            id="gallery-heading"
            eyebrow="Gallery"
            title="Moments We Love"
            description="A glimpse into celebrations shaped with care, colour, and quiet luxury."
          />
          {!loading ? (
            <GalleryGrid items={gallery} limit={8} />
          ) : (
            <LoadingSpinner />
          )}
          <div className="section-actions">
            <Button to="/gallery" variant="secondary">
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      <section className="section-block" aria-labelledby="testimonials-heading">
        <div className="container">
          <SectionHeading
            id="testimonials-heading"
            eyebrow="Testimonials"
            title="What Our Couples Say"
            description="Real words from couples who trusted Wedding Point with their day."
          />

          {loading ? <LoadingSpinner label="Loading testimonials…" /> : null}
          {!loading && testimonials.length === 0 ? (
            <EmptyState title="Testimonials coming soon" />
          ) : null}
          {!loading && testimonials.length > 0 ? (
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

export default HomePage;
