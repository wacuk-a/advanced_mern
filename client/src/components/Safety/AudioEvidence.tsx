import React, { useState, useRef } from 'react';
import { simpleApi } from '../../api/simpleClient';

const AudioEvidence: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      
      mediaRecorder.ondataavailable = (event) => {
        // Save recording to backend
        simpleApi.saveAudio({
          audioData: 'audio_blob_data', // In real app, you'd upload the blob
          duration: '30s',
          timestamp: new Date().toISOString()
        }).then(result => {
          setRecordings(prev => [...prev, {
            id: result.id,
            duration: '30s',
            timestamp: new Date().toISOString()
          }]);
        });
      };
      
    } catch (error) {
      alert('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>🎤 Audio Evidence</h3>
      
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          padding: '15px 30px',
          backgroundColor: isRecording ? '#ef4444' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h4>Your Recordings:</h4>
        {recordings.length === 0 ? (
          <p>No recordings yet</p>
        ) : (
          recordings.map(recording => (
            <div key={recording.id} style={{
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <p>Recording ID: {recording.id}</p>
              <p>Duration: {recording.duration}</p>
              <p>Time: {new Date(recording.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AudioEvidence;
