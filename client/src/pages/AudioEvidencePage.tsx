import React from 'react';
import AudioEvidence from '../components/Safety/AudioEvidence';
import TopNav from '../components/Navigation/TopNav';
import QuickExit from '../components/Safety/QuickExit';

const AudioEvidencePage: React.FC = () => {
  const handleSettingsClick = () => {
    alert('Audio Evidence Settings');
  };

  const handleQuickExit = () => {
    console.log('Quick exit activated from audio evidence page');
    window.location.href = 'https://www.google.com';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <TopNav onSettingsClick={handleSettingsClick} />
      
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <AudioEvidence />
      </main>

      <QuickExit onQuickExit={handleQuickExit} />
    </div>
  );
};

export default AudioEvidencePage;
