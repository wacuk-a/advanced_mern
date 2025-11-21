import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import './NotificationBell.css';

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return '🚨';
      case 'message':
        return '💬';
      case 'alert':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="bell-button"
        onClick={toggleDropdown}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                className="clear-all-btn"
                onClick={() => {
                  removeNotification(notifications[0].id);
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No notifications</p>
                <span className="empty-subtitle">You're all caught up!</span>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.type}`}
                  onClick={() => {
                    if (notification.action) {
                      notification.action.onClick();
                    }
                    markAsRead(notification.id);
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                  {notification.action && (
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        notification.action!.onClick();
                        markAsRead(notification.id);
                      }}
                    >
                      {notification.action.label}
                    </button>
                  )}
                  <button
                    className="dismiss-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    aria-label="Dismiss notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 5 && (
            <div className="dropdown-footer">
              <span className="more-notifications">
                {notifications.length - 5} more notifications
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
