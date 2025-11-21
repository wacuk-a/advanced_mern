import React from 'react';
import Toast, { ToastProps } from './Toast';
import './Toast.css';

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
