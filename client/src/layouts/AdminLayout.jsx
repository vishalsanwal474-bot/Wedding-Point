import { useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RouteAnnouncer from '../components/RouteAnnouncer';
import './AdminLayout.css';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/packages', label: 'Packages' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/settings', label: 'Settings' },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <RouteAnnouncer />
      <aside className={`admin-sidebar ${menuOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
            Wedding Point
          </Link>
          <p>Admin</p>
        </div>

        <nav aria-label="Admin">
          <ul className="admin-sidebar__nav">
            {ADMIN_LINKS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <p className="admin-sidebar__user">{user?.name || user?.email}</p>
          <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
            <LogOut size={16} aria-hidden="true" />
            Logout
          </button>
          <Link to="/" className="admin-sidebar__site">
            View website
          </Link>
        </div>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          className="admin-sidebar__backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className="admin-shell__main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="admin-topbar__title">Wedding Point Admin</p>
          <button type="button" className="admin-topbar__logout" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main id="main-content" className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminIndexRedirect() {
  return <Navigate to="/admin/dashboard" replace />;
}

export default AdminLayout;
