import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout, { AdminIndexRedirect } from './layouts/AdminLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const QuotePage = lazy(() => import('./pages/QuotePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage')
);
const AdminInquiriesPage = lazy(() =>
  import('./pages/admin/AdminInquiriesPage')
);
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminPackagesPage = lazy(() => import('./pages/admin/AdminPackagesPage'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage'));
const AdminTestimonialsPage = lazy(() =>
  import('./pages/admin/AdminTestimonialsPage')
);
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <LoadingSpinner label="Loading page…" />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="packages" element={<PackagesPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="testimonials" element={<TestimonialsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="quote" element={<QuotePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route
                path="admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminIndexRedirect />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="inquiries" element={<AdminInquiriesPage />} />
                <Route path="services" element={<AdminServicesPage />} />
                <Route path="packages" element={<AdminPackagesPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="testimonials" element={<AdminTestimonialsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route
                  path="*"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
