import axiosInstance from './axiosInstance';

// Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Revenue Data
export const getRevenueData = async (period = 'monthly') => {
  try {
    const response = await axiosInstance.get(`/admin/revenue?period=${period}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User Management
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/admin/users', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Movie Management
export const getAllMoviesForAdmin = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/admin/movies', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createMovie = async (movieData) => {
  try {
    const response = await axiosInstance.post('/admin/movies', movieData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateMovie = async (movieId, movieData) => {
  try {
    const response = await axiosInstance.put(`/admin/movies/${movieId}`, movieData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteMovie = async (movieId) => {
  try {
    const response = await axiosInstance.delete(`/admin/movies/${movieId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Booking Management
export const getAllBookings = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await axiosInstance.get('/admin/bookings', {
      params: { page, limit, ...filters }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/admin/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axiosInstance.put(`/admin/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const cancelBooking = async (bookingId, reason = '') => {
  try {
    const response = await axiosInstance.post(`/admin/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Analytics
export const getAnalytics = async (type = 'overview', dateRange = {}) => {
  try {
    const response = await axiosInstance.get('/admin/analytics', {
      params: { type, ...dateRange }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPopularMovies = async (limit = 10) => {
  try {
    const response = await axiosInstance.get('/admin/analytics/popular-movies', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMoviePerformance = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/admin/analytics/movies/${movieId}/performance`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reports
export const generateReport = async (reportType, filters = {}) => {
  try {
    const response = await axiosInstance.get('/admin/reports/generate', {
      params: { type: reportType, ...filters },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getReportHistory = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/admin/reports/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// System Settings
export const getSystemSettings = async () => {
  try {
    const response = await axiosInstance.get('/admin/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateSystemSettings = async (settings) => {
  try {
    const response = await axiosInstance.put('/admin/settings', settings);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Notifications & Messages
export const sendSystemNotification = async (notification) => {
  try {
    const response = await axiosInstance.post('/admin/notifications/send', notification);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPendingApprovals = async () => {
  try {
    const response = await axiosInstance.get('/admin/approvals');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Audit Logs
export const getAuditLogs = async (page = 1, limit = 20) => {
  try {
    const response = await axiosInstance.get('/admin/audit-logs', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
