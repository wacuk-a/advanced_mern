import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePanicStore } from '../store/panicStore';
import { jsonrpc } from '../utils/jsonrpc';
import './Dashboard.css';

interface DashboardStats {
  activePanicEvents?: number;
  recentReports?: number;
  availableSafehouses?: number;
  emergencyContacts?: number;
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { activeEvent } = usePanicStore();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load dashboard statistics
      const [safehouses, reports] = await Promise.all([
        jsonrpc.call('safehouse.list', {}).catch(() => ({ safehouses: [] })),
        jsonrpc.call('reporting.getReports', { limit: 5 }).catch(() => ({ reports: [] }))
      ]);

      setStats({
        availableSafehouses: safehouses.safehouses?.length || 0,
        recentReports: reports.reports?.length || 0,
        emergencyContacts: user?.emergencyContacts?.length || 0
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        {user && <p>Welcome, {user.email || 'User'}</p>}
        {!isAuthenticated && <p>Anonymous Session Active</p>}
      </div>

      {activeEvent && (
        <div className="dashboard-alert">
          <h2>🚨 Active Emergency</h2>
          <p>Panic button is currently active. Your location is being shared.</p>
          <Link to="/" className="alert-link">View Details</Link>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-value">{stats.availableSafehouses || 0}</div>
          <div className="stat-label">Available Safehouses</div>
          <Link to="/safehouses" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{stats.recentReports || 0}</div>
          <div className="stat-label">Recent Reports</div>
          <Link to="/reports" className="stat-link">View Reports</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-value">{stats.emergencyContacts || 0}</div>
          <div className="stat-label">Emergency Contacts</div>
          <Link to="/settings" className="stat-link">Manage</Link>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/reports" className="quick-action-card">
            <div className="action-icon">📝</div>
            <h3>Make a Report</h3>
            <p>Report an incident with AI-powered analysis</p>
          </Link>

          <Link to="/safehouses" className="quick-action-card">
            <div className="action-icon">🏠</div>
            <h3>Find Safehouse</h3>
            <p>Search for available safehouses nearby</p>
          </Link>

          <Link to="/settings" className="quick-action-card">
            <div className="action-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure safety features and preferences</p>
          </Link>

          {user?.role === 'counselor' || user?.role === 'admin' ? (
            <Link to="/counselor" className="quick-action-card">
              <div className="action-icon">👥</div>
              <h3>Counselor Dashboard</h3>
              <p>Manage cases and monitor alerts</p>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="dashboard-safety-info">
        <h2>Safety Information</h2>
        <div className="safety-tips">
          <div className="safety-tip">
            <strong>Panic Button:</strong> Press the panic button at any time to activate emergency alerts.
          </div>
          <div className="safety-tip">
            <strong>Quick Exit:</strong> Press Escape twice quickly to exit the app and clear history.
          </div>
          <div className="safety-tip">
            <strong>Safe Mode:</strong> Enable incognito mode in settings to hide sensitive content.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

