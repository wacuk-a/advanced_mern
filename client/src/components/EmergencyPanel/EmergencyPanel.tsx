import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../Card/Card';
import Button from '../Button/Button';
import './EmergencyPanel.css';

interface EmergencyPanelProps {
  onEmergencyActivate?: () => void;
  onSafehouseLocate?: () => void;
  onSupportRequest?: () => void;
}

export const EmergencyPanel: React.FC<EmergencyPanelProps> = ({
  onEmergencyActivate,
  onSafehouseLocate,
  onSupportRequest
}) => {
  const [panicStatus, setPanicStatus] = useState('Ready');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergencyActivate = async () => {
    setIsLoading(true);
    setPanicStatus('Activating Emergency Protocol...');
    
    // Simulate emergency activation
    setTimeout(() => {
      setPanicStatus('Emergency Services Alerted');
      setIsLoading(false);
      onEmergencyActivate?.();
      
      // Show critical alert
      alert('🚨 CRITICAL ALERT 🚨\n\nEmergency services have been notified.\nYour location is being shared with authorities.\nStay on the line for further instructions.');
    }, 3000);
  };

  const handleSafehouseLocate = () => {
    onSafehouseLocate?.();
    alert('📍 Locating nearest safe house...\n\nNearest Safe House:\n• Nairobi Central (2.3km)\n• 8 beds available\n• Security: 24/7\n• Contact: +254-720-123456');
  };

  const handleSupportRequest = () => {
    onSupportRequest?.();
    alert('💬 Connecting you with support...\n\nAvailable Counselors:\n• Sarah M. - Online\n• Dr. James K. - Available in 5min\n• Emergency Hotline: 1195');
  };

  return (
    <section className="emergency-panel">
      <div className="emergency-container">
        <div className="emergency-header">
          <h2 className="emergency-title">Emergency Response System</h2>
          <p className="emergency-subtitle">
            Immediate assistance when you need it most
          </p>
        </div>

        <div className="emergency-grid">
          {/* Main Emergency Card */}
          <Card variant="filled" className="emergency-main-card">
            <CardHeader>
              <div className="emergency-status">
                <div className="status-indicator">
                  <div className={`status-dot ${panicStatus.includes('Alerted') ? 'status-critical' : 'status-ready'}`} />
                  <span className="status-text">{panicStatus}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="emergency-content">
                <div className="emergency-icon">🚨</div>
                <h3 className="emergency-card-title">Emergency Panic Button</h3>
                <p className="emergency-description">
                  Activates immediate response protocol. Notifies emergency services, 
                  shares your location, and alerts your emergency contacts.
                </p>
                <div className="emergency-features">
                  <span className="feature-tag">📍 Location Sharing</span>
                  <span className="feature-tag">📞 Emergency Calls</span>
                  <span className="feature-tag">👥 Contact Alert</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="danger"
                size="lg"
                onClick={handleEmergencyActivate}
                loading={isLoading}
                fullWidth
                className="emergency-button"
              >
                {isLoading ? 'Activating Emergency...' : 'Activate Emergency Protocol'}
              </Button>
            </CardFooter>
          </Card>

          {/* Support Cards */}
          <Card className="emergency-support-card">
            <CardContent>
              <div className="support-content">
                <div className="support-icon">🏠</div>
                <h4 className="support-title">Find Safe Houses</h4>
                <p className="support-description">
                  Locate the nearest verified safe houses with available beds and security.
                </p>
                <Button
                  variant="outline"
                  onClick={handleSafehouseLocate}
                  fullWidth
                >
                  Locate Safe Houses
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="emergency-support-card">
            <CardContent>
              <div className="support-content">
                <div className="support-icon">💬</div>
                <h4 className="support-title">Crisis Support</h4>
                <p className="support-description">
                  Connect with trained counselors and support professionals immediately.
                </p>
                <Button
                  variant="outline"
                  onClick={handleSupportRequest}
                  fullWidth
                >
                  Request Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EmergencyPanel;
