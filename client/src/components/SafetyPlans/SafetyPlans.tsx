import React, { useState } from 'react';

interface SafetyPlan {
  id: string;
  title: string;
  steps: string[];
  emergencyContacts: string[];
  safeLocations: string[];
  createdAt: string;
}

const SafetyPlans: React.FC = () => {
  const [plans, setPlans] = useState<SafetyPlan[]>([
    {
      id: '1',
      title: 'Nairobi CBD Commute Safety',
      steps: [
        'Call 999 immediately if threatened',
        'Share location with trusted contacts via SMS',
        'Move to nearest police station or well-lit business',
        'Use main roads like Kenyatta Avenue or Moi Avenue',
        'Avoid shortcuts through alleys after dark'
      ],
      emergencyContacts: ['Kenya Police (999)', 'Trusted Family Member'],
      safeLocations: ['Central Police Station', 'Sarova Panafric Hotel', 'Nakumatt Junction'],
      createdAt: '2024-01-15'
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<SafetyPlan, 'id' | 'createdAt'>>({
    title: '',
    steps: [''],
    emergencyContacts: [''],
    safeLocations: ['']
  });

  const addPlan = () => {
    if (newPlan.title) {
      const plan: SafetyPlan = {
        ...newPlan,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPlans([...plans, plan]);
      setNewPlan({ title: '', steps: [''], emergencyContacts: [''], safeLocations: [''] });
      setShowCreateForm(false);
    }
  };

  const removePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const addStep = () => {
    setNewPlan({ ...newPlan, steps: [...newPlan.steps, ''] });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...newPlan.steps];
    newSteps[index] = value;
    setNewPlan({ ...newPlan, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = newPlan.steps.filter((_, i) => i !== index);
    setNewPlan({ ...newPlan, steps: newSteps.length ? newSteps : [''] });
  };

  const addContact = () => {
    setNewPlan({ ...newPlan, emergencyContacts: [...newPlan.emergencyContacts, ''] });
  };

  const updateContact = (index: number, value: string) => {
    const newContacts = [...newPlan.emergencyContacts];
    newContacts[index] = value;
    setNewPlan({ ...newPlan, emergencyContacts: newContacts });
  };

  const removeContact = (index: number) => {
    const newContacts = newPlan.emergencyContacts.filter((_, i) => i !== index);
    setNewPlan({ ...newPlan, emergencyContacts: newContacts.length ? newContacts : [''] });
  };

  const addLocation = () => {
    setNewPlan({ ...newPlan, safeLocations: [...newPlan.safeLocations, ''] });
  };

  const updateLocation = (index: number, value: string) => {
    const newLocations = [...newPlan.safeLocations];
    newLocations[index] = value;
    setNewPlan({ ...newPlan, safeLocations: newLocations });
  };

  const removeLocation = (index: number) => {
    const newLocations = newPlan.safeLocations.filter((_, i) => i !== index);
    setNewPlan({ ...newPlan, safeLocations: newLocations.length ? newLocations : [''] });
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'white', 
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>🛡️ Safety Plans for Kenya</h1>
        <p style={{ color: '#666', margin: 0 }}>Create personalized safety plans for different situations in Kenya</p>
      </div>

      {/* Create Plan Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: '12px 24px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📝 Create New Safety Plan
        </button>
      </div>

      {/* Create Plan Form */}
      {showCreateForm && (
        <div style={{
          padding: '25px',
          background: '#faf5ff',
          border: '2px solid #e9d5ff',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#7c3aed', margin: '0 0 20px 0' }}>Create Kenya Safety Plan</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Plan Title
            </label>
            <input
              type="text"
              placeholder="e.g., Nairobi Commute Safety, Mombasa Travel Plan"
              value={newPlan.title}
              onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Steps */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Emergency Steps for Kenya
            </label>
            {newPlan.steps.map((step, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{index + 1}.</span>
                <input
                  type="text"
                  placeholder={`Step ${index + 1} (e.g., Call 999, go to police station)`}
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {newPlan.steps.length > 1 && (
                  <button
                    onClick={() => removeStep(index)}
                    style={{
                      padding: '8px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addStep}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ➕ Add Step
            </button>
          </div>

          {/* Emergency Contacts */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Kenya Emergency Contacts
            </label>
            {newPlan.emergencyContacts.map((contact, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Contact name/number (e.g., Police 999, +254...)"
                  value={contact}
                  onChange={(e) => updateContact(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {newPlan.emergencyContacts.length > 1 && (
                  <button
                    onClick={() => removeContact(index)}
                    style={{
                      padding: '8px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addContact}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ➕ Add Contact
            </button>
          </div>

          {/* Safe Locations */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Safe Locations in Kenya
            </label>
            {newPlan.safeLocations.map((location, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Safe location (e.g., Police station, hotel, shopping mall)"
                  value={location}
                  onChange={(e) => updateLocation(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {newPlan.safeLocations.length > 1 && (
                  <button
                    onClick={() => removeLocation(index)}
                    style={{
                      padding: '8px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addLocation}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ➕ Add Location
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={addPlan}
              style={{
                padding: '12px 24px',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              💾 Save Safety Plan
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              style={{
                padding: '12px 24px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Safety Plans List */}
      <div>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>
          Your Safety Plans ({plans.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              style={{
                padding: '20px',
                border: '2px solid #8b5cf6',
                borderRadius: '10px',
                background: '#faf5ff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h4 style={{ color: '#7c3aed', margin: 0, fontSize: '18px' }}>{plan.title}</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Created: {plan.createdAt}</span>
                  <button
                    onClick={() => removePlan(plan.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                {/* Steps */}
                <div>
                  <h5 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '14px' }}>🔄 Emergency Steps</h5>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4b5563' }}>
                    {plan.steps.map((step, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Contacts */}
                <div>
                  <h5 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '14px' }}>📞 Emergency Contacts</h5>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4b5563' }}>
                    {plan.emergencyContacts.map((contact, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>{contact}</li>
                    ))}
                  </ul>
                </div>

                {/* Locations */}
                <div>
                  <h5 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '14px' }}>🏠 Safe Locations</h5>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4b5563' }}>
                    {plan.safeLocations.map((location, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>{location}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button
                  onClick={() => alert(`Activating Kenya safety plan: ${plan.title}`)}
                  style={{
                    padding: '10px 20px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🚀 Activate This Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {plans.length === 0 && !showCreateForm && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>No safety plans created yet. Create your first Kenya-specific safety plan!</p>
        </div>
      )}

      {/* Kenya Safety Tips */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: '#fffbeb',
        borderRadius: '10px',
        border: '2px solid #fcd34d'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 15px 0' }}>💡 Kenya Safety Guidelines</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', fontSize: '14px', color: '#92400e' }}>
          <div>• <strong>Memorize 999</strong> for all emergencies (Police, Ambulance, Fire)</div>
          <div>• <strong>Use main roads</strong> in cities, avoid shortcuts after dark</div>
          <div>• <strong>Keep phone charged</strong> with Safaricom emergency credit</div>
          <div>• <strong>Know police stations</strong> along your regular routes</div>
          <div>• <strong>Travel in groups</strong> when possible in urban areas</div>
          <div>• <strong>Use registered taxis</strong> or ride-sharing services</div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPlans;
