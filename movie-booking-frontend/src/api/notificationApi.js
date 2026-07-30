import axiosInstance from './axiosInstance';

const notificationApi = {
  getAll: (page = 0, size = 20) =>
    axiosInstance.get(`/api/notifications?page=${page}&size=${size}`),

  getUnreadCount: () =>
    axiosInstance.get('/api/notifications/unread-count'),

  markAllRead: () =>
    axiosInstance.put('/api/notifications/mark-all-read'),
};

export default notificationApi;