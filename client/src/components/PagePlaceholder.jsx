import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import './PagePlaceholder.css';

function PagePlaceholder({
  title,
  description = 'This page will be fully designed in the next phases.',
  phaseNote,
}) {
  usePageTitle(title);

  return (
    <section className="page-placeholder">
      <div className="container page-placeholder__inner">
        <p className="page-placeholder__eyebrow">Wedding Point</p>
        <h1>{title}</h1>
        <p className="page-placeholder__description">{description}</p>
        {phaseNote ? <p className="page-placeholder__note">{phaseNote}</p> : null}
        <div className="page-placeholder__actions">
          <Link to="/">Back to Home</Link>
          <Link to="/quote">Get a Quote</Link>
        </div>
      </div>
    </section>
  );
}

export default PagePlaceholder;
