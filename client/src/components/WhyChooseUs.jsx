import {
  HeartHandshake,
  Layers,
  Leaf,
  Sparkles,
  Users,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { WHY_CHOOSE_ITEMS } from '../utils/content';
import './WhyChooseUs.css';

const ICON_MAP = {
  HeartHandshake,
  Sparkles,
  Users,
  Layers,
  Leaf,
};

function WhyChooseUs() {
  return (
    <section className="why-choose section-block section-block--secondary">
      <div className="container">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A Calmer Path to Your Celebration"
          description="Thoughtful planning, refined execution, and a team that treats your wedding with care."
        />

        <div className="why-choose__grid">
          {WHY_CHOOSE_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon] || Sparkles;
            return (
              <article key={item.title} className="why-choose__item">
                <span className="why-choose__icon" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.5} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
