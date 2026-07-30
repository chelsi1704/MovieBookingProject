// My bookings history page
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Spinner from "../../components/common/Spinner";
import bookingApi from "../../api/bookingApi";

const StatusBadge = ({ status }) => {
  const config = {
    CONFIRMED: {
      icon: CheckCircle,
      cls: "text-green-400 bg-green-500/10 border-green-500/30",
    },
    PENDING: {
      icon: AlertCircle,
      cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    },
    CANCELLED: {
      icon: XCircle,
      cls: "text-red-400 bg-red-500/10 border-red-500/30",
    },
    EXPIRED: {
      icon: XCircle,
      cls: "text-gray-400 bg-gray-500/10 border-gray-500/30",
    },
  };

  const { icon: Icon, cls } = config[status] || config.EXPIRED;

  return (
    <span
      className={`
      inline-flex items-center gap-1.5 px-2.5 py-1
      rounded-full text-xs font-semibold border ${cls}
    `}
    >
      <Icon size={11} />
      {status}
    </span>
  );
};

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingApi.cancel({
        bookingId,
        reason: "Cancelled by user",
      });

      toast.success("Booking cancelled successfully");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => bookingApi.getMyBookings().then((r) => r.data.data),
  });

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <h1
          className="text-2xl font-bold text-white
                       font-display mb-6"
        >
          My Bookings
        </h1>

        {isLoading ? (
          <Spinner className="py-20" size="lg" />
        ) : !bookings?.length ? (
          <div className="glass-card p-12 text-center">
            <Ticket size={40} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No bookings yet</p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary mt-4 text-sm"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 cursor-pointer
                           hover:border-primary/30
                           transition-all duration-300"
                onClick={() => {
                  if (booking.status === "CONFIRMED") {
                    navigate(`/my-tickets/${booking.id}`);
                  }
                }}
              >
                <div className="flex gap-4">
                  {booking.moviePoster && (
                    <img
                      src={
                        booking.moviePoster ||
                        "https://placehold.co/200x300?text=Movie"
                      }
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/200x300?text=Movie";
                      }}
                      alt={booking.movieTitle}
                      className="w-14 h-20 object-cover rounded-lg flex-shrink-0 border border-white/10"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div
                      className="flex items-start
                                    justify-between gap-2"
                    >
                      <h3
                        className="text-white font-semibold
                                     font-display truncate"
                      >
                        {booking.movieTitle}
                      </h3>
                      <p className="text-[11px] text-white/30 mt-1">
                        Ref: {booking.bookingRef}
                      </p>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div
                      className="mt-2 flex flex-col gap-1
                                    text-white/50 text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <MapPin size={11} />
                        {booking.theaterName}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="flex items-center
                                         gap-1"
                        >
                          <Calendar size={11} />
                          {booking.showDate}
                        </span>
                        <span
                          className="flex items-center
                                         gap-1"
                        >
                          <Clock size={11} />
                          {booking.showTime}
                        </span>
                      </div>
                      {booking.status === "PENDING" && booking.expiresAt && (
                        <p className="text-yellow-400 text-xs mt-1">
                          Expires:{" "}
                          {new Date(booking.expiresAt).toLocaleTimeString()}
                        </p>
                      )}
                      <div
                        className="flex items-center
                                      justify-between mt-1"
                      >
                        <p className="text-[11px] text-white/30 mt-2">
                          Booked on{" "}
                          {new Date(booking.bookedAt).toLocaleDateString()}
                        </p>
                        {booking.status === "CONFIRMED" && (
                          <button className="mt-3 text-xs text-primary font-semibold">
                            View Ticket →
                          </button>
                        )}
                        {booking.status === "PENDING" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(booking.id);
                            }}
                            className="mt-2 text-xs text-red-400"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <span
                          className="flex items-center
                                         gap-1"
                        >
                          <Ticket size={11} />
                          {booking.seats
                            ?.map((s) => `${s.rowLabel}${s.seatNumber}`)
                            .join(", ")}
                        </span>
                        <span
                          className="text-primary
                                         font-bold text-sm"
                        >
                          ₹{booking.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookingsPage;
