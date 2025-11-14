import { useState, useEffect } from 'react';
import './BreathingExercise.css';

interface BreathingExerciseProps {
  onComplete?: () => void;
  duration?: number; // in seconds
}

const BreathingExercise = ({ onComplete, duration = 60 }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Breathing cycle: 4s inhale, 2s hold, 6s exhale, 2s rest
    const breathingInterval = setInterval(() => {
      setPhase(prev => {
        if (prev === 'inhale') {
          setTimeout(() => setPhase('hold'), 4000);
          return 'hold';
        } else if (prev === 'hold') {
          setTimeout(() => setPhase('exhale'), 2000);
          return 'exhale';
        } else if (prev === 'exhale') {
          setTimeout(() => setPhase('rest'), 6000);
          setCycle(c => c + 1);
          return 'rest';
        } else {
          setTimeout(() => setPhase('inhale'), 2000);
          return 'inhale';
        }
      });
    }, 14000); // Full cycle duration

    return () => {
      clearInterval(interval);
      clearInterval(breathingInterval);
    };
  }, [isActive, timeRemaining, onComplete]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'rest': return 'Rest';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'var(--calm-teal-300)';
      case 'hold': return 'var(--calm-purple-300)';
      case 'exhale': return 'var(--calm-teal-200)';
      case 'rest': return 'var(--calm-neutral-200)';
    }
  };

  if (!isActive) {
    return (
      <div className="breathing-exercise-prompt">
        <p className="breathing-prompt-text">Feeling overwhelmed? Take a moment to breathe.</p>
        <button
          className="calm-button calm-button-primary"
          onClick={() => setIsActive(true)}
          aria-label="Start breathing exercise"
        >
          Start Breathing Exercise
        </button>
      </div>
    );
  }

  return (
    <div className="breathing-exercise" role="region" aria-label="Breathing exercise">
      <div className="breathing-circle-container">
        <div
          className={`breathing-circle breathing-${phase}`}
          style={{ '--phase-color': getPhaseColor() } as React.CSSProperties}
          aria-live="polite"
          aria-label={getPhaseText()}
        >
          <span className="breathing-text">{getPhaseText()}</span>
        </div>
      </div>
      <div className="breathing-info">
        <p className="breathing-cycle">Cycle {cycle}</p>
        <p className="breathing-time">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</p>
      </div>
      <button
        className="calm-button calm-button-secondary"
        onClick={() => {
          setIsActive(false);
          onComplete?.();
        }}
        aria-label="Stop breathing exercise"
      >
        Stop
      </button>
    </div>
  );
};

export default BreathingExercise;

