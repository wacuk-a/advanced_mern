import { useState, useEffect, useRef } from 'react';
import { usePanicStore } from '../../store/panicStore';
import './DiscreetPanicButton.css';

const DiscreetPanicButton = () => {
  const { activeEvent, isActivating, countdown, activatePanic, deactivatePanic } = usePanicStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const volumeButtonPressed = useRef(false);

  // Voice command detection - "I need help"
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
        const helpPhrases = ['i need help', 'help me', 'emergency', 'i need assistance'];
        
        if (helpPhrases.some(phrase => transcript.includes(phrase))) {
          handlePanicActivate('voice');
        }
      };

      recognition.onerror = () => {
        // Silently handle errors
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (error) {
        // Silently handle
      }

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }
  }, [activeEvent]);

  // Volume button long-press detection (simulated)
  useEffect(() => {
    if (activeEvent) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Simulate volume button with 'V' key (for testing)
      // In production, this would use device-specific APIs
      if (e.key === 'v' || e.key === 'V') {
        if (!volumeButtonPressed.current) {
          volumeButtonPressed.current = true;
          longPressTimer.current = setTimeout(() => {
            handlePanicActivate('volume_button');
          }, 2000); // 2 second long press
        }
      }
    };

    const handleKeyUp = () => {
      volumeButtonPressed.current = false;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [activeEvent]);

  // Shake detection - subtle
  useEffect(() => {
    if (activeEvent) return;

    let lastShake = 0;
    const threshold = 12; // Lower threshold for subtle detection
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
        if (now - lastShake > 2000) { // Prevent multiple triggers
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
        setShowBreathing(true);
        // Brief breathing moment before activation
        setTimeout(async () => {
          await activatePanic(triggerType);
          setShowConfirm(false);
          setShowBreathing(false);
        }, 2000);
      } catch (error) {
        console.error('Failed to activate panic:', error);
        setShowBreathing(false);
      }
    } else {
      setShowConfirm(true);
      // Auto-confirm after 5 seconds if no interaction
      setTimeout(() => {
        if (showConfirm) {
          setShowConfirm(false);
        }
      }, 5000);
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
      <div className="panic-active-overlay" role="alert" aria-live="assertive">
        <div className="panic-active-content">
          <div className="panic-status">
            <h2 className="panic-title">You're Safe</h2>
            <p className="panic-reassurance">Help is on the way. Your location is being shared with trusted contacts.</p>
            {countdown !== null && (
              <div className="countdown-container">
                <div className="countdown-number">{countdown}</div>
                <p className="countdown-text">Emergency services will be contacted automatically</p>
              </div>
            )}
            <div className="panic-location">
              <p>Location shared: {activeEvent.location.latitude.toFixed(2)}, {activeEvent.location.longitude.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="panic-actions">
            <button 
              className="calm-button calm-button-secondary"
              onClick={() => handleDeactivate('aborted')}
              aria-label="Cancel emergency alert"
            >
              Cancel Alert
            </button>
            <button 
              className="calm-button calm-button-primary"
              onClick={() => handleDeactivate('resolved')}
              aria-label="Mark emergency as resolved"
            >
              I'm Safe Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showBreathing) {
    return (
      <div className="breathing-overlay">
        <div className="breathing-content">
          <div className="breathing-indicator"></div>
          <p className="breathing-text">Take a deep breath...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discreet-panic-container">
      {showConfirm ? (
        <div className="panic-confirm-dialog" role="dialog" aria-labelledby="confirm-title">
          <h3 id="confirm-title">Activate Emergency Alert?</h3>
          <p className="confirm-description">This will notify your emergency contacts and share your location.</p>
          <div className="confirm-buttons">
            <button 
              className="calm-button calm-button-primary"
              onClick={() => handlePanicActivate('button')}
              aria-label="Confirm emergency activation"
            >
              Yes, Activate
            </button>
            <button 
              className="calm-button calm-button-secondary"
              onClick={() => setShowConfirm(false)}
              aria-label="Cancel emergency activation"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className={`discreet-panic-button ${isActivating ? 'activating' : ''}`}
          onClick={() => handlePanicActivate('button')}
          disabled={isActivating}
          aria-label="Emergency help button"
          title="Press for emergency help"
        >
          <span className="panic-icon" aria-hidden="true">🆘</span>
          <span className="sr-only">Emergency Help</span>
        </button>
      )}
    </div>
  );
};

export default DiscreetPanicButton;

