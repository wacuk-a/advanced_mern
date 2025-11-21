import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const quickActions = [
    { path: '/emergency-contacts', icon: '📞', label: 'Emergency Call', color: '#ef4444' },
    { path: '/safety-plan', icon: '🛡️', label: 'Safety Plan', color: '#3b82f6' },
    { path: '/evidence-recorder', icon: '📷', label: 'Record Evidence', color: '#8b5cf6' },
    { path: '/safety-assessment', icon: '📊', label: 'Risk Assessment', color: '#f59e0b' }
  ];

  return (
    <div style={{ 
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          color: 'white', 
          margin: '20px 0 10px 0',
          fontSize: '28px'
        }}>
          🛡️ SafeKenya
        </h1>
        <p style={{ 
          color: 'rgba(255,255,255,0.8)',
          margin: 0
        }}>
          Domestic Violence Safety App
        </p>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '25px 15px',
              borderRadius: '15px',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ 
              fontSize: '32px',
              marginBottom: '10px',
              display: 'block'
            }}>
              {action.icon}
            </span>
            <span style={{ 
              color: action.color,
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#1e293b', margin: '0 0 15px 0' }}>App Features</h3>
        {[
          '🚪 Quick Exit - Instantly hide the app',
          '📍 Safe Locations - Police & shelters',
          '🎥 Discreet Evidence Recording',
          '📋 Personalized Safety Plans',
          '🔒 Local Storage - Your data stays private',
          '🇰🇪 Kenya-specific Resources'
        ].map((feature, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px',
            background: '#f8fafc',
            borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '15px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🚨 In Immediate Danger?</h4>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => window.open('tel:999', '_self')}
            style={{
              padding: '12px 20px',
              background: 'white',
              color: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📞 Call 999
          </button>
          <button 
            onClick={() => window.open('tel:1195', '_self')}
            style={{
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🛡️ Gender Violence 1195
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
