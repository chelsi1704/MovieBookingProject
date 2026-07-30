import axios from 'axios';
import TokenUtils from '../utils/tokenUtils';

// Base URL — all API calls go to Spring Boot at port 8081
// ✅ USE import.meta.env FOR VITE (NOT process.env)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

// Create Axios instance with base config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
  withCredentials: true,
});

// Track if a token refresh is already in progress
let isRefreshing = false;

// Queue of requests that failed while token was being refreshed
let failedQueue = [];

// Process the queue — retry all queued requests with new token
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// ============================================
// REQUEST INTERCEPTOR
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = TokenUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ❌ COMMENTED OUT - These cause CORS errors
    // If your backend supports these headers, uncomment below
    // and configure CORS on backend to allow them
    
    // Add request ID for tracking
    // config.headers['X-Request-ID'] = generateRequestId();

    // Add timestamp
    // config.headers['X-Request-Time'] = new Date().toISOString();

    console.log("TOKEN =", TokenUtils.getAccessToken());
    console.log(config.headers);
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
axiosInstance.interceptors.response.use(
  // Success — just pass through
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${response.status} ${response.config.url}`);
    }
    return response;
  },

  // Error handler
  async (error) => {
    const originalRequest = error.config;

    // Handle network timeout
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timeout:', originalRequest.url);
      return Promise.reject({
        status: 408,
        message: 'Request timeout. Please try again.',
        isNetworkError: true,
      });
    }

    // Handle network error (no internet connection)
    if (!error.response) {
      console.error('[API] Network error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${status} ${originalRequest.url}`, data);
    }

    // ============================================
    // 401 Unauthorized — Token Expired
    // ============================================
    if (status === 401 && !originalRequest._retry) {
      // If already refreshing — queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mark as retried to prevent loops
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = TokenUtils.getRefreshToken();

      if (!refreshToken) {
        // No refresh token — force logout
        console.warn('[API] No refresh token available. Logging out.');
        TokenUtils.clearAll();
        window.location.href = '/login?reason=session-expired';
        return Promise.reject({
          status: 401,
          message: 'Session expired. Please login again.',
        });
      }

      try {
        console.log('[API] Attempting token refresh...');

        const response = await axios.post(
          `${BASE_URL}/api/auth/refresh-token`,
          { refreshToken },
          { timeout: 10000 }
        );

        const { accessToken } = response.data.data;

        // Store new access token
        TokenUtils.setAccessToken(accessToken);

        console.log('[API] Token refreshed successfully');

        // Update Authorization header on original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process all queued requests with the new token
        processQueue(null, accessToken);

        // Retry the original request
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError.message);

        processQueue(refreshError, null);
        TokenUtils.clearAll();
        window.location.href = '/login?reason=session-expired';

        return Promise.reject({
          status: 401,
          message: 'Session expired. Please login again.',
        });

      } finally {
        isRefreshing = false;
      }
    }

    // ============================================
    // 403 Forbidden — Access Denied
    // ============================================
    if (status === 403) {
      console.error('[API] Access forbidden:', originalRequest.url);
      return Promise.reject({
        status: 403,
        message: data?.message || 'You do not have permission to access this resource.',
        code: data?.code,
      });
    }

    // ============================================
    // 404 Not Found
    // ============================================
    if (status === 404) {
      console.error('[API] Resource not found:', originalRequest.url);
      return Promise.reject({
        status: 404,
        message: data?.message || 'The requested resource was not found.',
        code: data?.code,
      });
    }

    // ============================================
    // 400 Bad Request — Validation Error
    // ============================================
    if (status === 400) {
      console.error('[API] Bad request:', data);
      return Promise.reject({
        status: 400,
        message: data?.message || 'Invalid request. Please check your input.',
        errors: data?.errors, // Validation errors
        code: data?.code,
      });
    }

    // ============================================
    // 429 Too Many Requests — Rate Limit
    // ============================================
    if (status === 429) {
      console.error('[API] Rate limit exceeded');
      return Promise.reject({
        status: 429,
        message: 'Too many requests. Please try again later.',
        retryAfter: error.response.headers['retry-after'],
      });
    }

    // ============================================
    // 500 Internal Server Error
    // ============================================
    if (status === 500) {
      console.error('[API] Server error:', data);
      return Promise.reject({
        status: 500,
        message: data?.message || 'Server error. Please try again later.',
        code: data?.code,
      });
    }

    // ============================================
    // Other Errors
    // ============================================
    return Promise.reject({
      status: status || 'UNKNOWN',
      message:
        data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      code: data?.code,
      originalError: error,
    });
  }
);

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate unique request ID for tracking
 * ❌ Currently commented out in request interceptor
 * Uncomment if your backend supports custom headers
 */
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!TokenUtils.getAccessToken();
};

/**
 * Clear all auth data and redirect to login
 */
export const logout = () => {
  TokenUtils.clearAll();
  window.location.href = '/login';
};

/**
 * Get current authorization token
 */
export const getToken = () => {
  return TokenUtils.getAccessToken();
};

/**
 * Set authorization token
 */
export const setToken = (token) => {
  TokenUtils.setAccessToken(token);
};

/**
 * Clear authorization token
 */
export const clearToken = () => {
  TokenUtils.clearAll();
};

/**
 * Get full authorization header
 */
export const getAuthHeader = () => {
  const token = TokenUtils.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Make a GET request
 */
export const get = (url, config = {}) => {
  return axiosInstance.get(url, config);
};

/**
 * Make a POST request
 */
export const post = (url, data = {}, config = {}) => {
  return axiosInstance.post(url, data, config);
};

/**
 * Make a PUT request
 */
export const put = (url, data = {}, config = {}) => {
  return axiosInstance.put(url, data, config);
};

/**
 * Make a PATCH request
 */
export const patch = (url, data = {}, config = {}) => {
  return axiosInstance.patch(url, data, config);
};

/**
 * Make a DELETE request
 */
export const delete_ = (url, config = {}) => {
  return axiosInstance.delete(url, config);
};

/**
 * Upload file with progress tracking
 */
export const uploadFile = (url, file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
};

/**
 * Upload multiple files with progress tracking
 */
export const uploadFiles = (url, files, onProgress = null) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });

  return axiosInstance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
};

/**
 * Download file
 */
export const downloadFile = (url, filename) => {
  return axiosInstance
    .get(url, {
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentURL.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
};

/**
 * Retry failed request
 */
export const retryRequest = (error, maxRetries = 3) => {
  const config = error.config;

  if (!config || !config.__retryCount) {
    config.__retryCount = 0;
  }

  config.__retryCount += 1;

  if (config.__retryCount <= maxRetries) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(axiosInstance(config)), 1000 * config.__retryCount)
    );
  }

  return Promise.reject(error);
};

export default axiosInstance;
