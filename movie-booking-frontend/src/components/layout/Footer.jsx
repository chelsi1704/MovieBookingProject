import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #e50914, #ff6b6b)',
                }}
              >
                <Film size={16} className="text-white" />
              </div>

              <span
                className="text-lg font-bold"
                style={{
                  background: 'linear-gradient(135deg, #e50914, #ff6b6b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                MovieBook
              </span>
            </div>

            <p className="text-white/40 text-sm leading-relaxed">
              Book your favorite movie tickets online.
              Best seats, best experience.
            </p>
          </div>

          {/* Movies */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              Movies
            </h4>

            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  Now Playing
                </Link>
              </li>

              <li>
                <Link
                  to="/?tab=upcoming"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  Upcoming
                </Link>
              </li>

              <li>
                <Link
                  to="/?tab=toprated"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  Top Rated
                </Link>
              </li>

              <li>
                <Link
                  to="/search"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              Account
            </h4>

            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/login"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  Register
                </Link>
              </li>

              <li>
                <Link
                  to="/my-bookings"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  My Bookings
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              Follow Us
            </h4>

            <div className="flex gap-3">
              <button
                className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              >
                G
              </button>

              <button
                className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              >
                T
              </button>

              <button
                className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              >
                I
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/30 text-sm">
          © 2026 MovieBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;