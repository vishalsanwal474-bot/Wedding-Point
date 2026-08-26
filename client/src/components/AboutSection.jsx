import Button from './Button';
import './AboutSection.css';
import img01 from '../assets/img01.jpg'

function AboutSection({ compact = false }) {
  return (
    <section className="about-section section-block" aria-labelledby="about-heading">
      <div className="container about-section__grid">
        <div className="about-section__media">
          <img src={img01}
          alt="Beautiful wedding celebration" 
          className='about-section__image'
          />
        </div>

        <div className="about-section__content">
          <p className="about-section__eyebrow">About Us</p>
          <h2 id="about-heading">Your Dream Wedding, Our Passion</h2>
          <p>
            At Wedding Point, we believe every celebration should be as unique as
            the couple behind it. Our team works closely with you to understand
            your vision, preferences, and expectations, transforming your ideas
            into a beautiful and unforgettable celebration.
          </p>
          <p>
            From planning and décor to photography, entertainment, and event
            coordination, we take care of every detail so you can focus on what
            truly matters — celebrating with the people you love.
          </p>
          {!compact ? (
            <Button to="/about" variant="secondary" className="about-section__cta">
              Learn More
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
