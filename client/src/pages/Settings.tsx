import { useState, useEffect } from 'react';
import { jsonrpc } from '../utils/jsonrpc';
import { useAuthStore } from '../store/authStore';
import { disguiseApp, exitApp } from '../utils/safeMode';
import './Settings.css';

interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

const Settings = () => {
  const { user } = useAuthStore();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [safeModeEnabled, setSafeModeEnabled] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [quickExitEnabled, setQuickExitEnabled] = useState(true);
  const [appDisguise, setAppDisguise] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      if (user) {
        const profile = await jsonrpc.call('user.getProfile', {});
        setEmergencyContacts(profile.emergencyContacts || []);
      }
      
      // Load safe mode settings from localStorage
      setSafeModeEnabled(localStorage.getItem('safeModeEnabled') === 'true');
      setIncognitoMode(localStorage.getItem('incognitoMode') === 'true');
      setQuickExitEnabled(localStorage.getItem('quickExitEnabled') !== 'false');
      setAppDisguise(localStorage.getItem('appDisguise') === 'true');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      name: '',
      phone: '',
      email: '',
      relationship: ''
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const handleUpdateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  const handleSaveContacts = async () => {
    try {
      await jsonrpc.call('user.updateProfile', {
        emergencyContacts: emergencyContacts
      });
      alert('Emergency contacts saved successfully');
    } catch (error: any) {
      alert(`Failed to save contacts: ${error.message}`);
    }
  };

  const handleToggleSafeMode = (enabled: boolean) => {
    setSafeModeEnabled(enabled);
    localStorage.setItem('safeModeEnabled', enabled.toString());
  };

  const handleToggleIncognito = (enabled: boolean) => {
    setIncognitoMode(enabled);
    localStorage.setItem('incognitoMode', enabled.toString());
    if (enabled) {
      document.body.style.filter = 'blur(10px)';
    } else {
      document.body.style.filter = '';
    }
  };

  const handleToggleQuickExit = (enabled: boolean) => {
    setQuickExitEnabled(enabled);
    localStorage.setItem('quickExitEnabled', enabled.toString());
  };

  const handleToggleDisguise = (enabled: boolean) => {
    setAppDisguise(enabled);
    localStorage.setItem('appDisguise', enabled.toString());
    if (enabled) {
      disguiseApp();
    }
  };

  const handleEmergencyWipe = async () => {
    if (confirm('Are you sure you want to wipe all data? This action cannot be undone.')) {
      try {
        await jsonrpc.call('user.emergencyWipe', {});
        exitApp();
      } catch (error: any) {
        alert(`Failed to wipe data: ${error.message}`);
      }
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure your safety and privacy settings</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Emergency Contacts</h2>
          <p className="section-description">
            Add trusted contacts who will be notified in case of emergency
          </p>
          
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="contact-form">
              <input
                type="text"
                placeholder="Name"
                value={contact.name}
                onChange={(e) => handleUpdateContact(index, 'name', e.target.value)}
                className="contact-input"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={contact.phone}
                onChange={(e) => handleUpdateContact(index, 'phone', e.target.value)}
                className="contact-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={contact.email}
                onChange={(e) => handleUpdateContact(index, 'email', e.target.value)}
                className="contact-input"
              />
              <input
                type="text"
                placeholder="Relationship"
                value={contact.relationship}
                onChange={(e) => handleUpdateContact(index, 'relationship', e.target.value)}
                className="contact-input"
              />
            </div>
          ))}
          
          <div className="settings-actions">
            <button onClick={handleAddContact} className="btn-add">Add Contact</button>
            <button onClick={handleSaveContacts} className="btn-save">Save Contacts</button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Safe Mode & Digital Safety</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Quick Exit</h3>
              <p>Press Escape twice quickly to exit app and clear history</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={quickExitEnabled}
                onChange={(e) => handleToggleQuickExit(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Incognito Mode</h3>
              <p>Hide sensitive content when device is shared or inactive</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={incognitoMode}
                onChange={(e) => handleToggleIncognito(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>App Disguise</h3>
              <p>Disguise app as calculator or shopping app</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={appDisguise}
                onChange={(e) => handleToggleDisguise(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Safe Mode</h3>
              <p>Enable all safety features including screenshot prevention</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={safeModeEnabled}
                onChange={(e) => handleToggleSafeMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section danger-zone">
          <h2>Emergency Actions</h2>
          
          <div className="emergency-action">
            <h3>Emergency Data Wipe</h3>
            <p>Immediately delete all your data and exit the app</p>
            <button onClick={handleEmergencyWipe} className="btn-danger">
              Wipe All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

