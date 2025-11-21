import { useState, useCallback, useEffect } from 'react';
import { socketService } from '../services/socketService';

export interface Notification {
  id: string;
  type: 'emergency' | 'message' | 'system' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove non-critical notifications after 10 seconds
    if (notification.type !== 'emergency') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }

    // Vibrate for emergency notifications (if supported)
    if (notification.type === 'emergency' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Socket event handlers
  useEffect(() => {
    const handleEmergencyAlert = (data: any) => {
      addNotification({
        type: 'emergency',
        title: 'Emergency Alert',
        message: data.message || 'Emergency assistance has been activated',
        action: data.action ? {
          label: 'View Details',
          onClick: () => console.log('Navigate to emergency details')
        } : undefined
      });
    };

    const handleNewMessage = (data: any) => {
      addNotification({
        type: 'message',
        title: 'New Message',
        message: data.from ? `Message from ${data.from}: ${data.message}` : data.message,
        action: {
          label: 'Reply',
          onClick: () => console.log('Open chat')
        }
      });
    };

    const handleSystemAlert = (data: any) => {
      addNotification({
        type: 'system',
        title: data.title || 'System Update',
        message: data.message
      });
    };

    const handleSafehouseUpdate = (data: any) => {
      addNotification({
        type: 'alert',
        title: 'Safe House Update',
        message: data.available ? `Safe house available: ${data.name}` : `Safe house ${data.name} is now full`
      });
    };

    // Socket event listeners
    socketService.on('notification:emergency', handleEmergencyAlert);
    socketService.on('notification:message', handleNewMessage);
    socketService.on('notification:system', handleSystemAlert);
    socketService.on('notification:safehouse', handleSafehouseUpdate);
    socketService.on('connect', () => setIsConnected(true));
    socketService.on('disconnect', () => setIsConnected(false));

    return () => {
      socketService.off('notification:emergency', handleEmergencyAlert);
      socketService.off('notification:message', handleNewMessage);
      socketService.off('notification:system', handleSystemAlert);
      socketService.off('notification:safehouse', handleSafehouseUpdate);
      socketService.off('connect');
      socketService.off('disconnect');
    };
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    isConnected,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};
