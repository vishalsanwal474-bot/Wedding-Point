import AboutSection from '../components/AboutSection';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import CtaBanner from '../components/CtaBanner';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';

function AboutPage() {
  usePageTitle('About');

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">About Wedding Point</p>
          <h1>Creating Beautiful Weddings, Making Memories Last Forever</h1>
          <p>
            We are a premium wedding planning and event services team devoted to
            elegant celebrations and calm, confident coordination.
          </p>
        </div>
      </header>

      <AboutSection compact />
      <Stats />
      <WhyChooseUs />
      <CtaBanner />
    </div>
  );
}

export default AboutPage;
