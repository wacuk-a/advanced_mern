import React from 'react';

const SafetyPlanPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>🛡️ Safety Plan</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#334155', marginBottom: '15px' }}>Emergency Contacts</h3>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#64748b', marginBottom: '15px' }}>
            Add trusted contacts who can help in an emergency
          </p>
          <button style={{
            padding: '12px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            + Add Emergency Contact
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#334155', marginBottom: '15px' }}>Safe Locations</h3>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#64748b', marginBottom: '15px' }}>
            Identify safe places you can go in an emergency
          </p>
          <button style={{
            padding: '12px 20px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            📍 Find Safe Locations
          </button>
        </div>
      </div>

      <div style={{
        background: '#fffbeb',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #fcd34d'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 10px 0' }}>💡 Safety Tips</h4>
        <ul style={{ color: '#92400e', margin: 0, paddingLeft: '20px' }}>
          <li>Keep this safety plan in a secure location</li>
          <li>Practice your escape routes</li>
          <li>Have a code word with trusted contacts</li>
        </ul>
      </div>
    </div>
  );
};

export default SafetyPlanPage;
