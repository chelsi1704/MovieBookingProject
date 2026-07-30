// Register page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Film, Eye, EyeOff } from 'lucide-react';
import authApi from '../../api/authApi';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const BG = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register, handleSubmit, watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.register(data);
      toast.success('Registered! Check your email for OTP');
      navigate('/verify-otp', {
        state: {
          email: data.email,
          purpose: 'REGISTER'
        }
      });
    } catch (error) {
      const msg = error.response?.data?.message
                  || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center
                    justify-center relative overflow-hidden py-8">
      <div className="absolute inset-0">
        <img src={BG} alt="Cinema"
             className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-dark/85" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass-modal p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-red-gradient rounded-2xl
                            flex items-center justify-center
                            shadow-lg shadow-primary/30 mb-4">
              <Film size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white
                           font-display">
              Create Account
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Join MovieBook today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4">
            <Input
              label="Full Name"
              icon={User}
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'At least 2 characters'
                }
              })}
            />

            <Input
              label="Email"
              icon={Mail}
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email'
                }
              })}
            />

            <Input
              label="Phone"
              icon={Phone}
              placeholder="9876543210"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone is required',
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Enter a valid Indian mobile number'
                }
              })}
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/80">
                Password
              </label>
              <div className="relative">
                <Lock size={16}
                      className="absolute left-3 top-1/2
                                 -translate-y-1/2 text-white/40" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 chars, uppercase, number, special"
                  className={`glass-input pl-10 pr-10
                    ${errors.password ? 'border-red-500/60' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'At least 8 characters'
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                      message:
                        'Must have uppercase, lowercase, number, special char'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2
                             -translate-y-1/2 text-white/40"
                >
                  {showPass ? <EyeOff size={16} />
                            : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login"
                  className="text-primary hover:text-primary-light
                             transition-colors font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;