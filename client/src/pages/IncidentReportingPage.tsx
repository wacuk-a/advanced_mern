import React from 'react';
import IncidentReporting from '../components/IncidentReporting/IncidentReporting';
import TopNav from '../components/Navigation/TopNav';
import QuickExit from '../components/Safety/QuickExit';

const IncidentReportingPage: React.FC = () => {
  const handleSettingsClick = () => {
    alert('Incident Reporting Settings:\n\n• Privacy Controls\n• Auto-backup\n• Report Templates\n• Notification Preferences');
  };

  const handleQuickExit = () => {
    console.log('Quick exit activated from incident reporting page');
    window.location.href = 'https://www.google.com';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav onSettingsClick={handleSettingsClick} />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <IncidentReporting />
      </main>

      <QuickExit onQuickExit={handleQuickExit} />
    </div>
  );
};

export default IncidentReportingPage;
