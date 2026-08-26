import {
  Building2,
  Camera,
  ClipboardList,
  Heart,
  Music,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import Button from './Button';
import { resolveMediaUrl } from '../utils/content';
import './ServiceCard.css';

const ICON_MAP = {
  ClipboardList,
  Sparkles,
  Camera,
  UtensilsCrossed,
  Music,
  Building2,
  Heart,
};

function ServiceCard({ service }) {
  const Icon = ICON_MAP[service.icon] || Heart;
  const imageUrl = resolveMediaUrl(service.image);

  return (
    <article className="service-card">
      <div className={`service-card__media ${imageUrl ? '' : 'service-card__media--placeholder'}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="service-card__image"
          />
        ) : (
          <span className="service-card__icon" aria-hidden="true">
            <Icon size={28} strokeWidth={1.5} />
          </span>
        )}
      </div>

      <div className="service-card__body">
        <h3>{service.title}</h3>
        <p>{service.shortDescription || service.description}</p>
        <Button to="/services" variant="secondary" className="service-card__link">
          Learn More
        </Button>
      </div>
    </article>
  );
}

export default ServiceCard;
