import { useSettings } from '../context/SettingsContext';
import './Stats.css';

function Stats() {
  const { settings } = useSettings();

  const items = [
    {
      value: `${settings.yearsExperience ?? 10}+`,
      label: 'Years of Experience',
    },
    {
      value: `${settings.weddingsCompleted ?? 500}+`,
      label: 'Weddings Celebrated',
    },
    {
      value: `${settings.venuesServed ?? 50}+`,
      label: 'Venues Served',
    },
    {
      value: settings.commitmentText || '100%',
      label: 'Commitment',
    },
  ];

  return (
    <section className="stats" aria-label="Wedding Point highlights">
      <div className="container stats__grid">
        {items.map((item) => (
          <div key={item.label} className="stats__item">
            <p className="stats__value">{item.value}</p>
            <p className="stats__label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
