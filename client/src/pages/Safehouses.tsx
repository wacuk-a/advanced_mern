import { useEffect, useState } from 'react';
import { jsonrpc } from '../utils/jsonrpc';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Safehouses.css';

interface Safehouse {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  capacity: {
    totalBeds: number;
    availableBeds: number;
  };
  resources: {
    food: { available: boolean };
    medical: { available: boolean };
    legal: { available: boolean };
    counseling: { available: boolean };
    transportation: { available: boolean };
  };
  availability: {
    isAvailable: boolean;
  };
  securityLevel: string;
}

const Safehouses = () => {
  const [safehouses, setSafehouses] = useState<Safehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSafehouse, setSelectedSafehouse] = useState<Safehouse | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    loadSafehouses();
  }, []);

  const loadSafehouses = async () => {
    try {
      setLoading(true);
      const response = await jsonrpc.call('safehouse.list', {});
      setSafehouses(response.safehouses || []);
    } catch (error) {
      console.error('Failed to load safehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (safehouseId: string) => {
    try {
      const response = await jsonrpc.call('safehouse.book', {
        safehouseId,
        checkInDate: new Date().toISOString()
      });
      alert('Booking request submitted. You will be contacted shortly.');
      setShowBooking(false);
      loadSafehouses();
    } catch (error: any) {
      alert(`Failed to book: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="safehouses-loading">
        <div className="spinner"></div>
        <p>Loading safehouses...</p>
      </div>
    );
  }

  return (
    <div className="safehouses-page">
      <div className="safehouses-header">
        <h1>Safehouse Network</h1>
        <p>Find available safehouses in your area</p>
      </div>

      <div className="safehouses-content">
        <div className="safehouses-list">
          {safehouses.length === 0 ? (
            <div className="no-safehouses">
              <p>No safehouses available at this time.</p>
              <p>Please check back later or contact emergency services.</p>
            </div>
          ) : (
            safehouses.map((safehouse) => (
              <div key={safehouse._id} className="safehouse-card">
                <div className="safehouse-header">
                  <h3>{safehouse.name}</h3>
                  <span className={`availability-badge ${safehouse.availability.isAvailable ? 'available' : 'unavailable'}`}>
                    {safehouse.availability.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="safehouse-address">
                  <p>{safehouse.address.street}</p>
                  <p>{safehouse.address.city}, {safehouse.address.state}</p>
                </div>

                <div className="safehouse-capacity">
                  <strong>Capacity:</strong> {safehouse.capacity.availableBeds} / {safehouse.capacity.totalBeds} beds available
                </div>

                <div className="safehouse-resources">
                  <div className="resource-tags">
                    {safehouse.resources.food.available && <span className="resource-tag">Food</span>}
                    {safehouse.resources.medical.available && <span className="resource-tag">Medical</span>}
                    {safehouse.resources.legal.available && <span className="resource-tag">Legal</span>}
                    {safehouse.resources.counseling.available && <span className="resource-tag">Counseling</span>}
                    {safehouse.resources.transportation.available && <span className="resource-tag">Transportation</span>}
                  </div>
                </div>

                <div className="safehouse-security">
                  <strong>Security Level:</strong> {safehouse.securityLevel}
                </div>

                {safehouse.availability.isAvailable && (
                  <button
                    className="book-button"
                    onClick={() => {
                      setSelectedSafehouse(safehouse);
                      setShowBooking(true);
                    }}
                  >
                    Request Booking
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {safehouses.length > 0 && (
          <div className="safehouses-map">
            <MapContainer
              center={[safehouses[0]?.address.coordinates.latitude || 0, safehouses[0]?.address.coordinates.longitude || 0]}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {safehouses.map((safehouse) => (
                <Marker
                  key={safehouse._id}
                  position={[safehouse.address.coordinates.latitude, safehouse.address.coordinates.longitude]}
                >
                  <Popup>
                    <div>
                      <h4>{safehouse.name}</h4>
                      <p>{safehouse.address.street}</p>
                      <p>Available Beds: {safehouse.capacity.availableBeds}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {showBooking && selectedSafehouse && (
        <div className="booking-modal">
          <div className="booking-modal-content">
            <h2>Request Booking</h2>
            <p>Requesting booking for: <strong>{selectedSafehouse.name}</strong></p>
            <p>You will be contacted shortly for approval.</p>
            <div className="booking-actions">
              <button
                className="btn-confirm"
                onClick={() => handleBook(selectedSafehouse._id)}
              >
                Confirm Booking Request
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowBooking(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Safehouses;

