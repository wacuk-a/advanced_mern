import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface TopNavProps {
  onSettingsClick: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ onSettingsClick }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      background: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
          🛡️ SafeRoute
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ textDecoration: 'none', color: isActive('/') ? '#3b82f6' : '#666', fontWeight: isActive('/') ? 'bold' : 'normal', fontSize: '14px' }}>
          🏠 Home
        </Link>
        <Link to="/location-sharing" style={{ textDecoration: 'none', color: isActive('/location-sharing') ? '#3b82f6' : '#666', fontWeight: isActive('/location-sharing') ? 'bold' : 'normal', fontSize: '14px' }}>
          📍 Location
        </Link>
        <Link to="/emergency-contacts" style={{ textDecoration: 'none', color: isActive('/emergency-contacts') ? '#3b82f6' : '#666', fontWeight: isActive('/emergency-contacts') ? 'bold' : 'normal', fontSize: '14px' }}>
          📞 Contacts
        </Link>
        <Link to="/safety-plans" style={{ textDecoration: 'none', color: isActive('/safety-plans') ? '#3b82f6' : '#666', fontWeight: isActive('/safety-plans') ? 'bold' : 'normal', fontSize: '14px' }}>
          🛡️ Plans
        </Link>
        <Link to="/incident-reporting" style={{ textDecoration: 'none', color: isActive('/incident-reporting') ? '#3b82f6' : '#666', fontWeight: isActive('/incident-reporting') ? 'bold' : 'normal', fontSize: '14px' }}>
          🚨 Reports
        </Link>
        <Link to="/safe-routes" style={{ textDecoration: 'none', color: isActive('/safe-routes') ? '#3b82f6' : '#666', fontWeight: isActive('/safe-routes') ? 'bold' : 'normal', fontSize: '14px' }}>
          🗺️ Routes
        </Link>
        <Link to="/resource-directory" style={{ textDecoration: 'none', color: isActive('/resource-directory') ? '#3b82f6' : '#666', fontWeight: isActive('/resource-directory') ? 'bold' : 'normal', fontSize: '14px' }}>
          📚 Resources
        </Link>
        <Link to="/emergency-codes" style={{ textDecoration: 'none', color: isActive('/emergency-codes') ? '#3b82f6' : '#666', fontWeight: isActive('/emergency-codes') ? 'bold' : 'normal', fontSize: '14px' }}>
          🆘 Codes
        </Link>
        <Link to="/audio-evidence" style={{ textDecoration: 'none', color: isActive('/audio-evidence') ? '#3b82f6' : '#666', fontWeight: isActive('/audio-evidence') ? 'bold' : 'normal', fontSize: '14px' }}>
          🎤 Audio
        </Link>
        <button onClick={onSettingsClick} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>
          ⚙️
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
