import React from 'react';
import { NotificationTester } from '../components/Notification/NotificationTester';
import TopNav from '../components/Navigation/TopNav';
import QuickExit from '../components/Safety/QuickExit';

const NotificationTestPage: React.FC = () => {
  const handleQuickExit = () => {
    console.log('Quick exit activated from notification test page');
    // Redirect to Google or safe page
    window.location.href = 'https://www.google.com';
  };

  const handleSettingsClick = () => {
    alert('Settings menu would open here');
  };

  return (
    <div className="safe-voice-app">
      <TopNav onSettingsClick={handleSettingsClick} />
      
      <main className="app-main" style={{ paddingTop: '80px' }}>
        <div className="container">
          <div className="page-header">
            <h1>🔔 Notification System Test</h1>
            <p>Test the real-time WebSocket connection and notification system</p>
          </div>
          
          <NotificationTester />
        </div>
      </main>

      <QuickExit onQuickExit={handleQuickExit} />
    </div>
  );
};

export default NotificationTestPage;
