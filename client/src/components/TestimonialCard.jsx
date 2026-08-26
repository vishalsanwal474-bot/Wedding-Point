import { Star } from 'lucide-react';
import { resolveMediaUrl } from '../utils/content';
import './TestimonialCard.css';

function TestimonialCard({ testimonial }) {
  const imageUrl = resolveMediaUrl(testimonial.image);
  const rating = Number(testimonial.rating) || 5;

  return (
    <article className="testimonial-card">
      <div className="testimonial-card__rating" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            fill={index < rating ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote>
        <p>“{testimonial.message}”</p>
      </blockquote>

      <div className="testimonial-card__author">
        <div
          className={`testimonial-card__avatar ${
            imageUrl ? '' : 'testimonial-card__avatar--placeholder'
          }`}
          aria-hidden="true"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" loading="lazy" />
          ) : (
            <span>
              {(testimonial.coupleName || testimonial.name || 'W')
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="testimonial-card__name">
            — {testimonial.coupleName || testimonial.name}
          </p>
        </div>
      </div>
    </article>
  );
}

export default TestimonialCard;
