// User profile page
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, Shield } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () =>
      axiosInstance.get('/api/users/me').then(r => r.data.data),
  });

  const { register, handleSubmit,
          formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    }
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await axiosInstance.put(
        '/api/users/me', data
      );
      updateUser(response.data.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Bookings', value: profile?.totalBookings || 0 },
    { label: 'Reviews', value: profile?.totalReviews || 0 },
    { label: 'Member Since',
      value: profile?.createdAt
        ? new Date(profile.createdAt).getFullYear()
        : '-' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-white
                       font-display mb-6">
          My Profile
        </h1>

        {/* Avatar + stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-4"
        >
          <div className="flex flex-col sm:flex-row
                          items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full
                              overflow-hidden border-2
                              border-primary/40">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full
                                  bg-primary/20 flex items-center
                                  justify-center">
                    <User size={32} className="text-primary" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white
                             font-display">
                {user?.name}
              </h2>
              <p className="text-white/50 text-sm">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2
                              justify-center sm:justify-start">
                <span className={`
                  text-xs px-2.5 py-1 rounded-full
                  ${user?.role === 'ADMIN'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}
                `}>
                  {user?.role}
                </span>
                {user?.isVerified && (
                  <span className="text-xs px-2.5 py-1
                                   rounded-full bg-green-500/20
                                   text-green-400
                                   border border-green-500/30">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-5
                          pt-5 border-t border-white/10">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-white font-bold text-xl">
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold">
              Personal Info
            </h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-primary text-sm hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4">
              <Input
                label="Full Name"
                icon={User}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name required'
                })}
              />
              <Input
                label="Phone"
                icon={Phone}
                {...register('phone')}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              {[
                { icon: User, label: 'Name', value: user?.name },
                { icon: Mail, label: 'Email', value: user?.email },
                { icon: Phone, label: 'Phone',
                  value: user?.phone || 'Not set' },
                { icon: Shield, label: 'Login Method',
                  value: user?.provider === 'GOOGLE'
                    ? 'Google Account'
                    : 'Email & Password' },
              ].map(item => (
                <div key={item.label}
                     className="flex items-center gap-3
                                py-3 border-b border-white/5
                                last:border-0">
                  <item.icon size={15}
                             className="text-primary/60
                                        flex-shrink-0" />
                  <div>
                    <p className="text-white/30 text-[10px]
                                  uppercase">
                      {item.label}
                    </p>
                    <p className="text-white text-sm mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;