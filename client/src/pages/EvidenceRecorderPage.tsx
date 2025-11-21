import React, { useState } from 'react';
import { simpleApi } from '../api/simpleClient';

const EvidenceRecorderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audio' | 'photo' | 'video' | 'note'>('audio');
  const [noteContent, setNoteContent] = useState('');

  const handleTakePhoto = async () => {
    try {
      const result = await simpleApi.savePhoto({
        imageData: 'photo_data_here',
        timestamp: new Date().toISOString()
      });
      alert(`Photo saved! ID: ${result.id}`);
    } catch (error) {
      alert('Failed to save photo');
    }
  };

  const handleRecordVideo = async () => {
    try {
      const result = await simpleApi.saveVideo({
        videoData: 'video_data_here', 
        duration: '60s',
        timestamp: new Date().toISOString()
      });
      alert(`Video saved! ID: ${result.id}`);
    } catch (error) {
      alert('Failed to save video');
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      alert('Please enter note content');
      return;
    }
    
    try {
      // For notes, we'll use the photo endpoint since we don't have a dedicated note endpoint
      const result = await simpleApi.savePhoto({
        note: noteContent,
        timestamp: new Date().toISOString()
      });
      alert(`Note saved! ID: ${result.id}`);
      setNoteContent('');
    } catch (error) {
      alert('Failed to save note');
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <h1>📷 Collect Evidence</h1>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['audio', 'photo', 'video', 'note'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab ? '#3b82f6' : '#e2e8f0',
              color: activeTab === tab ? 'white' : '#475569',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {tab === 'audio' && '🎤 Audio'}
            {tab === 'photo' && '📷 Photo'} 
            {tab === 'video' && '🎥 Video'}
            {tab === 'note' && '📝 Note'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        {activeTab === 'audio' && (
          <div>
            <h3>Audio Recording</h3>
            <p>Use the audio recording feature to capture incidents.</p>
            <p>🔴 This feature requires microphone permissions.</p>
          </div>
        )}

        {activeTab === 'photo' && (
          <div>
            <h3>Take Photo</h3>
            <p>Capture photographic evidence of incidents.</p>
            <button 
              onClick={handleTakePhoto}
              style={{
                padding: '15px 30px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              📷 Take Photo
            </button>
          </div>
        )}

        {activeTab === 'video' && (
          <div>
            <h3>Record Video</h3>
            <p>Record video evidence of incidents.</p>
            <button 
              onClick={handleRecordVideo}
              style={{
                padding: '15px 30px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              🎥 Record Video
            </button>
          </div>
        )}

        {activeTab === 'note' && (
          <div>
            <h3>Write Note</h3>
            <p>Document incidents with written notes.</p>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Describe the incident..."
              style={{
                width: '100%',
                height: '150px',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '15px'
              }}
            />
            <button 
              onClick={handleSaveNote}
              style={{
                padding: '15px 30px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              💾 Save Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceRecorderPage;
