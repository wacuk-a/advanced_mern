import React from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  onClose 
}) => {
  return (
    <div className={`toast toast--${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        {onClose && (
          <button className="toast-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
