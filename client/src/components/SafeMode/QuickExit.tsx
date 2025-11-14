import { useEffect } from 'react';
import { exitApp } from '../../utils/safeMode';
import './QuickExit.css';

const QuickExit = () => {
  useEffect(() => {
    // Shake to exit
    let lastShake = 0;
    const threshold = 20;
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
        if (now - lastShake > 1000) {
          lastShake = now;
          exitApp();
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

    // Double Escape to exit
    let lastEscapePress = 0;
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscapePress < 1000) {
          exitApp();
        }
        lastEscapePress = now;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <button
      className="quick-exit-button"
      onClick={exitApp}
      aria-label="Quick exit - clears history and closes app"
      title="Quick Exit (Double press Escape)"
    >
      <span className="exit-icon" aria-hidden="true">✕</span>
      <span className="sr-only">Quick Exit</span>
    </button>
  );
};

export default QuickExit;

