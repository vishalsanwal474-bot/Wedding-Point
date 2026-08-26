import './DashboardCard.css';

function DashboardCard({ label, value, hint }) {
  return (
    <article className="dashboard-card">
      <p className="dashboard-card__label">{label}</p>
      <p className="dashboard-card__value">{value}</p>
      {hint ? <p className="dashboard-card__hint">{hint}</p> : null}
    </article>
  );
}

export default DashboardCard;
