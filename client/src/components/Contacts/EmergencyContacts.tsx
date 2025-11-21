import React, { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isEmergency: boolean;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Kenya Police', phone: '999', relationship: 'Emergency Services', isEmergency: true },
    { id: '2', name: 'Ambulance', phone: '999', relationship: 'Emergency Services', isEmergency: true },
    { id: '3', name: 'Fire Department', phone: '999', relationship: 'Emergency Services', isEmergency: true }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ 
    name: '', 
    phone: '', 
    relationship: '', 
    isEmergency: false 
  });

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        ...newContact,
        id: Date.now().toString()
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', phone: '', relationship: '', isEmergency: false });
      setShowAddForm(false);
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'white', 
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>📞 Emergency Contacts</h1>
        <p style={{ color: '#666', margin: 0 }}>Manage your emergency contacts and quick dial numbers</p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ➕ Add Emergency Contact
        </button>
      </div>

      {showAddForm && (
        <div style={{
          padding: '20px',
          background: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#333', margin: '0 0 15px 0' }}>Add New Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Contact Name"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
            <input
              type="tel"
              placeholder="Phone Number (e.g., +254 712 345 678)"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
            <input
              type="text"
              placeholder="Relationship"
              value={newContact.relationship}
              onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={newContact.isEmergency}
                onChange={(e) => setNewContact({...newContact, isEmergency: e.target.checked})}
              />
              Emergency Contact (Always show at top)
            </label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={addContact}
                style={{
                  padding: '10px 20px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Save Contact
              </button>
              <button
                onClick={() => setShowAddForm(false)}
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
        </div>
      )}

      <div>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          Your Contacts ({contacts.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {contacts
            .sort((a, b) => (a.isEmergency === b.isEmergency) ? 0 : a.isEmergency ? -1 : 1)
            .map(contact => (
            <div
              key={contact.id}
              style={{
                padding: '15px',
                border: '2px solid',
                borderColor: contact.isEmergency ? '#ef4444' : '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: contact.isEmergency ? '#fef2f2' : '#f0f9ff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: contact.isEmergency ? '#ef4444' : '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {contact.name}
                    {contact.isEmergency && <span style={{ color: '#ef4444', marginLeft: '5px' }}>🚨 EMERGENCY</span>}
                  </div>
                  <div style={{ color: '#6b7280' }}>{contact.relationship}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#374151' }}>
                    {contact.phone}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => callContact(contact.phone)}
                  style={{
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  📞 Call
                </button>
                {!contact.isEmergency && (
                  <button
                    onClick={() => removeContact(contact.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        background: '#fffbeb',
        borderRadius: '8px',
        border: '1px solid #fcd34d'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 10px 0' }}>🚨 Kenya Emergency Services</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => callContact('999')}
            style={{
              padding: '10px 15px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚔 Police (999)
          </button>
          <button
            onClick={() => callContact('999')}
            style={{
              padding: '10px 15px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚑 Ambulance (999)
          </button>
          <button
            onClick={() => callContact('999')}
            style={{
              padding: '10px 15px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚒 Fire (999)
          </button>
          <button
            onClick={() => callContact('119')}
            style={{
              padding: '10px 15px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🏥 AAR Insurance (119)
          </button>
        </div>
        <p style={{ color: '#92400e', fontSize: '12px', margin: '10px 0 0 0' }}>
          <strong>Note:</strong> In Kenya, dial 999 for all emergency services (Police, Ambulance, Fire)
        </p>
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        background: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <h4 style={{ color: '#0369a1', margin: '0 0 10px 0' }}>🇰🇪 Additional Kenya Resources</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#374151' }}>
          <div>
            <strong>Gender Violence:</strong> 1195
          </div>
          <div>
            <strong>Child Protection:</strong> 116
          </div>
          <div>
            <strong>Mental Health:</strong> 1199
          </div>
          <div>
            <strong>Red Cross:</strong> 1199
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
