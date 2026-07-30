// Review booking + apply coupon before payment
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tag,
  Ticket,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import CountdownTimer from "../../components/booking/CountdownTimer";
import Button from "../../components/common/Button";
import offerApi from "../../api/offerApi";
import paymentApi from "../../api/paymentApi";
import toast from "react-hot-toast";

const ReviewBookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log("STATE =", state);

  const booking = state?.booking;
  console.log("expiresAt =", booking?.expiresAt);
  console.log("BOOKING =", booking);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [initiating, setInitiating] = useState(false);

  if (!booking) {
    console.log("Booking is NULL");
    return <h1 style={{ color: "white" }}>Booking is NULL</h1>;
  }

  // Preview total shown before the user clicks "Proceed to Payment".
  // This is display-only — the backend's order.amount is the real
  // charge. We show an estimate so the button label isn't surprising.
  const estimatedTotal = discount
    ? discount.finalAmount + booking.convenienceFee
    : booking.totalAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const response = await offerApi.apply({
        code: couponCode.toUpperCase(),
        orderAmount: booking.subtotal,
      });
      setDiscount(response.data.data);
      toast.success(response.data.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleProceedToPayment = async () => {
    console.log("Button clicked");
    console.log("Booking =", booking);
    console.log("Calling initiate payment API...");
    setInitiating(true);

    try {
      console.log("Booking =", booking);

      const response = await paymentApi.initiate({
        
        bookingRef: booking.bookingRef,
        paymentMethod: "CARD",
        ...(discount && { offerCode: discount.offerCode }),
      });
      console.log("API Response =", response);
      console.log("INITIATE RESPONSE =", response);

      const order = response.data.data;

      console.log("ORDER =", order);

      navigate("/payment", {
        
        state: {
          order,
          booking,
          discount,
        },
      }
    );
    console.log("Navigating to payment...");
    } catch (error) {
      console.log("ERROR =", error);
      console.log("ERROR RESPONSE =", error.response);

      toast.error(
        error.response?.data?.message || "Could not initiate payment.",
      );
    } finally {
      setInitiating(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-dark"
      style={{
        position: "relative",
        zIndex: 999999,
        background: "black",
      }}
    >
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        {/* Header with timer */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white font-display">
            Review Booking
          </h1>
          {/* <CountdownTimer expiresAt={booking.expiresAt} /> */}
        </div>

        {/* Booking summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-4"
        >
          {/* Movie info */}
          <div
            className="flex gap-4 pb-5 border-b
                          border-white/10 mb-5"
          >
            {booking.moviePoster && (
              <img
                src={booking.moviePoster}
                alt={booking.movieTitle}
                className="w-16 h-24 object-cover rounded-lg
                           border border-white/10 flex-shrink-0"
              />
            )}
            <div>
              <h2
                className="text-white font-bold text-lg
                             font-display mb-2"
              >
                {booking.movieTitle}
              </h2>
              <div
                className="flex flex-col gap-1.5
                              text-white/50 text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  {booking.theaterName}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {booking.showDate}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {booking.showTime} • {booking.screenName}
                </div>
                <div className="flex items-center gap-1.5">
                  <Ticket size={12} />
                  {booking.language}
                </div>
              </div>
            </div>
          </div>

          {/* Seats */}
          <div className="mb-5">
            <p className="text-white/50 text-xs mb-2">Selected Seats</p>
            <div className="flex flex-wrap gap-2">
              {booking.seats?.map((seat) => (
                <div
                  key={seat.bookingSeatId}
                  className="glass-card px-3 py-1.5 text-xs"
                >
                  <span className="text-white font-semibold">
                    {seat.rowLabel}
                    {seat.seatNumber}
                  </span>
                  <span className="text-white/40 ml-1">({seat.category})</span>
                  <span className="text-primary ml-2">
                    ₹{seat.priceAtBooking}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">
                Subtotal ({booking.totalSeats} tickets)
              </span>
              <span className="text-white">
                ₹{booking.subtotal?.toLocaleString("en-IN")}
              </span>
            </div>

            {discount && (
              <div
                className="flex justify-between
                              text-green-400"
              >
                <span>Discount ({discount.offerCode})</span>
                <span>
                  -₹{discount.discountAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-white/50">Convenience Fee</span>
              <span className="text-white">₹{booking.convenienceFee}</span>
            </div>

            <div
              className="flex justify-between pt-2
                            border-t border-white/10 mt-1"
            >
              <span className="text-white font-bold">Total</span>
              {/* estimatedTotal is a preview only — the confirmed
                  charge comes from order.amount on the payment page */}
              <span className="text-primary font-bold text-lg">
                ₹{estimatedTotal?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Coupon input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Tag size={14} className="text-primary" />
            <span className="text-white text-sm font-semibold">
              Apply Coupon
            </span>
          </div>

          {discount ? (
            <div
              className="flex items-center justify-between
                            bg-green-500/10 border border-green-500/30
                            rounded-lg p-3"
            >
              <div>
                <p className="text-green-400 font-semibold text-sm">
                  {discount.offerCode} applied!
                </p>
                <p className="text-green-400/60 text-xs">
                  You saved ₹{discount.discountAmount?.toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => {
                  setDiscount(null);
                  setCouponCode("");
                }}
                className="text-white/40 hover:text-white
                           text-xs"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="glass-input flex-1 uppercase
                           text-sm"
              />
              <Button
                onClick={handleApplyCoupon}
                loading={applyingCoupon}
                variant="outline"
                size="sm"
              >
                Apply
              </Button>
            </div>
          )}
        </motion.div>

        {/* Proceed button */}
        {/* Click Test */}
        <div
          onClick={handleProceedToPayment}
          style={{
            width: "100%",
            height: "80px",
            background: "red",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "24px",
            position: "relative",
            zIndex: 99999,
          }}
        >
          CLICK ME
        </div>

        <p className="text-center text-white/30 text-xs mt-3">
          🔒 Secure payment. Booking ref: {booking.bookingRef}
        </p>
      </div>
    </div>
  );
};

export default ReviewBookingPage;
