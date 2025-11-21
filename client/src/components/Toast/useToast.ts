import { useState, useCallback } from 'react';
import { ToastType } from './Toast';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((
    message: string, 
    type: ToastType = 'info', 
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback((
    message: string, 
    type: ToastType = 'info', 
    duration?: number
  ) => {
    return showToast(message, type, duration);
  }, [showToast]);

  // Convenience methods
  const success = useCallback((message: string, duration?: number) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    hideToast,
    hideAllToasts,
  };
};

export default useToast;
