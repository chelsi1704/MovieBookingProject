import { useState, useCallback, useEffect } from 'react';
import * as notificationApi from '../api/notificationApi';

/**
 * Custom hook for managing notifications
 * Provides access to user notifications and notification methods
 * 
 * @param {object} options - Hook options
 * @param {number} options.pollInterval - Interval to poll for new notifications (in ms)
 * @param {number} options.limit - Number of notifications to fetch per page
 * @returns {object} Notifications hook object
 */
export const useNotifications = (options = {}) => {
  const {
    pollInterval = 30000, // 30 seconds
    limit = 10,
  } = options;

  // State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetch notifications
   */
  const fetchNotifications = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await notificationApi.getNotifications(pageNum, limit);
        const newNotifications = response.notifications || [];

        if (isLoadMore) {
          setNotifications(prev => [...prev, ...newNotifications]);
        } else {
          setNotifications(newNotifications);
        }

        setPage(pageNum);
        setHasMore(newNotifications.length === limit);
        setUnreadCount(response.unreadCount || 0);

        return response;
      } catch (err) {
        setError(err.message || 'Failed to fetch notifications');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  /**
   * Load more notifications
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchNotifications(page + 1, true);
  }, [page, hasMore, loading, fetchNotifications]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await notificationApi.markAsRead(notificationId);

        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId
              ? { ...notif, read: true }
              : notif
          )
        );

        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        throw err;
      }
    },
    []
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Delete notification
   */
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);

      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );

      const deletedNotif = notifications.find(n => n.id === notificationId);
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      throw err;
    }
  }, [notifications]);

  /**
   * Delete all notifications
   */
  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationApi.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Get notification by ID
   */
  const getNotification = useCallback(
    (notificationId) => {
      return notifications.find(n => n.id === notificationId);
    },
    [notifications]
  );

  /**
   * Get unread notifications
   */
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  /**
   * Get notification count by type
   */
  const getCountByType = useCallback(
    (type) => {
      return notifications.filter(n => n.type === type).length;
    },
    [notifications]
  );

  /**
   * Get notification count by status
   */
  const getCountByStatus = useCallback(
    (read) => {
      return notifications.filter(n => n.read === read).length;
    },
    [notifications]
  );

  /**
   * Clear notification by type
   */
  const clearByType = useCallback(
    async (type) => {
      try {
        const toDelete = notifications.filter(n => n.type === type);

        for (const notif of toDelete) {
          await deleteNotification(notif.id);
        }
      } catch (err) {
        throw err;
      }
    },
    [notifications, deleteNotification]
  );

  /**
   * Subscribe to notifications
   */
  const subscribe = useCallback(() => {
    return notificationApi.subscribeToNotifications();
  }, []);

  /**
   * Unsubscribe from notifications
   */
  const unsubscribe = useCallback(() => {
    return notificationApi.unsubscribeFromNotifications();
  }, []);

  /**
   * Get notification preferences
   */
  const getPreferences = useCallback(async () => {
    try {
      return await notificationApi.getNotificationPreferences();
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Update notification preferences
   */
  const updatePreferences = useCallback(async (preferences) => {
    try {
      return await notificationApi.updateNotificationPreferences(preferences);
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Refresh notifications
   */
  const refresh = useCallback(async () => {
    return fetchNotifications(1, false);
  }, [fetchNotifications]);

  // Auto-poll for new notifications
  useEffect(() => {
    if (pollInterval <= 0) return;

    const interval = setInterval(() => {
      refresh();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval, refresh]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1, false);
  }, []);

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    page,
    hasMore,

    // Methods
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refresh,

    // Getters
    getNotification,
    getUnreadNotifications,
    getCountByType,
    getCountByStatus,

    // Utility methods
    clearByType,
    subscribe,
    unsubscribe,
    getPreferences,
    updatePreferences,

    // Shortcuts
    hasNotifications: notifications.length > 0,
    hasUnread: unreadCount > 0,
  };
};

export default useNotifications;
