// Handles redirect from Google OAuth2
// Extracts tokens from URL and logs the user in
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TokenUtils from '../../utils/tokenUtils';
import authApi from '../../api/authApi';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const OAuth2CallbackPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');

      if (!accessToken || !refreshToken) {
        toast.error('Google login failed. Please try again.');
        navigate('/login');
        return;
      }

      try {
        // Store tokens
        TokenUtils.setAccessToken(accessToken);
        TokenUtils.setRefreshToken(refreshToken);

        // Fetch user info with the new access token
        const response = await authApi.getMe();
        const user = response.data.data;

        // Log in
        login({ accessToken, refreshToken, user });
        toast.success(`Welcome, ${user.name}! 🎬`);
        navigate('/');
      } catch {
        toast.error('Login failed. Please try again.');
        navigate('/login');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-dark flex flex-col
                    items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-white/60">
        Completing Google sign in...
      </p>
    </div>
  );
};

export default OAuth2CallbackPage;