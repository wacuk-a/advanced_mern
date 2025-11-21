import React, { useState, useEffect } from 'react';

interface SafeLocation {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'shelter' | 'public' | 'business';
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  phone: string;
  hours: string;
  safetyRating: number;
}

interface Route {
  id: string;
  start: string;
  end: string;
  distance: number;
  time: number;
  safetyScore: number;
  instructions: string[];
  warnings: string[];
}

const SafeRoutes: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [destination, setDestination] = useState('');
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Kenyan locations data
  useEffect(() => {
    const kenyanLocations: SafeLocation[] = [
      {
        id: '1',
        name: 'Central Police Station',
        type: 'police',
        address: 'University Way, Nairobi CBD',
        latitude: -1.2833,
        longitude: 36.8167,
        distance: 0.8,
        phone: '+254 20 211 111',
        hours: '24/7',
        safetyRating: 5
      },
      {
        id: '2',
        name: 'Kenyatta National Hospital',
        type: 'hospital',
        address: 'Hospital Rd, Nairobi',
        latitude: -1.3043,
        longitude: 36.8057,
        distance: 1.2,
        phone: '+254 20 272 6300',
        hours: '24/7',
        safetyRating: 5
      },
      {
        id: '3',
        name: 'Nairobi Women\'s Hospital',
        type: 'hospital',
        address: 'Argwings Kodhek Rd, Nairobi',
        latitude: -1.2921,
        longitude: 36.7754,
        distance: 1.5,
        phone: '+254 730 735 000',
        hours: '24/7',
        safetyRating: 4
      },
      {
        id: '4',
        name: 'Nairobi Central Library',
        type: 'public',
        address: 'Moi Avenue, Nairobi CBD',
        latitude: -1.2830,
        longitude: 36.8220,
        distance: 0.9,
        phone: '+254 20 222 8416',
        hours: '8 AM - 8 PM',
        safetyRating: 4
      },
      {
        id: '5',
        name: 'Sarova Panafric Hotel',
        type: 'business',
        address: 'Valley Road, Nairobi',
        latitude: -1.2920,
        longitude: 36.8030,
        distance: 1.1,
        phone: '+254 20 271 4444',
        hours: '24/7',
        safetyRating: 4
      },
      {
        id: '6',
        name: 'Nakumatt Junction',
        type: 'business',
        address: 'Ngong Rd, Nairobi',
        latitude: -1.3000,
        longitude: 36.7800,
        distance: 2.1,
        phone: '+254 20 386 0000',
        hours: '6 AM - 11 PM',
        safetyRating: 3
      }
    ];
    setSafeLocations(kenyanLocations);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setIsLoading(false);
        alert(`Location found! Latitude: ${location.lat.toFixed(6)}, Longitude: ${location.lng.toFixed(6)}`);
      },
      (error) => {
        setIsLoading(false);
        alert('Unable to get your location. Using Nairobi CBD as default.');
        // Use Nairobi CBD as default
        setUserLocation({ lat: -1.2921, lng: 36.8219 });
      }
    );
  };

  const findSafeRoutes = () => {
    if (!destination.trim()) {
      alert('Please enter a destination');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const kenyanRoutes: Route[] = [
        {
          id: '1',
          start: 'Your Location',
          end: destination,
          distance: 2.5,
          time: 35,
          safetyScore: 85,
          instructions: [
            'Head north on Kenyatta Avenue',
            'Turn right on Moi Avenue',
            'Continue for 1.2 km past Central Park',
            'Turn left on Haile Selassie Avenue',
            'Arrive at your destination'
          ],
          warnings: [
            'Well-lit streets with police patrols',
            'High pedestrian traffic during day',
            'Security cameras on major intersections'
          ]
        },
        {
          id: '2',
          start: 'Your Location',
          end: destination,
          distance: 2.8,
          time: 42,
          safetyScore: 92,
          instructions: [
            'Head east on Uhuru Highway',
            'Turn left on University Way',
            'Pass by Central Police Station',
            'Continue for 1.5 km',
            'Turn right on Tom Mboya Street'
          ],
          warnings: [
            'Route passes Central Police Station',
            'Excellent lighting on major highways',
            'Emergency call boxes available'
          ]
        },
        {
          id: '3',
          start: 'Your Location',
          end: destination,
          distance: 2.3,
          time: 32,
          safetyScore: 78,
          instructions: [
            'Head west on Waiyaki Way',
            'Take shortcut through Westlands',
            'Turn right on Chiromo Road',
            'Arrive at destination'
          ],
          warnings: [
            'Westlands area has moderate traffic',
            'Good lighting in commercial areas',
            'Stay on main roads after dark'
          ]
        }
      ];
      
      setRoutes(kenyanRoutes);
      setIsLoading(false);
    }, 2000);
  };

  const startNavigation = (route: Route) => {
    setSelectedRoute(route);
    alert(`Starting navigation to: ${route.end}\\n\\nSafety Score: ${route.safetyScore}/100\\nEstimated Time: ${route.time} minutes`);
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'police': return '🚔';
      case 'hospital': return '🏥';
      case 'shelter': return '🏠';
      case 'public': return '🏛️';
      case 'business': return '🏪';
      default: return '📍';
    }
  };

  const getSafetyColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#f59e0b';
    if (score >= 70) return '#ef4444';
    return '#dc2626';
  };

  const getSafetyLevel = (score: number) => {
    if (score >= 90) return 'Very Safe';
    if (score >= 80) return 'Safe';
    if (score >= 70) return 'Moderate';
    return 'Caution';
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'white', 
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>🗺️ Safe Routes & Navigation</h1>
        <p style={{ color: '#666', margin: 0 }}>Find safe paths through Nairobi with real-time safety information</p>
      </div>

      {/* Location Setup */}
      <div style={{
        padding: '20px',
        background: '#f0f9ff',
        border: '2px solid #bae6fd',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#0369a1', margin: '0 0 15px 0' }}>📍 Setup Your Location</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Your Current Location
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                style={{
                  padding: '12px 20px',
                  background: isLoading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? '🔄 Getting Location...' : '📍 Use My Location'}
              </button>
              {userLocation && (
                <div style={{ 
                  padding: '10px 15px', 
                  background: '#dbeafe', 
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#1e40af'
                }}>
                  Location Set ✅
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Destination *
            </label>
            <input
              type="text"
              placeholder="Enter Nairobi destination (e.g., Westgate Mall, JKIA)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <button
          onClick={findSafeRoutes}
          disabled={!destination.trim() || isLoading}
          style={{
            padding: '12px 30px',
            background: (!destination.trim() || isLoading) ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: (!destination.trim() || isLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '🔄 Finding Safe Routes...' : '🔍 Find Safe Routes'}
        </button>
      </div>

      {/* Safe Locations Nearby */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#333', margin: '0 0 15px 0' }}>🏠 Safe Locations in Nairobi</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          {safeLocations.map(location => (
            <div
              key={location.id}
              style={{
                padding: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                background: '#f9fafb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{getLocationTypeIcon(location.type)}</span>
                  <div>
                    <h4 style={{ color: '#1f2937', margin: '0 0 5px 0', fontSize: '16px' }}>{location.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        padding: '2px 8px', 
                        background: '#e5e7eb',
                        color: '#4b5563',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {location.type.toUpperCase()}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        {location.distance} km away
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    padding: '4px 8px', 
                    background: location.safetyRating >= 4 ? '#10b981' : '#f59e0b',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    Safety: {location.safetyRating}/5
                  </div>
                </div>
              </div>

              <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '10px' }}>
                {location.address}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
                <span>📞 {location.phone}</span>
                <span>🕒 {location.hours}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => window.open(`tel:${location.phone}`, '_self')}
                  style={{
                    padding: '6px 12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Call
                </button>
                <button
                  onClick={() => window.open(`https://maps.google.com?q=${location.latitude},${location.longitude}`, '_blank')}
                  style={{
                    padding: '6px 12px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  View Map
                </button>
                <button
                  onClick={() => alert(`Adding ${location.name} to your route...`)}
                  style={{
                    padding: '6px 12px',
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Add to Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Routes */}
      {routes.length > 0 && (
        <div>
          <h3 style={{ color: '#333', margin: '0 0 20px 0' }}>
            🛣️ Safe Routes to {destination} ({routes.length} found)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {routes.map(route => (
              <div
                key={route.id}
                style={{
                  padding: '20px',
                  border: '3px solid',
                  borderColor: getSafetyColor(route.safetyScore),
                  borderRadius: '10px',
                  background: '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h4 style={{ color: '#1f2937', margin: '0 0 10px 0', fontSize: '18px' }}>
                      Route {route.id} - {getSafetyLevel(route.safetyScore)}
                    </h4>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: '#6b7280' }}>📏</span>
                        <span style={{ color: '#374151', fontWeight: 'bold' }}>{route.distance} km</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: '#6b7280' }}>⏱️</span>
                        <span style={{ color: '#374151', fontWeight: 'bold' }}>{route.time} min</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: '#6b7280' }}>🛡️</span>
                        <span style={{ 
                          color: getSafetyColor(route.safetyScore), 
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {route.safetyScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startNavigation(route)}
                    style={{
                      padding: '10px 20px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🚀 Start Navigation
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h5 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '14px' }}>📍 Turn-by-Turn</h5>
                    <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4b5563' }}>
                      {route.instructions.map((instruction, index) => (
                        <li key={index} style={{ marginBottom: '8px' }}>{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h5 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '14px' }}>⚠️ Safety Notes</h5>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4b5563' }}>
                      {route.warnings.map((warning, index) => (
                        <li key={index} style={{ marginBottom: '8px' }}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Active */}
      {selectedRoute && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 1000,
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#10b981', margin: '0 0 15px 0' }}>🧭 Navigation Active</h3>
          <p style={{ color: '#4b5563', margin: '0 0 20px 0' }}>
            Navigating to: <strong>{selectedRoute.end}</strong>
          </p>
          <div style={{ 
            padding: '15px', 
            background: '#f0f9ff', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Next Instruction:</p>
            <p style={{ margin: 0, color: '#1e40af' }}>{selectedRoute.instructions[0]}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => setSelectedRoute(null)}
              style={{
                padding: '10px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ❌ Stop Navigation
            </button>
            <button
              onClick={() => alert('Sharing your route and ETA with emergency contacts...')}
              style={{
                padding: '10px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📤 Share Route
            </button>
          </div>
        </div>
      )}

      {/* Safety Tips */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: '#fffbeb',
        borderRadius: '10px',
        border: '2px solid #fcd34d'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 15px 0' }}>💡 Nairobi Safety Tips</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ fontSize: '14px', color: '#92400e' }}>
            • <strong>Use well-lit main roads</strong> like Uhuru Highway and Moi Avenue
          </div>
          <div style={{ fontSize: '14px', color: '#92400e' }}>
            • <strong>Avoid shortcuts</strong> through unknown residential areas after dark
          </div>
          <div style={{ fontSize: '14px', color: '#92400e' }}>
            • <strong>Keep phone charged</strong> - use Safaricom emergency services: *999#
          </div>
          <div style={{ fontSize: '14px', color: '#92400e' }}>
            • <strong>Travel in groups</strong> when possible in CBD areas
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeRoutes;
