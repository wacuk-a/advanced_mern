import React from 'react';
import LocationSharing from '../components/Emergency/LocationSharing';
import TopNav from '../components/Navigation/TopNav';
import QuickExit from '../components/Safety/QuickExit';
import './LocationSharingPage.css';

const LocationSharingPage: React.FC = () => {
  const handleSettingsClick = () => {
    alert('Location Settings:\n\n• Location Accuracy\n• Sharing Duration\n• Emergency Contacts\n• Privacy Controls');
  };

  const handleQuickExit = () => {
    console.log('Quick exit activated from location sharing page');
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="location-sharing-page">
      <TopNav onSettingsClick={handleSettingsClick} />
      
      <main className="page-main">
        <div className="page-header">
          <h1>📍 Location Sharing</h1>
          <p>Share your location with emergency services and trusted contacts</p>
        </div>
        
        <LocationSharing />
      </main>

      <QuickExit onQuickExit={handleQuickExit} />
    </div>
  );
};

export default LocationSharingPage;
