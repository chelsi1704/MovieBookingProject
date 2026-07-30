// Booking confirmed — confetti + tickets display
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  Download,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  QrCode,
  Home,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/common/Button";

const BookingConfirmedPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;
  const confettiDone = useRef(false);

  // Fire confetti on mount — only once
  useEffect(() => {
    if (confettiDone.current) return;
    confettiDone.current = true;

    // First burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: ["#e50914", "#ff6b6b", "#ffd700", "#ffffff", "#ff4500"],
    });

    // Second burst after 300ms
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.5 },
        colors: ["#e50914", "#ffd700"],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.5 },
        colors: ["#e50914", "#ffd700"],
      });
    }, 300);
  }, []);

  if (!booking) {
    return (
      <div
        className="min-h-screen bg-dark flex items-center
                      justify-center"
      >
        <div className="text-center">
          <p className="text-white/50 mb-4">No booking data found</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 pt-24 pb-12">
        {/* Success header */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-8"
        >
          <div
            className="w-20 h-20 rounded-full
                          bg-green-500/20 border-2
                          border-green-500/50
                          flex items-center justify-center
                          mx-auto mb-4"
          >
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h1
            className="text-3xl font-bold text-white
                         font-display mb-2"
          >
            Booking Confirmed!
          </h1>
          <p className="text-white/50 text-sm">Your tickets are ready 🎉</p>
          <div
            className="inline-flex items-center gap-2
                          mt-3 px-4 py-2 rounded-full
                          bg-primary/10 border border-primary/30"
          >
            <Ticket size={12} className="text-primary" />
            <span
              className="text-primary font-mono font-bold
                             text-sm"
            >
              {booking.bookingRef}
            </span>
          </div>
        </motion.div>

        {/* Booking details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card overflow-hidden mb-5"
        >
          {/* Movie header */}
          <div
            className="bg-gradient-to-r from-primary/20
                to-transparent px-5 py-4
                border-b border-white/10"
          >
            <div className="flex gap-4 items-center">
              <img
                src={booking.moviePoster}
                alt={booking.movieTitle}
                className="w-16 h-24 rounded-lg object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x450?text=No+Poster")
                }
              />

              <div>
                <h2 className="text-white font-bold font-display text-lg">
                  {booking.movieTitle}
                </h2>

                <div className="flex gap-3 mt-1 text-white/50 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {booking.theaterName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Show details */}
          <div
            className="px-5 py-4 grid grid-cols-2 gap-3
                          border-b border-white/10"
          >
            <div>
              <p
                className="text-white/30 text-[10px] uppercase
                            mb-0.5"
              >
                Date
              </p>
              <div
                className="flex items-center gap-1.5
                              text-white text-sm"
              >
                <Calendar size={12} className="text-primary" />
                {booking.showDate}
              </div>
            </div>
            <div>
              <p
                className="text-white/30 text-[10px] uppercase
                            mb-0.5"
              >
                Time
              </p>
              <div
                className="flex items-center gap-1.5
                              text-white text-sm"
              >
                <Clock size={12} className="text-primary" />
                {booking.showTime?.substring(0, 5)}
              </div>
            </div>
            <div>
              <p
                className="text-white/30 text-[10px] uppercase
                            mb-0.5"
              >
                Screen
              </p>
              <p className="text-white text-sm">{booking.screenName}</p>
            </div>
            <div>
              <p
                className="text-white/30 text-[10px] uppercase
                            mb-0.5"
              >
                Language
              </p>
              <p className="text-white text-sm">{booking.language}</p>
            </div>
          </div>

          {/* Seats */}
          <div
            className="px-5 py-4 ticket-edge
                          border-b border-dashed
                          border-white/10"
          >
            <p
              className="text-white/30 text-[10px] uppercase
                          mb-2"
            >
              Seats
            </p>
            <div className="flex flex-wrap gap-2">
              {booking.seats?.map((seat) => (
                <div
                  key={seat.bookingSeatId}
                  className="px-3 py-1.5 glass-card
                             border-primary/30 text-sm"
                >
                  <span className="text-white font-bold">
                    {seat.rowLabel}
                    {seat.seatNumber}
                  </span>
                  <span className="text-white/40 text-xs ml-1">
                    {seat.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div
            className="px-5 py-4 flex justify-between
                          items-center"
          >
            <span className="text-white/50 text-sm">Total Paid</span>
            <span className="text-primary font-bold text-xl">
              ₹{booking.totalAmount?.toLocaleString("en-IN")}
            </span>
          </div>
        </motion.div>

        {/* QR placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 text-center mb-5"
        >
          <div
            className="w-24 h-24 mx-auto mb-3
                          bg-white rounded-xl flex items-center
                          justify-center"
          >
            <QrCode size={60} className="text-gray-800" />
          </div>
          <p className="text-white/50 text-xs">
            Show this QR code at the theater entrance
          </p>
          <p className="text-white/30 text-[10px] mt-1">
            Or show booking ref: {booking.bookingRef}
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <Button
            onClick={() => navigate("/my-bookings")}
            variant="ghost"
            className="flex-1"
          >
            <Ticket size={16} />
            My Bookings
          </Button>
          <Button onClick={() => navigate("/")} className="flex-1">
            <Home size={16} />
            Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmedPage;
