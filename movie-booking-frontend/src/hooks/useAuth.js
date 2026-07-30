import { useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as authApi from '../api/authApi';

/**
 * Custom hook for authentication functionality
 * Provides access to auth state and methods
 * 
 * @returns {object} Authentication hook object
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    isAuthenticated,
    loading,
    error,
    login: contextLogin,
    register: contextRegister,
    logout: contextLogout,
    updateUser: contextUpdateUser,
  } = context;

  /**
   * Login user with email and password
   */
  const login = useCallback(
    async (email, password) => {
      try {
        const response = await authApi.login(email, password);
        contextLogin(response);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [contextLogin]
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (userData) => {
      try {
        const response = await authApi.register(userData);
        contextRegister(response);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [contextRegister]
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    try {
      authApi.logout();
      contextLogout();
    } catch (err) {
      console.error('Logout error:', err);
      contextLogout(); // Logout anyway
    }
  }, [contextLogout]);

  /**
   * Verify OTP
   */
  const verifyOTP = useCallback(async (email, otp) => {
    try {
      const response = await authApi.verifyOTP(email, otp);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Resend OTP
   */
  const resendOTP = useCallback(async (email) => {
    try {
      const response = await authApi.resendOTP(email);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(async (email) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      const response = await authApi.resetPassword(token, newPassword);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (userData) => {
      try {
        const response = await authApi.updateProfile(userData);
        contextUpdateUser(response);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [contextUpdateUser]
  );

  /**
   * Change password
   */
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const response = await authApi.changePassword(oldPassword, newPassword);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Check if user is authenticated
   */
  const isLoggedIn = useCallback(() => {
    return isAuthenticated && !!user;
  }, [isAuthenticated, user]);

  /**
   * Get user role
   */
  const getUserRole = useCallback(() => {
    return user?.role || null;
  }, [user]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      if (Array.isArray(role)) {
        return role.includes(user.role);
      }
      return user.role === role;
    },
    [user]
  );

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  /**
   * Get user ID
   */
  const getUserId = useCallback(() => {
    return user?.id || null;
  }, [user]);

  /**
   * Get user email
   */
  const getUserEmail = useCallback(() => {
    return user?.email || null;
  }, [user]);

  /**
   * Check if email is verified
   */
  const isEmailVerified = useCallback(() => {
    return user?.emailVerified || false;
  }, [user]);

  /**
   * Refresh auth token
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await authApi.refreshToken();
      contextLogin(response);
      return response;
    } catch (err) {
      contextLogout();
      throw err;
    }
  }, [contextLogin, contextLogout]);

  /**
   * Login with OAuth
   */
  const loginWithOAuth = useCallback(
    async (provider, credentials) => {
      try {
        let response;
        if (provider === 'google') {
          response = await authApi.loginWithGoogle(credentials);
        } else if (provider === 'github') {
          response = await authApi.loginWithGithub(credentials);
        } else if (provider === 'facebook') {
          response = await authApi.loginWithFacebook(credentials);
        }
        contextLogin(response);
        return response;
      } catch (err) {
        throw err;
      }
    },
    [contextLogin]
  );

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,

    // Methods
    login,
    register,
    logout,
    verifyOTP,
    resendOTP,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    changePassword,
    refreshToken,
    loginWithOAuth,

    // Utility methods
    isLoggedIn,
    getUserRole,
    hasRole,
    isAdmin,
    getUserId,
    getUserEmail,
    isEmailVerified,
  };
};

export default useAuth;
