import React from 'react';
import ResourceDirectory from '../components/Resources/ResourceDirectory';
import TopNav from '../components/Navigation/TopNav';
import QuickExit from '../components/Safety/QuickExit';

const ResourceDirectoryPage: React.FC = () => {
  const handleSettingsClick = () => {
    alert('Resource Directory Settings:\n\n• Favorite Resources\n• Location-based Filtering\n• Custom Categories\n• Privacy Settings');
  };

  const handleQuickExit = () => {
    console.log('Quick exit activated from resource directory page');
    window.location.href = 'https://www.google.com';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav onSettingsClick={handleSettingsClick} />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <ResourceDirectory />
      </main>

      <QuickExit onQuickExit={handleQuickExit} />
    </div>
  );
};

export default ResourceDirectoryPage;
