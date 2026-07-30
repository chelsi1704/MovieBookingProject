// Forgot password — email → OTP → new password
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, KeyRound } from 'lucide-react';
import authApi from '../../api/authApi';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const BG = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new pass
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch,
          formState: { errors } } = useForm();

  const handleEmailSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setEmail(data.email);
      setStep(2);
      toast.success('OTP sent to your email');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.verifyOtp({
        email,
        otpCode: data.otp,
        purpose: 'RESET_PASSWORD'
      });
      setStep(3);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Invalid OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({
        email,
        otpCode: data.otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Reset failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Email', done: step > 1 },
    { label: 'OTP', done: step > 2 },
    { label: 'New Password', done: false },
  ];

  return (
    <div className="min-h-screen flex items-center
                    justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={BG} alt=""
             className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-dark/85" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass-modal p-8">
          <div className="flex items-center justify-center gap-2
                          mb-6">
            {steps.map((s, i) => (
              <div key={s.label}
                   className="flex items-center gap-2">
                <div className={`
                  w-7 h-7 rounded-full text-xs font-bold
                  flex items-center justify-center
                  ${step === i + 1
                    ? 'bg-primary text-white'
                    : s.done
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white/40'}
                `}>
                  {s.done ? '✓' : i + 1}
                </div>
                <span className={`text-xs
                  ${step === i + 1
                    ? 'text-white'
                    : 'text-white/30'}`}>
                  {s.label}
                </span>
                {i < 2 && (
                  <div className="w-8 h-px bg-white/10" />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmit(handleEmailSubmit)}
                  className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white
                             font-display">
                Forgot Password?
              </h2>
              <p className="text-white/40 text-sm">
                Enter your email to receive a reset OTP
              </p>
              <Input
                label="Email"
                icon={Mail}
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email required'
                })}
              />
              <Button type="submit" loading={loading}
                      className="w-full">
                Send OTP
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(handleOtpSubmit)}
                  className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white
                             font-display">
                Enter OTP
              </h2>
              <p className="text-white/40 text-sm">
                Sent to {email}
              </p>
              <Input
                label="6-digit OTP"
                icon={KeyRound}
                placeholder="123456"
                maxLength={6}
                error={errors.otp?.message}
                {...register('otp', {
                  required: 'OTP required'
                })}
              />
              <Button type="submit" loading={loading}
                      className="w-full">
                Verify OTP
              </Button>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={handleSubmit(handlePasswordReset)}
              className="flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold text-white
                             font-display">
                New Password
              </h2>
              <Input
                label="New Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                {...register('newPassword', {
                  required: 'Required',
                  minLength: { value: 8,
                    message: 'At least 8 characters' }
                })}
              />
              <Input
                label="Confirm Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Required'
                })}
              />
              <Input
                label="OTP (re-enter for confirmation)"
                icon={KeyRound}
                placeholder="123456"
                {...register('otp', {
                  required: 'Required'
                })}
              />
              <Button type="submit" loading={loading}
                      className="w-full">
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;