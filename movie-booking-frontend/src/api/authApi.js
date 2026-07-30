
import axiosInstance from './axiosInstance';

const authApi = {

  // Register new user — sends OTP after success
  register: (data) =>
    axiosInstance.post('/api/auth/register', data),

  // Verify OTP — for registration or password reset
  verifyOtp: (data) =>
    axiosInstance.post('/api/auth/verify-otp', data),

  // Resend OTP to email
  resendOtp: (email, purpose) =>
    axiosInstance.post(`/api/auth/resend-otp?email=${email}&purpose=${purpose}`),

  // Login — returns accessToken + refreshToken + user
  login: (data) =>
    axiosInstance.post('/api/auth/login', data),

  // Refresh access token using refresh token
  refreshToken: (refreshToken) =>
    axiosInstance.post('/api/auth/refresh-token', { refreshToken }),

  // Forgot password — sends OTP to email
  forgotPassword: (email) =>
    axiosInstance.post('/api/auth/forgot-password', { email }),

  // Reset password with OTP
  resetPassword: (data) =>
    axiosInstance.post('/api/auth/reset-password', data),

  // Change password — logged in user
  changePassword: (data) =>
    axiosInstance.post('/api/auth/change-password', data),

  // Logout — revokes refresh token
  logout: (refreshToken) =>
    axiosInstance.post('/api/auth/logout', { refreshToken }),

  // Logout all devices
  logoutAll: () =>
    axiosInstance.post('/api/auth/logout-all'),

  // Get current user info
  getMe: () =>
    axiosInstance.get('/api/auth/me'),
};

export default authApi;