import React, { useState } from 'react';

const LocationSharing: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string>('');

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsSharing(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setIsSharing(false);
        
        // Simulate sharing with emergency contacts
        setTimeout(() => {
          alert(`📍 Location shared with emergency services!\nLatitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}`);
        }, 1000);
      },
      (error) => {
        setIsSharing(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const shareWithContacts = () => {
    if (location) {
      // Simulate sharing with trusted contacts
      const message = `🚨 Emergency Location Shared\n📍 https://maps.google.com/?q=${location.lat},${location.lng}`;
      alert(`Location shared with trusted contacts:\n\n${message}`);
    } else {
      alert('Please get your location first.');
    }
  };

  return (
    <div className="location-sharing" style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>📍 Share Your Location</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Share your current location with emergency services and trusted contacts
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {location && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#0369a1', margin: '0 0 10px 0' }}>📍 Current Location</h4>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Latitude:</strong> {location.lat.toFixed(6)}
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Longitude:</strong> {location.lng.toFixed(6)}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={getCurrentLocation}
          disabled={isSharing}
          style={{
            padding: '15px',
            backgroundColor: isSharing ? '#94a3b8' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isSharing ? 'not-allowed' : 'pointer'
          }}
        >
          {isSharing ? '🔄 Getting Location...' : '📍 Get My Location'}
        </button>

        <button
          onClick={shareWithContacts}
          disabled={!location}
          style={{
            padding: '15px',
            backgroundColor: !location ? '#94a3b8' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: !location ? 'not-allowed' : 'pointer'
          }}
        >
          📤 Share with Trusted Contacts
        </button>

        <button
          onClick={() => window.open('https://maps.google.com', '_blank')}
          style={{
            padding: '15px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🗺️ Open Maps
        </button>
      </div>

      <div style={{ marginTop: '25px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
        <h4 style={{ color: '#475569', margin: '0 0 10px 0' }}>How it works:</h4>
        <ul style={{ color: '#64748b', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
          <li>Get your current GPS location</li>
          <li>Share with emergency services (999)</li>
          <li>Share with your trusted contacts</li>
          <li>Open in Google Maps for navigation</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationSharing;
