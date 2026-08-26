import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import PackageCard from '../components/PackageCard';
import PackageCalculator from '../components/PackageCalculator';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import CtaBanner from '../components/CtaBanner';
import { fetchPackages } from '../services/publicApi';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';

function PackagesPage() {
  usePageTitle('Packages');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setPackages(await fetchPackages());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (window.location.hash === '#calculator') {
      const el = document.getElementById('calculator');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Packages</p>
          <h1>Wedding Packages</h1>
          <p>
            Essential, Classic, and Royal foundations — then estimate your cost
            with the interactive calculator below.
          </p>
        </div>
      </header>

      <section className="section-block">
        <div className="container">
          <SectionHeading
            title="Choose Your Starting Point"
            description="Every package can be refined. Final pricing is based on your date, venue, guest count, and selected services."
          />
          {loading ? <LoadingSpinner /> : null}
          {!loading && error ? <ErrorMessage message={error} onRetry={load} /> : null}
          {!loading && !error && packages.length === 0 ? (
            <EmptyState title="Packages coming soon" />
          ) : null}
          {!loading && !error && packages.length > 0 ? (
            <div className="card-grid card-grid--3">
              {packages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section
        id="calculator"
        className="section-block section-block--secondary"
        aria-labelledby="calculator-heading"
      >
        <div className="container">
          <SectionHeading
            id="calculator-heading"
            title="Build Your Estimate"
            description="Select guests and service levels to see an estimated wedding cost, then request this package."
          />
          <PackageCalculator />
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}

export default PackagesPage;
