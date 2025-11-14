import { useState, useEffect, useRef } from 'react';
import { usePanicStore } from '../store/panicStore';
import { exitApp } from '../utils/safeMode';
import './PanicButton.css';

const PanicButton = () => {
  const { activeEvent, isActivating, countdown, activatePanic, deactivatePanic } = usePanicStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const recognitionRef = useRef<any>(null);
  const powerButtonPressCount = useRef(0);
  const lastPowerButtonPress = useRef(0);

  // Voice command detection
  useEffect(() => {
    if (activeEvent) return;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        const emergencyKeywords = ['help', 'emergency', 'panic', 'danger', 'save me'];
        
        if (emergencyKeywords.some(keyword => transcript.includes(keyword))) {
          handlePanicActivate('voice');
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }
  }, [activeEvent]);

  // Power button double-press detection (simulated with visibility API)
  useEffect(() => {
    if (activeEvent) return;

    let lastVisibilityChange = 0;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastVisibilityChange = Date.now();
      } else {
        const timeSinceHidden = Date.now() - lastVisibilityChange;
        // If page becomes visible within 2 seconds of being hidden, treat as potential power button press
        if (timeSinceHidden < 2000 && timeSinceHidden > 100) {
          const now = Date.now();
          if (now - lastPowerButtonPress.current < 2000) {
            powerButtonPressCount.current++;
            if (powerButtonPressCount.current >= 2) {
              handlePanicActivate('power_button');
              powerButtonPressCount.current = 0;
            }
          } else {
            powerButtonPressCount.current = 1;
          }
          lastPowerButtonPress.current = now;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeEvent]);

  // Shake detection
  useEffect(() => {
    if (activeEvent) return;

    let lastShake = 0;
    const threshold = 15; // Acceleration threshold
    let lastX = 0, lastY = 0, lastZ = 0;

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      if (!e.accelerationIncludingGravity) return;

      const { x, y, z } = e.accelerationIncludingGravity;
      const acceleration = Math.sqrt(
        Math.pow(x - lastX, 2) + 
        Math.pow(y - lastY, 2) + 
        Math.pow(z - lastZ, 2)
      );

      if (acceleration > threshold) {
        const now = Date.now();
        if (now - lastShake > 1000) { // Prevent multiple triggers
          lastShake = now;
          handlePanicActivate('shake');
        }
      }

      lastX = x || 0;
      lastY = y || 0;
      lastZ = z || 0;
    };

    if (typeof DeviceMotionEvent !== 'undefined' && (DeviceMotionEvent as any).requestPermission) {
      (DeviceMotionEvent as any).requestPermission().then((permission: string) => {
        if (permission === 'granted') {
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      });
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [activeEvent]);

  const handlePanicActivate = async (triggerType = 'button') => {
    if (showConfirm) {
      try {
        await activatePanic(triggerType);
        setShowConfirm(false);
      } catch (error) {
        console.error('Failed to activate panic:', error);
        alert('Failed to activate panic button. Please try again.');
      }
    } else {
      setShowConfirm(true);
      // Auto-confirm after 3 seconds if no interaction
      setTimeout(() => {
        if (showConfirm) {
          setShowConfirm(false);
        }
      }, 3000);
    }
  };

  const handleDeactivate = async (reason: string) => {
    try {
      await deactivatePanic(reason);
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to deactivate panic:', error);
    }
  };

  if (activeEvent) {
    return (
      <div className="panic-active-overlay">
        <div className="panic-active-content">
          <div className="panic-status">
            <h2>🚨 EMERGENCY ACTIVE</h2>
            {countdown !== null && (
              <div className="countdown">
                <div className="countdown-number">{countdown}</div>
                <p>Emergency services will be contacted automatically</p>
              </div>
            )}
            <div className="panic-location">
              <p>Location: {activeEvent.location.latitude.toFixed(4)}, {activeEvent.location.longitude.toFixed(4)}</p>
            </div>
          </div>
          
          <div className="panic-actions">
            <button 
              className="btn-abort"
              onClick={() => handleDeactivate('aborted')}
            >
              ABORT (False Alarm)
            </button>
            <button 
              className="btn-resolve"
              onClick={() => handleDeactivate('resolved')}
            >
              RESOLVED
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panic-button-container">
      {showConfirm ? (
        <div className="panic-confirm">
          <p>Activate Emergency Alert?</p>
          <div className="confirm-buttons">
            <button 
              className="btn-confirm"
              onClick={() => handlePanicActivate('button')}
            >
              YES - ACTIVATE
            </button>
            <button 
              className="btn-cancel"
              onClick={() => setShowConfirm(false)}
            >
              CANCEL
            </button>
          </div>
        </div>
      ) : (
        <button
          className={`panic-button ${isActivating ? 'activating' : ''}`}
          onClick={() => handlePanicActivate('button')}
          disabled={isActivating}
          aria-label="Emergency Panic Button"
        >
          <span className="panic-icon">🚨</span>
          <span className="panic-text">PANIC</span>
        </button>
      )}
    </div>
  );
};

export default PanicButton;

