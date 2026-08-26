import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { FOOTER_SERVICE_LINKS, NAV_LINKS } from '../utils/constants';
import './Footer.css';

function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const brandName = settings.businessName || 'Wedding Point';

  const socialLinks = [
    { label: 'Instagram', href: settings.instagram },
    { label: 'Facebook', href: settings.facebook },
    { label: 'YouTube', href: settings.youtube },
  ].filter((item) => item.href);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <p className="footer__name">{brandName}</p>
          <p className="footer__tagline">
            {settings.tagline ||
              'Creating Beautiful Weddings, Making Memories Last Forever.'}
          </p>
        </div>

        <div>
          <h2 className="footer__heading">Quick Links</h2>
          <ul className="footer__list">
            {NAV_LINKS.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer__heading">Services</h2>
          <ul className="footer__list">
            {FOOTER_SERVICE_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer__heading">Contact</h2>
          <ul className="footer__list footer__contact">
            {settings.phone ? (
              <li>
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            ) : null}
            {settings.address ? <li>{settings.address}</li> : null}
          </ul>

          {socialLinks.length > 0 ? (
            <div className="footer__social" aria-label="Social media">
              {socialLinks.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>
            © {year} {brandName}
          </p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
