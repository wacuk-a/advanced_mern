import React from 'react';

const EvidenceRecorderPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>📷 Evidence Recorder</h2>
      
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          Document incidents discreetly with photos and notes
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button style={{
            padding: '15px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            📸 Take Photo
          </button>
          
          <button style={{
            padding: '15px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            🎥 Record Video
          </button>
          
          <button style={{
            padding: '15px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            📝 Add Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceRecorderPage;
