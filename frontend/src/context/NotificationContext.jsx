import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (message, type = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = {
      id,
      message,
      type, // info, success, warning, error
      read: false,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Clear notifications (optional)
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Get count of unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);