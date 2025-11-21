import React from 'react';
import EmergencyCodes from '../components/Safety/EmergencyCodes';
import TopNav from '../components/Navigation/TopNav';
import QuickExit from '../components/Safety/QuickExit';

const EmergencyCodesPage: React.FC = () => {
  const handleSettingsClick = () => {
    alert('Emergency Codes Settings');
  };

  const handleQuickExit = () => {
    console.log('Quick exit activated from emergency codes page');
    window.location.href = 'https://www.google.com';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav onSettingsClick={handleSettingsClick} />
      
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <EmergencyCodes />
      </main>

      <QuickExit onQuickExit={handleQuickExit} />
    </div>
  );
};

export default EmergencyCodesPage;
