import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/admin/DashboardCard';
import InquiryFilters from '../../components/admin/InquiryFilters';
import InquiryTable from '../../components/admin/InquiryTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import {
  fetchDashboardMeta,
  fetchInquiries,
  fetchInquiryStats,
} from '../../services/adminApi';
import usePageTitle from '../../hooks/usePageTitle';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  usePageTitle('Dashboard');

  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [meta, setMeta] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [inquiryStats, dashboardMeta, recent] = await Promise.all([
        fetchInquiryStats(),
        fetchDashboardMeta(),
        fetchInquiries({ status: 'all', page: 1, limit: 8 }),
      ]);

      setStats(inquiryStats);
      setMeta(dashboardMeta);
      setInquiries(recent.inquiries);
      setStatusFilter('all');
    } catch (err) {
      setError(err.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleFilterChange = async (nextStatus) => {
    setStatusFilter(nextStatus);
    setListLoading(true);
    setError(null);

    try {
      const recent = await fetchInquiries({
        status: nextStatus,
        page: 1,
        limit: 8,
      });
      setInquiries(recent.inquiries);
    } catch (err) {
      setError(err.message || 'Unable to load inquiries.');
    } finally {
      setListLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading dashboard…" />;
  }

  if (error && !stats) {
    return <ErrorMessage message={error} onRetry={loadDashboard} />;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <Link to="/admin/inquiries" className="admin-dashboard__link">
          View all inquiries
        </Link>
      </header>

      <div className="admin-dashboard__cards">
        <DashboardCard label="Total Inquiries" value={stats?.total ?? 0} />
        <DashboardCard
          label="New Inquiries"
          value={stats?.newInquiries ?? 0}
          hint="Awaiting first response"
        />
        <DashboardCard
          label="Upcoming Weddings"
          value={stats?.upcomingWeddings ?? 0}
          hint="Confirmed pipeline dates ahead"
        />
        <DashboardCard label="Services" value={meta?.services ?? 0} />
        <DashboardCard label="Packages" value={meta?.packages ?? 0} />
      </div>

      <section className="admin-dashboard__recent" aria-labelledby="recent-inquiries-heading">
        <div className="admin-dashboard__recent-head">
          <h2 id="recent-inquiries-heading">Recent Inquiries</h2>
          <InquiryFilters value={statusFilter} onChange={handleFilterChange} />
        </div>

        {error ? <ErrorMessage message={error} /> : null}
        {listLoading ? (
          <LoadingSpinner label="Loading inquiries…" />
        ) : (
          <InquiryTable inquiries={inquiries} showViewLink />
        )}
      </section>
    </div>
  );
}

export default AdminDashboardPage;
