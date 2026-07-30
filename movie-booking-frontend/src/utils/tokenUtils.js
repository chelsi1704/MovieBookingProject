
let accessTokenMemory = null;

const TokenUtils = {

  // Store access token in memory only — never localStorage
  setAccessToken: (token) => {
    accessTokenMemory = token;
  },

  // Get access token from memory
  getAccessToken: () => {
    return accessTokenMemory;
  },

  // Clear access token from memory
  clearAccessToken: () => {
    accessTokenMemory = null;
  },

  // Refresh token goes to localStorage — survives page refresh
  setRefreshToken: (token) => {
    localStorage.setItem('refreshToken', token);
  },

  // Get refresh token from localStorage
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  // Clear refresh token — called on logout
  clearRefreshToken: () => {
    localStorage.removeItem('refreshToken');
  },

  // Store user info in localStorage — for page refresh restore
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user from localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Clear user data
  clearUser: () => {
    localStorage.removeItem('user');
  },

  // Clear everything — called on logout
  clearAll: () => {
    accessTokenMemory = null;
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  // True if we have a refresh token (access token will be refreshed)
  isLoggedIn: () => {
    return !!localStorage.getItem('refreshToken');
  },
};

export default TokenUtils;