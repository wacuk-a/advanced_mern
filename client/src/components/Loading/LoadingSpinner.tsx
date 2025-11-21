import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  text,
  overlay = false
}) => {
  const spinnerClass = `spinner spinner-${size} spinner-${color}`;
  
  if (overlay) {
    return (
      <div className="spinner-overlay">
        <div className="spinner-container">
          <div className={spinnerClass}></div>
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-inline">
      <div className={spinnerClass}></div>
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
