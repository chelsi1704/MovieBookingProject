import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import TokenUtils from '../utils/tokenUtils';
import authApi from '../api/authApi';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // User state — null means not logged in
  const [user, setUser] = useState(null);

  // Loading state — true while checking if user is already logged in
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = TokenUtils.getRefreshToken();
      const savedUser = TokenUtils.getUser();

      if (refreshToken && savedUser) {
        try {
          // Get new access token using refresh token
          const response = await authApi.refreshToken(refreshToken);
          const { accessToken } = response.data.data;

          TokenUtils.setAccessToken(accessToken);
          setUser(savedUser);

        } catch (error) {
          // Refresh failed — clear everything
          TokenUtils.clearAll();
          setUser(null);
        }
      }
      // Done checking — show the app
      setLoading(false);
    };

    restoreSession();
  }, []);


  const login = useCallback((authData) => {
    const { accessToken, refreshToken, user: userData } = authData;

    TokenUtils.setAccessToken(accessToken);
    TokenUtils.setRefreshToken(refreshToken);
    TokenUtils.setUser(userData);
    setUser(userData);
  }, []);


  const logout = useCallback(async () => {
    const refreshToken = TokenUtils.getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      // Even if API call fails — clear local data
      console.error('Logout API error:', error);
    } finally {
      TokenUtils.clearAll();
      setUser(null);
      toast.success('Logged out successfully');
    }
  }, []);


  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    TokenUtils.setUser(updatedUser);
  }, []);

  // Computed values
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isTheaterOwner = user?.role === 'THEATER_OWNER';

  const value = {
    user,
    loading,
    isLoggedIn,
    isAdmin,
    isTheaterOwner,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show loading spinner while restoring session */}
      {loading ? (
        <div className="min-h-screen bg-dark flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* Spinning red circle */}
            <div className="w-12 h-12 border-4 border-primary/30
                            border-t-primary rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error(
    'useAuth must be used inside AuthProvider'
  );
  return context;
};

export default AuthContext;