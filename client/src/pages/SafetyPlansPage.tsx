import React from 'react';
import SafetyPlans from '../components/SafetyPlans/SafetyPlans';
import TopNav from '../components/Navigation/TopNav';
import QuickExit from '../components/Safety/QuickExit';

const SafetyPlansPage: React.FC = () => {
  const handleSettingsClick = () => {
    alert('Safety Plan Settings:\n\n• Plan Templates\n• Auto-activation Triggers\n• Backup & Export\n• Privacy Settings');
  };

  const handleQuickExit = () => {
    console.log('Quick exit activated from safety plans page');
    window.location.href = 'https://www.google.com';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav onSettingsClick={handleSettingsClick} />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <SafetyPlans />
      </main>

      <QuickExit onQuickExit={handleQuickExit} />
    </div>
  );
};

export default SafetyPlansPage;
