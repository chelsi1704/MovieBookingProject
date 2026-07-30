// OTP verification page — 6 digit input boxes
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import authApi from '../../api/authApi';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, purpose } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() =>
      setResendTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace moves to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    // Paste full OTP at once
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted.split(''));
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyOtp({ email, otpCode, purpose });
      toast.success('Email verified successfully! 🎉');

      if (purpose === 'REGISTER') {
        navigate('/login');
      } else {
        navigate('/forgot-password',
          { state: { email, otpVerified: true } });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Invalid OTP'
      );
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendOtp(email, purpose);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      toast.success('New OTP sent to your email');
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center
                    justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-modal p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary/20 rounded-full
                          flex items-center justify-center
                          mx-auto mb-6 border border-primary/30">
            <Mail size={28} className="text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-white
                         font-display mb-2">
            Verify Email
          </h1>
          <p className="text-white/50 text-sm mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-primary font-semibold text-sm mb-8">
            {email}
          </p>

          {/* OTP inputs */}
          <div className="flex gap-3 justify-center mb-6"
               onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`
                  w-11 h-14 text-center text-xl font-bold
                  glass-input rounded-xl
                  ${digit ? 'border-primary/60 text-primary'
                           : 'border-white/10'}
                  focus:border-primary focus:scale-105
                  transition-all duration-200
                `}
              />
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            loading={loading}
            className="w-full mb-5"
          >
            Verify OTP
          </Button>

          {/* Resend */}
          <div className="text-white/40 text-sm">
            Didn't receive it?{' '}
            {resendTimer > 0 ? (
              <span className="text-white/30">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary hover:text-primary-light
                           transition-colors font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;