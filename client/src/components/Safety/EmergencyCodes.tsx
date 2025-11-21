import React, { useState } from 'react';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  codeWord: string;
  emergencyMessage: string;
}

const EmergencyCodes: React.FC = () => {
  const [contacts, setContacts] = useState<TrustedContact[]>([
    {
      id: '1',
      name: 'Sarah',
      phone: '+254712345678',
      codeWord: 'blue sky',
      emergencyMessage: 'I need help immediately. Please check on me.'
    }
  ]);

  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  const triggerEmergency = (contact: TrustedContact) => {
    // Send SMS with location
    const message = encodeURIComponent(`${contact.emergencyMessage} My location: https://maps.google.com`);
    window.open(`sms:${contact.phone}?body=${message}`, '_self');
    alert(`Emergency message sent to ${contact.name}`);
  };

  const checkCodeWord = () => {
    const contact = contacts.find(c => c.codeWord.toLowerCase() === codeInput.toLowerCase());
    if (contact) {
      triggerEmergency(contact);
      setCodeInput('');
      setShowCodeInput(false);
    } else {
      alert('No contact found with that code word.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>🆘 Emergency Code Words</h3>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Use code words to discreetly alert trusted contacts
      </p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowCodeInput(true)}
          style={{
            padding: '12px 24px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🚨 Enter Code Word
        </button>
      </div>

      {showCodeInput && (
        <div style={{
          padding: '20px',
          background: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#dc2626', margin: '0 0 15px 0' }}>Enter Code Word</h4>
          <input
            type="text"
            placeholder="Type your code word here..."
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              marginBottom: '10px'
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={checkCodeWord}
              style={{
                padding: '10px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Send Emergency Alert
            </button>
            <button
              onClick={() => {
                setShowCodeInput(false);
                setCodeInput('');
              }}
              style={{
                padding: '10px 20px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#333', margin: '0 0 15px 0' }}>Your Trusted Contacts</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {contacts.map(contact => (
            <div
              key={contact.id}
              style={{
                padding: '15px',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                background: '#f0f9ff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{contact.name}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{contact.phone}</div>
                  <div style={{ color: '#3b82f6', fontSize: '12px', marginTop: '5px' }}>
                    <strong>Code Word:</strong> "{contact.codeWord}"
                  </div>
                </div>
                <button
                  onClick={() => triggerEmergency(contact)}
                  style={{
                    padding: '8px 16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Test Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '15px',
        background: '#fffbeb',
        borderRadius: '8px',
        border: '1px solid #fcd34d'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 10px 0' }}>💡 How It Works</h4>
        <ul style={{ color: '#92400e', margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>Set up code words with trusted contacts</li>
          <li>If in danger, enter the code word discreetly</li>
          <li>Emergency message with your location is sent automatically</li>
          <li>Appears as normal conversation if someone is watching</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyCodes;
