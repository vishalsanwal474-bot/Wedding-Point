import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoStructuredData from '../components/SeoStructuredData';
import RouteAnnouncer from '../components/RouteAnnouncer';
import './PublicLayout.css';

function PublicLayout() {
  return (
    <div className="public-layout">
      <SeoStructuredData />
      <RouteAnnouncer />
      <Navbar />
      <main id="main-content" className="public-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
