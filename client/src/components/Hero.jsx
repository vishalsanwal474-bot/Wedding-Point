import Button from './Button';
import { HERO_SUPPORT } from '../utils/content';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" aria-label="Wedding Point introduction">
      <div className="hero__media" aria-hidden="true">
        <div className="hero__image" />
        <div className="hero__overlay" />
      </div>

      <div className="container hero__content">
        <p className="hero__brand">Wedding Point</p>
        <h1 className="hero__title">
          Your Dream Day,
          <span>Beautifully Created</span>
        </h1>
        <p className="hero__description">
          From intimate celebrations to grand weddings, we bring your vision to
          life with creativity, elegance, and attention to every detail.
        </p>

        <div className="hero__actions">
          <Button to="/quote" variant="primary">
            Get a Quote
          </Button>
          <Button to="/services" variant="ghost">
            Explore Our Services
          </Button>
        </div>

        <p className="hero__support">{HERO_SUPPORT}</p>
      </div>
    </section>
  );
}

export default Hero;
