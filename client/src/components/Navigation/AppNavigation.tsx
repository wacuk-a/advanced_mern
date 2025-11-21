import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AppNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Home', icon: '🏠' },
    { path: '/safety-plan', label: '🛡️ Safety', icon: '🛡️' },
    { path: '/emergency-contacts', label: '📞 Emergency', icon: '📞' },
    { path: '/evidence-recorder', label: '📷 Evidence', icon: '📷' },
    { path: '/safety-assessment', label: '📊 Assessment', icon: '📊' },
    { path: '/location-sharing', label: '📍 Location', icon: '📍' }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '10px 0',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: location.pathname === item.path ? '#3b82f6' : '#64748b',
              fontSize: '12px',
              fontWeight: location.pathname === item.path ? 'bold' : 'normal'
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AppNavigation;
