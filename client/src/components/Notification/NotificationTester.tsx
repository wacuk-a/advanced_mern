import React, { useState, useEffect } from 'react';
import { socketService } from '../../services/socketService';
import './NotificationTester.css';

export const NotificationTester: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [testMessage, setTestMessage] = useState('Test emergency notification');

  useEffect(() => {
    // Initialize socket connection
    const socket = socketService.connect(localStorage.getItem('token') || undefined);
    
    setConnectionStatus('connecting');

    // Listen for connection events
    socket.on('connect', () => {
      console.log('✅ Connected to server');
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setConnectionStatus('disconnected');
    });

    // Listen for test notifications
    socket.on('test:notification', (data) => {
      console.log('📢 Test notification received:', data);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'test',
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev]);
    });

    socket.on('emergency:notification', (data) => {
      console.log('🚨 Emergency notification received:', data);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'emergency',
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev]);
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('test:notification');
      socket.off('emergency:notification');
    };
  }, []);

  const sendTestNotification = () => {
    if (connectionStatus !== 'connected') {
      alert('Please wait for connection to establish');
      return;
    }

    socketService.emitEmergencyActivated({
      type: 'test',
      message: testMessage,
      timestamp: new Date().toISOString()
    });

    // Add local notification for immediate feedback
    setNotifications(prev => [{
      id: Date.now(),
      type: 'sent',
      message: `Sent: ${testMessage}`,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'disconnected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="notification-tester">
      <h2>🔔 Notification System Test</h2>
      
      <div className="connection-status">
        <div className="status-indicator">
          <div 
            className="status-dot" 
            style={{ backgroundColor: getStatusColor() }}
          ></div>
          <span>WebSocket: {connectionStatus.toUpperCase()}</span>
        </div>
      </div>

      <div className="test-controls">
        <div className="input-group">
          <label htmlFor="test-message">Test Message:</label>
          <input
            id="test-message"
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test notification message"
          />
        </div>
        
        <div className="button-group">
          <button 
            onClick={sendTestNotification}
            disabled={connectionStatus !== 'connected'}
            className="send-btn"
          >
            Send Test Notification
          </button>
          
          <button 
            onClick={clearNotifications}
            disabled={notifications.length === 0}
            className="clear-btn"
          >
            Clear Notifications
          </button>
        </div>
      </div>

      <div className="notifications-log">
        <h3>Notifications ({notifications.length})</h3>
        
        {notifications.length === 0 ? (
          <div className="empty-log">
            <p>No notifications yet. Send a test message to see notifications here.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.type}`}
              >
                <div className="notification-header">
                  <span className="notification-type">
                    {notification.type === 'emergency' ? '🚨 EMERGENCY' : 
                     notification.type === 'test' ? '📢 TEST' : 
                     '📤 SENT'}
                  </span>
                  <span className="notification-time">{notification.timestamp}</span>
                </div>
                <div className="notification-message">{notification.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tester-info">
        <h4>Testing Instructions:</h4>
        <ol>
          <li>Wait for WebSocket connection to show "CONNECTED"</li>
          <li>Send a test notification using the button above</li>
          <li>Check if notifications appear in the log below</li>
          <li>If using multiple browser tabs, test cross-tab notifications</li>
        </ol>
      </div>
    </div>
  );
};

export default NotificationTester;
