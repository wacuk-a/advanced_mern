import React from 'react';
import SafeRoutes from '../components/SafeRoutes/SafeRoutes';
import TopNav from '../components/Navigation/TopNav';
import QuickExit from '../components/Safety/QuickExit';

const SafeRoutesPage: React.FC = () => {
  const handleSettingsClick = () => {
    alert('Safe Routes Settings:\n\n• Route Preferences\n• Safety Thresholds\n• Auto-rerouting\n• Privacy Settings');
  };

  const handleQuickExit = () => {
    console.log('Quick exit activated from safe routes page');
    window.location.href = 'https://www.google.com';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav onSettingsClick={handleSettingsClick} />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <SafeRoutes />
      </main>

      <QuickExit onQuickExit={handleQuickExit} />
    </div>
  );
};

export default SafeRoutesPage;
