const API_BASE = import.meta.env.VITE_API_URL || 'https://safekenya-server.onrender.com/api';

export const simpleApi = {
  // Emergency
  activatePanic: () => fetch(`${API_BASE}/panic/activate`, { method: 'POST' }).then(r => r.json()),
  
  // Safe Places
  getSafehouses: () => fetch(`${API_BASE}/safehouses/nearby`).then(r => r.json()),
  
  // Evidence
  saveAudio: (data: any) => fetch(`${API_BASE}/evidence/audio`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  savePhoto: (data: any) => fetch(`${API_BASE}/evidence/photo`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  saveVideo: (data: any) => fetch(`${API_BASE}/evidence/video`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  // Emergency Contacts
  getEmergencyContacts: () => fetch(`${API_BASE}/emergency/contacts`).then(r => r.json()),
  
  // Safety Plans
  getSafetyPlans: () => fetch(`${API_BASE}/safetyplans`).then(r => r.json()),
  
  saveSafetyPlan: (data: any) => fetch(`${API_BASE}/safetyplans`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
};
