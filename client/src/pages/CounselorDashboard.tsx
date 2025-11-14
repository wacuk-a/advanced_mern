import { useEffect, useState } from 'react';
import { jsonrpc } from '../utils/jsonrpc';
import { useSocket } from '../utils/useSocket';
import './CounselorDashboard.css';

interface PanicAlert {
  eventId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  riskLevel: string;
  triggerType: string;
  timestamp: Date;
}

interface Case {
  _id: string;
  reportType: string;
  riskLevel: string;
  status: string;
  createdAt: Date;
}

const CounselorDashboard = () => {
  const [panicAlerts, setPanicAlerts] = useState<PanicAlert[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    loadDashboardData();
    setupSocketListeners();
  }, []);

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('panic:activated', (alert: PanicAlert) => {
      setPanicAlerts(prev => [alert, ...prev]);
    });

    socket.on('panic:location_update', (update: any) => {
      setPanicAlerts(prev =>
        prev.map(alert =>
          alert.eventId === update.eventId
            ? { ...alert, location: update.location }
            : alert
        )
      );
    });

    socket.on('panic:deactivated', (data: any) => {
      setPanicAlerts(prev =>
        prev.filter(alert => alert.eventId !== data.eventId)
      );
    });
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, casesData, alerts] = await Promise.all([
        jsonrpc.call('counselor.getDashboard', {}),
        jsonrpc.call('counselor.getCases', { limit: 10 }),
        jsonrpc.call('counselor.getPanicAlerts', { active: true })
      ]);

      setDashboardData(dashboard);
      setCases(casesData.cases || []);
      setPanicAlerts(alerts.alerts || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveCase = async (caseId: string) => {
    try {
      await jsonrpc.call('counselor.updateCase', {
        caseId,
        status: 'resolved'
      });
      loadDashboardData();
    } catch (error: any) {
      alert(`Failed to resolve case: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="counselor-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="counselor-dashboard">
      <div className="counselor-header">
        <h1>Counselor Dashboard</h1>
        <p>Monitor and manage cases in real-time</p>
      </div>

      {panicAlerts.length > 0 && (
        <div className="panic-alerts-section">
          <h2>🚨 Active Panic Alerts</h2>
          <div className="panic-alerts-grid">
            {panicAlerts.map((alert) => (
              <div key={alert.eventId} className={`panic-alert-card risk-${alert.riskLevel}`}>
                <div className="alert-header">
                  <h3>Emergency Alert</h3>
                  <span className="risk-badge">{alert.riskLevel.toUpperCase()}</span>
                </div>
                <div className="alert-info">
                  <p><strong>Trigger:</strong> {alert.triggerType}</p>
                  <p><strong>Location:</strong> {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}</p>
                  <p><strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <div className="alert-actions">
                  <button className="btn-view">View Details</button>
                  <button className="btn-resolve">Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-value">{panicAlerts.length}</div>
          <div className="stat-label">Active Alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{cases.length}</div>
          <div className="stat-label">Active Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{dashboardData?.pendingCases || 0}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{dashboardData?.resolvedCases || 0}</div>
          <div className="stat-label">Resolved Today</div>
        </div>
      </div>

      <div className="cases-section">
        <h2>Recent Cases</h2>
        <div className="cases-list">
          {cases.length === 0 ? (
            <div className="no-cases">
              <p>No active cases at this time.</p>
            </div>
          ) : (
            cases.map((caseItem) => (
              <div key={caseItem._id} className="case-card">
                <div className="case-header">
                  <h3>{caseItem.reportType}</h3>
                  <span className={`status-badge status-${caseItem.status}`}>
                    {caseItem.status}
                  </span>
                </div>
                <div className="case-info">
                  <p><strong>Risk Level:</strong> {caseItem.riskLevel}</p>
                  <p><strong>Created:</strong> {new Date(caseItem.createdAt).toLocaleString()}</p>
                </div>
                <div className="case-actions">
                  <button className="btn-view">View Details</button>
                  {caseItem.status !== 'resolved' && (
                    <button
                      className="btn-resolve"
                      onClick={() => handleResolveCase(caseItem._id)}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="safehouse-management">
        <h2>Safehouse Management</h2>
        <div className="safehouse-actions">
          <button className="btn-primary">View All Safehouses</button>
          <button className="btn-primary">Update Availability</button>
          <button className="btn-primary">Manage Resources</button>
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboard;

