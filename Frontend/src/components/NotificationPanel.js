// NotificationPanel.js
import React, { useState } from 'react';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received!', read: false },
    { id: 2, message: 'Product review pending', read: false },
    { id: 3, message: 'Discount offer expired', read: true },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <div className="notification-panel">
      <div className="bell-icon">
        <span role="img" aria-label="bell">🔔</span>
        <span className="unread-count">{notifications.filter(n => !n.read).length}</span>
      </div>
      <div className="notifications-dropdown">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
            <p>{notification.message}</p>
            {!notification.read && <button onClick={() => handleMarkAsRead(notification.id)}>Mark as read</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
