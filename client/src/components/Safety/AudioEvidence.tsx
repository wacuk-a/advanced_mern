import React, { useState, useRef } from 'react';

interface AudioRecording {
  id: string;
  timestamp: string;
  duration: number;
  audioUrl: string;
  description: string;
}

const AudioEvidence: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newRecording: AudioRecording = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString('en-KE'),
          duration: recordingTime,
          audioUrl: audioUrl,
          description: 'Incident recording'
        };

        setRecordings(prev => [newRecording, ...prev]);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      alert('Microphone access denied. Please allow microphone permissions.');
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>🎤 Audio Evidence Recording</h3>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Discreetly record audio evidence of incidents. Files are saved locally on your device.
      </p>

      {/* Recording Controls */}
      <div style={{
        padding: '20px',
        background: isRecording ? '#fef2f2' : '#f8fafc',
        border: `2px solid ${isRecording ? '#ef4444' : '#e2e8f0'}`,
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        {isRecording ? (
          <div>
            <div style={{ fontSize: '24px', color: '#ef4444', marginBottom: '10px' }}>
              🔴 RECORDING
            </div>
            <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '15px' }}>
              {formatTime(recordingTime)}
            </div>
            <button
              onClick={stopRecording}
              style={{
                padding: '12px 24px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ⏹️ Stop Recording
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '24px', color: '#6b7280', marginBottom: '15px' }}>
              🎤 Ready to Record
            </div>
            <button
              onClick={startRecording}
              style={{
                padding: '12px 24px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🎙️ Start Recording
            </button>
          </div>
        )}
      </div>

      {/* Recordings List */}
      <div>
        <h4 style={{ color: '#333', margin: '0 0 15px 0' }}>
          Your Recordings ({recordings.length})
        </h4>
        
        {recordings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>No recordings yet. Start recording to capture audio evidence.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recordings.map(recording => (
              <div
                key={recording.id}
                style={{
                  padding: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                      Recording - {recording.timestamp}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      Duration: {formatTime(recording.duration)}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>

                <audio
                  controls
                  src={recording.audioUrl}
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = recording.audioUrl;
                      link.download = `evidence-${recording.timestamp}.wav`;
                      link.click();
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Download
                  </button>
                  <button
                    onClick={() => alert('Sharing recording with authorities...')}
                    style={{
                      padding: '8px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    📤 Share with Police
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Notice */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#fffbeb',
        borderRadius: '8px',
        border: '1px solid #fcd34d'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 10px 0' }}>⚠️ Safety Notice</h4>
        <ul style={{ color: '#92400e', margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>Recordings are stored locally on your device only</li>
          <li>Use discreetly and ensure your safety first</li>
          <li>Download and backup important recordings</li>
          <li>Share with authorities only when safe to do so</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioEvidence;
