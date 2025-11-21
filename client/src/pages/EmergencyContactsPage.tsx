import React from 'react';

const EmergencyContactsPage: React.FC = () => {
  const emergencyContacts = [
    { name: 'Police Emergency', number: '999', type: 'emergency' },
    { name: 'Gender Violence Hotline', number: '1195', type: 'emergency' },
    { name: 'Child Protection', number: '116', type: 'emergency' },
    { name: 'FIDA Kenya', number: '+254 20 374 3764', type: 'legal' },
    { name: 'Haven Safe House', number: '+254 722 205 883', type: 'shelter' }
  ];

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const getContactColor = (type: string) => {
    switch (type) {
      case 'emergency': return '#ef4444';
      case 'legal': return '#3b82f6';
      case 'shelter': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      paddingBottom: '80px',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>📞 Emergency Contacts</h2>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>
        Tap any number to call immediately
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        {emergencyContacts.map((contact, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: `2px solid ${getContactColor(contact.type)}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ 
                  color: '#1e293b',
                  margin: '0 0 5px 0',
                  fontSize: '18px'
                }}>
                  {contact.name}
                </h4>
                <span style={{
                  color: getContactColor(contact.type),
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {contact.number}
                </span>
              </div>
              
              <button
                onClick={() => handleCall(contact.number.replace(/\D/g, ''))}
                style={{
                  padding: '12px 20px',
                  background: getContactColor(contact.type),
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                📞 Call
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#fffbeb',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #fcd34d'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 10px 0' }}>💡 Emergency Tips</h4>
        <ul style={{ color: '#92400e', margin: 0, paddingLeft: '20px' }}>
          <li>Call 999 for immediate police assistance</li>
          <li>Use 1195 for gender-based violence support</li>
          <li>Save these numbers in your phone under discreet names</li>
          <li>If in immediate danger, use the Quick Exit button (🚪)</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyContactsPage;
