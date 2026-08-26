import { Check } from 'lucide-react';
import Button from './Button';
import './PackageCard.css';

function PackageCard({ pkg }) {
  return (
    <article className={`package-card ${pkg.isPopular ? 'package-card--popular' : ''}`}>
      {pkg.isPopular ? <p className="package-card__badge">Most Popular</p> : null}
      <h3>{pkg.name}</h3>
      <p className="package-card__description">{pkg.description}</p>

      <ul className="package-card__features">
        {(pkg.features || []).map((feature) => (
          <li key={feature}>
            <Check size={16} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button to="/quote" variant={pkg.isPopular ? 'primary' : 'secondary'} className="package-card__cta">
        Request a Quote
      </Button>
    </article>
  );
}

export default PackageCard;
