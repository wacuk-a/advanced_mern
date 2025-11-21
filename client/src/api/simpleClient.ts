const API_BASE = 'https://safekenya-server.onrender.com/api';

export const simpleApi = {
  // Emergency
  activatePanic: () => fetch(`${API_BASE}/panic`, { method: 'POST' }).then(r => r.json()),
  
  // Safe Places
  getSafehouses: () => fetch(`${API_BASE}/safehouses`).then(r => r.json()),
  
  // Evidence
  saveEvidence: (data: any) => fetch(`${API_BASE}/evidence`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  // Emergency Contacts
  getContacts: () => fetch(`${API_BASE}/contacts`).then(r => r.json())
};
