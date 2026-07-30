import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film, Search, Bell, User, Moon, Sun,
  LogOut, Ticket, Heart, Settings,
  ChevronDown, Menu, X, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import notificationApi from '../../api/notificationApi';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Detect scroll to apply glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Get unread notification count
  const { data: unreadData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: () =>
      notificationApi.getUnreadCount()
        .then(r => r.data.data),
    enabled: isLoggedIn,
    refetchInterval: 30000, // refresh every 30 seconds
  });

  const unreadCount = unreadData?.unreadCount || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.nav
      className={`
        fixed top-0 left-0 right-0 z-40
        transition-all duration-300
        ${scrolled ? 'glass-nav shadow-lg' : 'bg-transparent'}
      `}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-red-gradient rounded-lg
                            flex items-center justify-center
                            shadow-lg shadow-primary/30
                            group-hover:shadow-primary/50
                            transition-all duration-300">
              <Film size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display
                             text-gradient hidden sm:block">
              MovieBook
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-white/70 hover:text-white
                         transition-colors text-sm font-medium"
            >
              Movies
            </Link>
            <Link
              to="/search"
              className="text-white/70 hover:text-white
                         transition-colors text-sm font-medium"
            >
              Search
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">

            {/* Search icon */}
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-lg hover:bg-white/10
                         text-white/60 hover:text-white
                         transition-all"
            >
              <Search size={18} />
            </button>

            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9, rotate: 180 }}
              className="p-2 rounded-lg hover:bg-white/10
                         text-white/60 hover:text-white
                         transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {isLoggedIn ? (
              <>
                {/* Notification bell */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 rounded-lg
                             hover:bg-white/10 text-white/60
                             hover:text-white transition-all"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5
                                     w-4 h-4 bg-primary rounded-full
                                     text-white text-[10px]
                                     flex items-center justify-center
                                     font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setUserMenuOpen(prev => !prev)}
                    className="flex items-center gap-2
                               glass-card px-3 py-1.5
                               hover:border-primary/40
                               transition-all"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-6 h-6 rounded-full
                                   object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full
                                      bg-primary/20
                                      flex items-center
                                      justify-center">
                        <User size={12}
                              className="text-primary" />
                      </div>
                    )}
                    <span className="text-sm text-white/80
                                     hidden sm:block max-w-[80px]
                                     truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-white/40 transition-transform
                        ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2
                                   w-52 glass-modal py-2 z-50"
                      >
                        {/* User info */}
                        <div className="px-4 py-2 border-b
                                        border-white/10 mb-1">
                          <p className="text-white text-sm
                                        font-medium truncate">
                            {user?.name}
                          </p>
                          <p className="text-white/40 text-xs
                                        truncate">
                            {user?.email}
                          </p>
                        </div>

                        {[
                          { icon: User, label: 'My Profile',
                            to: '/profile' },
                          { icon: Ticket, label: 'My Bookings',
                            to: '/my-bookings' },
                          { icon: Heart, label: 'Wishlist',
                            to: '/wishlist' },
                        ].map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-3
                                       px-4 py-2.5 text-sm
                                       text-white/70 hover:text-white
                                       hover:bg-white/5
                                       transition-all"
                          >
                            <item.icon size={15} />
                            {item.label}
                          </Link>
                        ))}

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3
                                       px-4 py-2.5 text-sm
                                       text-primary/80
                                       hover:text-primary
                                       hover:bg-white/5
                                       transition-all"
                          >
                            <Shield size={15} />
                            Admin Panel
                          </Link>
                        )}

                        <div className="border-t border-white/10
                                        mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3
                                       px-4 py-2.5 text-sm
                                       text-red-400/80
                                       hover:text-red-400
                                       hover:bg-white/5
                                       transition-all w-full"
                          >
                            <LogOut size={15} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Login/Register buttons */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn-ghost text-sm px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg
                         hover:bg-white/10 text-white/60
                         hover:text-white transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t
                       border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              <Link to="/"
                    className="text-white/70 hover:text-white
                               py-2 text-sm">
                Movies
              </Link>
              <Link to="/search"
                    className="text-white/70 hover:text-white
                               py-2 text-sm">
                Search
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/my-bookings"
                        className="text-white/70 hover:text-white
                                   py-2 text-sm">
                    My Bookings
                  </Link>
                  <Link to="/profile"
                        className="text-white/70 hover:text-white
                                   py-2 text-sm">
                    Profile
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;