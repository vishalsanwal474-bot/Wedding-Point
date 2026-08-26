import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import { useSettings } from '../context/SettingsContext';
import { NAV_LINKS } from '../utils/constants';
import './Navbar.css';

function Navbar() {
  const { settings } = useSettings();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const brandName = settings.businessName || 'Wedding Point';

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" aria-label={`${brandName} home`}>
          {brandName}
        </Link>

        <nav className="navbar__desktop" aria-label="Primary">
          <ul className="navbar__links">
            {NAV_LINKS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <Button to="/quote" className="navbar__cta" variant="primary">
            Get a Quote
          </Button>

          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={isOpen}
            aria-controls={menuId}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={`navbar__mobile ${isOpen ? 'navbar__mobile--open' : ''}`}
        hidden={!isOpen}
      >
        <nav aria-label="Mobile">
          <ul className="navbar__mobile-links">
            {NAV_LINKS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                  }
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Button to="/quote" variant="primary" className="navbar__mobile-cta">
                Get a Quote
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
